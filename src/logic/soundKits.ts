export interface SampleKit {
  id: string
  label: string
  /** Asset URLs. `main` plays on normal steps, `accent` on accented steps. */
  main: string
  accent: string
}

export interface SynthKit {
  id: typeof SYNTH_KIT_ID
  label: string
}

export type SoundKit = SynthKit | SampleKit

export const SYNTH_KIT_ID = 'synth'
export const SYNTH_KIT: SynthKit = { id: SYNTH_KIT_ID, label: 'Classic' }

export function isSampleKit(kit: SoundKit): kit is SampleKit {
  return 'main' in kit
}

/** "old-school" → "Old School", "airblocks" → "Airblocks". */
export function kitLabel(folder: string): string {
  return folder
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Groups `{ '<any>/sounds/<kit>/main.wav': url, ... }` into kits. Folders missing either file are
 * skipped. Sorted by label, case-insensitively.
 */
export function kitsFromFiles(files: Record<string, string>): SampleKit[] {
  const byFolder = new Map<string, Partial<Record<'main' | 'accent', string>>>()
  for (const [path, url] of Object.entries(files)) {
    const match = path.match(/\/([^/]+)\/(main|accent)\.wav$/)
    if (!match) continue
    const [, folder, role] = match
    const entry = byFolder.get(folder) ?? {}
    entry[role as 'main' | 'accent'] = url
    byFolder.set(folder, entry)
  }

  const kits: SampleKit[] = []
  for (const [folder, { main, accent }] of byFolder) {
    if (main && accent) kits.push({ id: folder.toLowerCase(), label: kitLabel(folder), main, accent })
  }
  return kits.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
}

/**
 * Index of the first sample louder than `threshold` (default −60 dBFS) in any channel, so leading
 * silence in a file can be skipped and the hit lands exactly on the beat.
 */
export function findOnset(channels: ArrayLike<number>[], threshold = 0.001): number {
  const length = Math.min(...channels.map((c) => c.length))
  for (let i = 0; i < length; i++) {
    for (const channel of channels) {
      if (Math.abs(channel[i]) > threshold) return i
    }
  }
  return 0
}
