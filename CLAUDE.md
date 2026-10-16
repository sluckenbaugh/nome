# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Nome** is a free browser metronome. It needs no sign-up, accounts or backend. The feature scope is in `project-scope.md` and the original stack notes are in `tech-stack.md`.

It's a frontend-only single-page app. Everything runs in the browser using built-in browser APIs (Web Audio, Web Workers, `requestAnimationFrame`, `localStorage`, `matchMedia`, keyboard events). There are no external or third-party APIs, so don't add a backend or server calls unless a feature truly needs one, such as presets that sync across devices.

## Stack

- React 19 + TypeScript (target/lib **ES2022**) + Vite 6
- Tailwind CSS v4 via `@tailwindcss/vite`. There is no `tailwind.config`; the setup lives in `src/index.css`.
- Vitest 3 for unit tests (node environment, configured in `vite.config.ts`)
- No React Router: it's one page, so add it only if more pages appear.
- No audio library (not Tone.js): we use the Web Audio API directly, on purpose.
- Deploys to Render as a static site (`render.yaml`: `npm ci && npm run build`, publishes `dist/`)

## Commands

```sh
npm run dev       # dev server
npm test          # vitest run (unit tests)
npm run test:watch
npm run lint      # eslint
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve production build
```

Before saying work is finished, run `npx tsc -b`, `npm run lint`, `npm test` and `npm run build`.

## Product decisions (settled — don't re-ask)

- **Tempo range:** 20–300 BPM, whole numbers only (`src/logic/tempo.ts`). Halving and doubling clamp to this range.
- **Steps:** each step is one beat in the bar. There are 1–16 steps, shown in a grid of four per row (step 5 starts a second row), and each is `'normal' | 'accent' | 'mute'`. Clicking a step cycles normal → accent → mute. The count can be changed with the −/+ buttons or typed into the Steps number input; `setStepCount` adds new steps as normal and removes steps from the end. The default is `['accent','normal','normal','normal']`. The step grid replaces the separate accent on/off control from the MVP spec.
- **Drops:** an LED switch labelled "Drops" (the LED and `aria-pressed` show its state; no on/off text) in the label column of a 0–100% density fader (5% steps), at the bottom of the Steps module. When on, every beat that would sound is silenced with probability = density, rolled fresh each time (`isDropped` in `src/logic/drops.ts`). Accents can be dropped too, and steps the user has muted aren't counted as drops. The roll happens in the engine's `schedule()` when the beat is booked, never in React. While playing, the LED above a dropped beat's pad shows a hollow amber ring instead of lighting, and the pad doesn't press. The fader can be adjusted while Drops is off (it's dimmed).
- **Sounds:** chosen from a "Sound" dropdown above Volume (`SoundSelect`, built on the custom `Select`). "Classic" is the built-in synthesized click and the default; every other option is a sample kit.
  - **Adding a kit:** create `src/assets/sounds/<folder>/` containing `main.wav` (normal steps) and `accent.wav` (accented steps). `import.meta.glob` in `src/audio/soundKits.ts` picks it up automatically; no code change is needed. The label comes from the folder name (`old-school` → "Old School") and the id is the lowercase folder name. Folders missing either file are skipped.
  - **Files:** WAV only (MP3, AAC and Opus add silence at the start, which makes clicks late). Mono, 48 kHz, 16-bit, accent peak around −1 dBFS, normal 3–6 dB quieter. Keep clicks under about 150ms so they don't overlap at 300 BPM.
  - **Loading:** kits are decoded once with an `OfflineAudioContext` (`src/audio/samples.ts`), so no user gesture is needed and they load before Start. Leading silence below −60 dBFS is skipped automatically (`findOnset` → `source.start(time, offset)`). While a kit is loading, or if it fails to load, the engine plays Classic clicks instead.
- **Saved settings:** stored in `localStorage` with the keys `nome:bpm`, `nome:steps`, `nome:volume`, `nome:drops` (`{enabled, density}`), `nome:kit` (kit id) and `nome:theme`.
- **Theme:** follows the OS setting until the user toggles it. After that the choice is stored as `'light'|'dark'`.
- **Keyboard:** **Space = Start/Stop** and **Enter/Return = tap tempo**, handled for the whole page in `useKeyboardShortcuts.ts`. The shortcuts are skipped while typing (so Enter in the BPM field confirms the value), and on a button reached with Tab (navigation mode is tracked: Tab sets keyboard mode, any pointerdown clears it), so Tab users can still press buttons with Space or Enter. A button focused by a mouse click doesn't block them; `preventDefault` stops that button from double-firing.

## Architecture

```
src/
  audio/
    MetronomeEngine.ts    # lookahead scheduler, master gain, per-run bus, visual beat queue
    scheduler.worker.ts   # Web Worker: setInterval → postMessage('tick')
    clicks.ts             # playClick (synth) and playSample (decoded kit sample, with onset offset)
    samples.ts            # loadKit: fetch + decode + onset detection, cached per kit
    soundKits.ts          # SOUND_KITS from import.meta.glob of src/assets/sounds/*/{main,accent}.wav
  logic/                  # pure, framework-free, unit-tested
    tempo.ts              # clampBpm, halveBpm, doubleBpm, isBpm, MIN/MAX/DEFAULT_BPM
    steps.ts              # StepState, cycleStep, setStepCount, addStep, removeStep, isSteps (1–16)
    tapTempo.ts           # TapTempo class: average of last 6 taps, reset after 2s gap
    volume.ts             # faderToGain (squared curve), isVolume
    drops.ts              # DropSettings, isDropped(density, random), isDropSettings
    soundKits.ts          # SoundKit types, kitsFromFiles, kitLabel, findOnset (pure, tested)
  hooks/
    useMetronome.ts       # owns one engine instance; syncs bpm/steps/volume; exposes isPlaying/activeStep/toggle
    usePersistentState.ts # useState + localStorage with a validator fallback
    useTheme.ts           # toggles the `dark` class on <html>
    useTapTempo.ts        # tap(timeMs) → BPM via TapTempo, plus flash state
    useKeyboardShortcuts.ts # global Space → start/stop, Enter → tap
  components/             # presentational: TempoControl, StepGrid, DropsControl, SoundSelect, Select, SliderRow, CommitNumberInput, StartStopButton,
                          # TapTempoButton, VolumeFader, ThemeToggle
  App.tsx                 # wires persistent state → hooks → components
```

### Audio timing rules (important)

The engine uses the lookahead scheduler from Chris Wilson's article "A Tale of Two Clocks". Keep these rules when changing it:

- **Never play clicks straight from JS timers** (`setInterval`, `setTimeout`, React effects). Every click is booked ahead with `osc.start(time)` on the `AudioContext` clock.
- A worker tick (`TICK_INTERVAL_MS = 25`) runs `schedule()`, which books every beat due within `SCHEDULE_AHEAD_S = 0.1`. The tick runs in a worker because browsers slow down main-thread timers in background tabs.
- **The engine stays outside React.** React state changes are only pushed in with `setBpm`, `setSteps` and `setVolume`; they never control when a click plays. `useMetronome` creates the engine once with `useState(() => new MetronomeEngine(...))`.
- A tempo change applies from the next beat that hasn't been booked yet (`nextBeatTime += 60 / bpm`).
- `start()` must run synchronously inside a user gesture, because of browser autoplay rules. The `AudioContext` is created lazily there.
- Stopping disconnects the per-run `bus` GainNode, which silences clicks that were booked but haven't played yet.
- If scheduling falls behind by more than `MAX_LAG_S`, for example after the device sleeps, it skips ahead rather than playing a burst of late clicks.
- Volume uses `setTargetAtTime` so moving the fader doesn't cause clicks or pops.
- The visual beat uses a `{step, dropped, count, time}` queue, drained by `requestAnimationFrame` against `currentTime - outputLatency`, so the LEDs match what's audible.

## Visual design (vintage hardware)

The app looks like a piece of 70s/80s studio gear: a beige device with walnut end-cheeks, split into **Tempo**, **Steps** and **Output** modules, with a full-width amber **Start** key at the bottom. It was built on the `styling` branch.

- **Colours:** defined once as CSS variables in `src/index.css` (`--nome-*`, with dark overrides under `.dark`) and exposed to Tailwind via `@theme inline` as `page`, `body`, `panel`, `ink`, `ink-muted`, `rule`, `key`, `key-edge`, `amber`, `amber-deep`, `led-off`, `wood`, `wood-dark`, `lcd`, `lcd-on`, `pad-mute`. Use these names (`bg-panel`, `text-ink-muted`, ...); don't use raw Tailwind palette colours (zinc, indigo, ...).
- **Fonts:** Barlow Condensed (latin 500/600/700 from `@fontsource`) is the UI font. DSEG7 Classic Bold (`font-lcd`) is used for LCD digits; it's vendored in `src/assets/fonts/dseg7/` with its OFL licence.
- **Shared pieces:**
  - `src/components/ui.ts`: `KEY_BASE` (shape and press behaviour, no colours or alignment), `KEY_FACE` (standard colours), `KEY` (base + face + centred), `KEY_SM`, `KEY_LATCHED` and `SILKSCREEN` (small printed labels). When a key needs different colours or alignment, combine `KEY_BASE` with its own classes rather than overriding `KEY`, because conflicting Tailwind utilities don't reliably override each other.
  - `Led` (on / off / hollow) and `Module` (panel with printed label, rule and optional header controls).
  - `.fader` (hardware slider styling), `.wood` and `.lcd-glow` in `index.css`.
- **LCDs:** the tempo display shows faint unlit `888` segments behind the editable digits, a `BeatLight` bottom-left and "BPM" bottom-right. The step count is a small LCD too.
- **Beat feedback:**
  - The LED above the current pad lights, and the pad sinks (`motion-safe:` only, so it's skipped with reduced motion).
  - `BeatLight` flashes once per beat: brighter on accents, a hollow ring on dropped beats, and nothing on muted steps. It restarts by remounting on the engine's `ActiveBeat.count`, which increases every beat, so repeats of the same step still flash.
- **Pads:** accent pads are amber with ▲, normal pads are plain keys, and muted pads are flat and dark with "MUTE". Each pad shows its step number.

## Conventions

- Match the existing style: no semicolons, single quotes, 2-space indent, named exports for components (`App` is the default export).
- Keep pure logic in `src/logic/` with a `*.test.ts` next to it. Add tests when changing tempo, steps or tap-tempo behaviour.
- Validate any value read from `localStorage` with an `isX(value): value is X` guard, and fall back to the default if it fails.
- Dark mode uses the class-based variant (`@custom-variant dark` in `src/index.css`). An inline script in `index.html` applies the saved theme before the first paint, so keep its key and logic in sync with `useTheme.ts`.
- Accessibility: every control needs a label and must work from the keyboard. Step pads describe their state in `aria-label`; decorative LEDs and markers are `aria-hidden`.

## Known gotchas

- **iOS:** the silent switch mutes Web Audio. The footer tells users about this.
- **Sliders:** build every slider with `SliderRow` (label column `w-16`, the slider, value column `w-10`) so all slider tracks share the same left and right edges. The tempo slider has no label on purpose; its empty label column keeps it aligned.
- **Dropdowns:** use the custom `Select` (`src/components/Select.tsx`), not a native `<select>`, whose open list can't be styled. It follows the WAI-ARIA select-only combobox pattern: focus stays on the trigger and `aria-activedescendant` tracks the highlighted option. When open it stops Space/Enter from reaching the global shortcuts. When it was reached with Tab it's skipped by `useKeyboardShortcuts` like a button.
- **Number inputs:** use `CommitNumberInput` (used by the BPM and Steps fields). It keeps a draft string and commits only on blur or Enter, so values can be typed without being clamped mid-typing.
- **Tap button timing:** the Tap button uses `onPointerDown` and the event's `timeStamp`, so tap times are accurate. Its `onClick` only taps when `e.detail === 0` (activated from the keyboard), so a mouse tap isn't counted twice.
- **Don't use `:focus-visible` to detect keyboard focus** in key handlers. Chromium applies it to *any* focused element once a key is pressed, so a mouse-focused button already matches by the time the handler runs.
- **Browser testing:** Playwright's Chromium is cached in `~/Library/Caches/ms-playwright`, but `chromium-cli` isn't installed. Drive the app with a scratch Playwright script, passing `executablePath` pointing at the cached `chrome-headless-shell`. A headless browser can't confirm the sound itself; manual checks for drift and audio quality still need a person listening.

## Possible next steps

- Rebalance kit levels (Library accent is very quiet; Kitchen and Old School accents peak lower than their main clicks). Library `main.wav` also has about 283ms of silence before the hit (skipped automatically) and is about 280ms long, so clicks overlap above about 215 BPM.
- Subdivisions (not in scope yet)
