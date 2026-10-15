import { playClick } from './clicks'
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

interface ScheduledBeat {
  step: number
  time: number
}

type StepListener = (step: number) => void

export interface EngineSettings {
  bpm: number
  steps: StepState[]
  volume: number
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

  private running = false
  private nextStep = 0
  private nextBeatTime = 0
  private queue: ScheduledBeat[] = []
  private displayedStep = -1
  private listeners = new Set<StepListener>()

  constructor(settings: Partial<EngineSettings> = {}) {
    this.bpm = clampBpm(settings.bpm ?? DEFAULT_BPM)
    this.steps = settings.steps ?? DEFAULT_STEPS
    this.volume = settings.volume ?? DEFAULT_VOLUME
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

  /** Subscribe to the step that is currently sounding (-1 when stopped). Returns an unsubscribe function. */
  subscribe(listener: StepListener): () => void {
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
    this.setDisplayedStep(-1)
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
      if (state !== 'mute') playClick(ctx, this.nextBeatTime, state, this.bus)
      this.queue.push({ step, time: this.nextBeatTime })

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
    let step = this.displayedStep
    while (this.queue.length > 0 && this.queue[0].time <= heardTime) {
      step = this.queue.shift()!.step
    }
    this.setDisplayedStep(step)
    this.rafId = requestAnimationFrame(this.draw)
  }

  private setDisplayedStep(step: number): void {
    if (step === this.displayedStep) return
    this.displayedStep = step
    this.listeners.forEach((listener) => listener(step))
  }
}
