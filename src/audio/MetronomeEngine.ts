import { playClick, playSample } from './clicks'
import { loadKit, type KitSamples } from './samples'
import { DEFAULT_DROPS, isDropped, type DropSettings } from '../logic/drops'
import { isSampleKit, SYNTH_KIT, type SoundKit } from '../logic/soundKits'
import { DEFAULT_STEPS, type StepState } from '../logic/steps'
import { clampBpm, DEFAULT_BPM } from '../logic/tempo'
import { DEFAULT_VOLUME, faderToGain } from '../logic/volume'

/** How often the worker wakes the scheduler. */
const TICK_INTERVAL_MS = 25
/** How far ahead of the audio clock clicks are scheduled. Must comfortably exceed the tick interval. */
const SCHEDULE_AHEAD_S = 0.1
/** Delay before the first click so it isn't clipped. */
const START_DELAY_S = 0.05
/** If scheduling falls this far behind (e.g. the device slept), skip ahead instead of firing a burst of late clicks. */
const MAX_LAG_S = 0.2

interface ScheduledBeat extends ActiveBeat {
  time: number
}

/** The beat currently being heard. `step` is -1 when stopped; `dropped` means Drops silenced it. */
export interface ActiveBeat {
  step: number
  dropped: boolean
}

type BeatListener = (beat: ActiveBeat) => void

const STOPPED: ActiveBeat = { step: -1, dropped: false }

export interface EngineSettings {
  bpm: number
  steps: StepState[]
  volume: number
  drops: DropSettings
  kit: SoundKit
}

/**
 * Lookahead metronome scheduler ("A Tale of Two Clocks"): a worker tick schedules clicks a little
 * ahead on the sample-accurate AudioContext clock, so JS timer jitter never reaches the audio.
 * Lives outside React; the UI pushes settings in and subscribes to the currently sounding step.
 */
export class MetronomeEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  /** Per-run bus; disconnecting it on stop silences clicks that were already scheduled. */
  private bus: GainNode | null = null
  private worker: Worker | null = null
  private rafId: number | null = null

  private bpm: number
  private steps: StepState[]
  private volume: number
  private drops: DropSettings
  private kit: SoundKit = SYNTH_KIT
  /** Decoded samples for `kit`; null while loading (or for the synth kit), which falls back to synth clicks. */
  private samples: KitSamples | null = null

  private running = false
  private nextStep = 0
  private nextBeatTime = 0
  private queue: ScheduledBeat[] = []
  private displayed: ActiveBeat = STOPPED
  private listeners = new Set<BeatListener>()

  constructor(settings: Partial<EngineSettings> = {}) {
    this.bpm = clampBpm(settings.bpm ?? DEFAULT_BPM)
    this.steps = settings.steps ?? DEFAULT_STEPS
    this.volume = settings.volume ?? DEFAULT_VOLUME
    this.drops = settings.drops ?? DEFAULT_DROPS
    this.setKit(settings.kit ?? SYNTH_KIT)
  }

  get isRunning(): boolean {
    return this.running
  }

  /** Takes effect from the next unscheduled beat. */
  setBpm(bpm: number): void {
    this.bpm = clampBpm(bpm)
  }

  setSteps(steps: StepState[]): void {
    this.steps = steps
    if (this.nextStep >= steps.length) this.nextStep = 0
  }

  setVolume(volume: number): void {
    this.volume = volume
    if (this.ctx && this.master) {
      // Smooth the change so dragging the fader doesn't produce zipper noise.
      this.master.gain.setTargetAtTime(faderToGain(volume), this.ctx.currentTime, 0.015)
    }
  }

  /** Takes effect from the next unscheduled beat (within ~100ms). */
  setDrops(drops: DropSettings): void {
    this.drops = drops
  }

  /** Switches click sounds from the next unscheduled beat. Sample kits load in the background. */
  setKit(kit: SoundKit): void {
    if (kit.id === this.kit.id && (this.samples || !isSampleKit(kit))) return
    this.kit = kit
    this.samples = null
    if (!isSampleKit(kit)) return
    loadKit(kit).then(
      (samples) => {
        if (this.kit.id === kit.id) this.samples = samples
      },
      (error: unknown) => console.warn(`Couldn't load sound "${kit.label}", using Classic clicks instead.`, error),
    )
  }

  /** Subscribe to the beat that is currently being heard. Returns an unsubscribe function. */
  subscribe(listener: BeatListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /** Must be called from a user gesture (click/keypress) so the browser allows audio to start. */
  start(): void {
    if (this.running) return
    const ctx = this.ensureAudio()
    if (ctx.state !== 'running') void ctx.resume()

    this.bus = ctx.createGain()
    this.bus.connect(this.master!)
    this.running = true
    this.nextStep = 0
    this.nextBeatTime = ctx.currentTime + START_DELAY_S
    this.queue = []

    this.schedule()
    this.ensureWorker().postMessage({ type: 'start', intervalMs: TICK_INTERVAL_MS })
    this.rafId = requestAnimationFrame(this.draw)
  }

  stop(): void {
    if (!this.running) return
    this.running = false
    this.worker?.postMessage({ type: 'stop' })
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.bus?.disconnect()
    this.bus = null
    this.queue = []
    this.setDisplayed(STOPPED)
  }

  dispose(): void {
    this.stop()
    this.worker?.terminate()
    this.worker = null
    void this.ctx?.close()
    this.ctx = null
    this.master = null
    this.listeners.clear()
  }

  private ensureAudio(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: 'interactive' })
      this.master = this.ctx.createGain()
      this.master.gain.value = faderToGain(this.volume)
      this.master.connect(this.ctx.destination)
    }
    return this.ctx
  }

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./scheduler.worker.ts', import.meta.url), { type: 'module' })
      this.worker.onmessage = () => this.schedule()
    }
    return this.worker
  }

  private schedule = (): void => {
    const ctx = this.ctx
    if (!this.running || !ctx || !this.bus) return

    if (this.nextBeatTime < ctx.currentTime - MAX_LAG_S) {
      this.nextBeatTime = ctx.currentTime + START_DELAY_S
    }

    while (this.nextBeatTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const step = this.nextStep
      const state = this.steps[step] ?? 'normal'
      // Rolled per beat at schedule time, so each pass through the bar gets fresh random drops.
      const dropped = state !== 'mute' && this.drops.enabled && isDropped(this.drops.density)
      if (state !== 'mute' && !dropped) {
        if (this.samples) playSample(ctx, this.nextBeatTime, state === 'accent' ? this.samples.accent : this.samples.main, this.bus)
        else playClick(ctx, this.nextBeatTime, state, this.bus)
      }
      this.queue.push({ step, dropped, time: this.nextBeatTime })

      this.nextBeatTime += 60 / this.bpm
      this.nextStep = (step + 1) % this.steps.length
    }
  }

  /** Advances the visual beat in step with what is actually audible. */
  private draw = (): void => {
    const ctx = this.ctx
    if (!this.running || !ctx) return

    // Sound leaves the speakers roughly `outputLatency` after currentTime reaches it.
    const heardTime = ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0)
    let beat = this.displayed
    while (this.queue.length > 0 && this.queue[0].time <= heardTime) {
      beat = this.queue.shift()!
    }
    this.setDisplayed(beat)
    this.rafId = requestAnimationFrame(this.draw)
  }

  private setDisplayed(beat: ActiveBeat): void {
    if (beat.step === this.displayed.step && beat.dropped === this.displayed.dropped) return
    this.displayed = { step: beat.step, dropped: beat.dropped }
    this.listeners.forEach((listener) => listener(this.displayed))
  }
}
