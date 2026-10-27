// The Audio Session API (Safari 16.4+) isn't in TypeScript's DOM types yet.
type AudioSessionType = 'auto' | 'playback' | 'transient' | 'transient-solo' | 'ambient' | 'play-and-record'

interface AudioSession {
  type: AudioSessionType
}

function audioSession(): AudioSession | undefined {
  return (navigator as Navigator & { audioSession?: AudioSession }).audioSession
}

/** True where the page can opt out of the silent switch (iOS 17+ Safari), so no silent-mode warning is needed. */
export function canBypassSilentMode(): boolean {
  return audioSession() !== undefined
}

/**
 * Web Audio defaults to the "ambient" session on iOS, which the silent switch mutes. "playback" makes the
 * metronome audible like a video, at the cost of pausing other apps' audio, so it's only held while playing.
 */
export function setPlaybackSession(playing: boolean): void {
  const session = audioSession()
  if (session) session.type = playing ? 'playback' : 'auto'
}
