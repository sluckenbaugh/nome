import { findOnset, type SampleKit } from '../logic/soundKits'

export interface Sample {
  buffer: AudioBuffer
  /** Seconds of leading silence to skip so the hit lands on the beat. */
  offset: number
}

export interface KitSamples {
  main: Sample
  accent: Sample
}

// Decoding doesn't need a running (user-gesture) AudioContext, so kits can load before Start is pressed.
// AudioBuffers aren't tied to the context that decoded them; playback resamples if rates differ.
let decoder: OfflineAudioContext | null = null
const cache = new Map<string, Promise<KitSamples>>()

async function loadSample(url: string): Promise<Sample> {
  decoder ??= new OfflineAudioContext(1, 1, 48000)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} loading ${url}`)
  const buffer = await decoder.decodeAudioData(await response.arrayBuffer())
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c))
  return { buffer, offset: findOnset(channels) / buffer.sampleRate }
}

/** Loads and decodes a kit's two files once; later calls share the same promise. */
export function loadKit(kit: SampleKit): Promise<KitSamples> {
  let promise = cache.get(kit.id)
  if (!promise) {
    promise = Promise.all([loadSample(kit.main), loadSample(kit.accent)]).then(([main, accent]) => ({ main, accent }))
    promise.catch(() => cache.delete(kit.id)) // allow a retry after a failed load
    cache.set(kit.id, promise)
  }
  return promise
}
