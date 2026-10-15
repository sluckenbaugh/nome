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
- **Drops:** a toggle button labelled just "Drops" (its state is shown by the filled colour and `aria-pressed`, with no on/off text), with a 0–100% density slider (5% steps), placed under the step grid. The button sits on its own line, aligned left, above the slider and percentage. When on, every beat that would sound is silenced with probability = density, rolled fresh each time (`isDropped` in `src/logic/drops.ts`). Accents can be dropped too, and steps the user has muted aren't counted as drops. The roll happens in the engine's `schedule()` when the beat is booked, never in React. While playing, the highlight still moves onto a dropped beat but shows a dashed outline instead of the amber ring. The slider can be adjusted while Drops is off.
- **Sounds:** synthesized for now (sine tone with a fast decay: normal ≈1000 Hz, accent ≈1700 Hz and louder). Audio samples are a possible future feature.
- **Saved settings:** stored in `localStorage` with the keys `nome:bpm`, `nome:steps`, `nome:volume`, `nome:drops` (`{enabled, density}`) and `nome:theme`.
- **Theme:** follows the OS setting until the user toggles it. After that the choice is stored as `'light'|'dark'`.
- **Keyboard:** **Space = Start/Stop** and **Enter/Return = tap tempo**, handled for the whole page in `useKeyboardShortcuts.ts`. The shortcuts are skipped while typing (so Enter in the BPM field confirms the value), and on a button reached with Tab (navigation mode is tracked: Tab sets keyboard mode, any pointerdown clears it), so Tab users can still press buttons with Space or Enter. A button focused by a mouse click doesn't block them; `preventDefault` stops that button from double-firing.

## Architecture

```
src/
  audio/
    MetronomeEngine.ts    # lookahead scheduler, master gain, per-run bus, visual beat queue
    scheduler.worker.ts   # Web Worker: setInterval → postMessage('tick')
    clicks.ts             # playClick(ctx, time, kind, dest) — swap point for samples
  logic/                  # pure, framework-free, unit-tested
    tempo.ts              # clampBpm, halveBpm, doubleBpm, isBpm, MIN/MAX/DEFAULT_BPM
    steps.ts              # StepState, cycleStep, setStepCount, addStep, removeStep, isSteps (1–16)
    tapTempo.ts           # TapTempo class: average of last 6 taps, reset after 2s gap
    volume.ts             # faderToGain (squared curve), isVolume
    drops.ts              # DropSettings, isDropped(density, random), isDropSettings
  hooks/
    useMetronome.ts       # owns one engine instance; syncs bpm/steps/volume; exposes isPlaying/activeStep/toggle
    usePersistentState.ts # useState + localStorage with a validator fallback
    useTheme.ts           # toggles the `dark` class on <html>
    useTapTempo.ts        # tap(timeMs) → BPM via TapTempo, plus flash state
    useKeyboardShortcuts.ts # global Space → start/stop, Enter → tap
  components/             # presentational: TempoControl, StepGrid, DropsControl, SliderRow, CommitNumberInput, StartStopButton,
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
- The visual beat uses a `{step, dropped, time}` queue, drained by `requestAnimationFrame` against `currentTime - outputLatency`, so the highlight matches what's audible.

## Conventions

- Match the existing style: no semicolons, single quotes, 2-space indent, named exports for components (`App` is the default export).
- Keep pure logic in `src/logic/` with a `*.test.ts` next to it. Add tests when changing tempo, steps or tap-tempo behaviour.
- Validate any value read from `localStorage` with an `isX(value): value is X` guard, and fall back to the default if it fails.
- Dark mode uses the class-based variant (`@custom-variant dark` in `src/index.css`). An inline script in `index.html` applies the saved theme before the first paint, so keep its key and logic in sync with `useTheme.ts`.
- Accessibility: every control needs a label and must work from the keyboard. Step buttons describe their state in `aria-label`.

## Known gotchas

- **iOS:** the silent switch mutes Web Audio. The footer tells users about this.
- **Sliders:** build every slider with `SliderRow` (label column `w-16`, the slider, value column `w-10`) so all slider tracks share the same left and right edges. The tempo slider has no label on purpose; its empty label column keeps it aligned.
- **Number inputs:** use `CommitNumberInput` (used by the BPM and Steps fields). It keeps a draft string and commits only on blur or Enter, so values can be typed without being clamped mid-typing.
- **Tap button timing:** the Tap button uses `onPointerDown` and the event's `timeStamp`, so tap times are accurate. Its `onClick` only taps when `e.detail === 0` (activated from the keyboard), so a mouse tap isn't counted twice.
- **Don't use `:focus-visible` to detect keyboard focus** in key handlers. Chromium applies it to *any* focused element once a key is pressed, so a mouse-focused button already matches by the time the handler runs.
- **Browser testing:** Playwright's Chromium is cached in `~/Library/Caches/ms-playwright`, but `chromium-cli` isn't installed. Drive the app with a scratch Playwright script, passing `executablePath` pointing at the cached `chrome-headless-shell`. A headless browser can't confirm the sound itself; manual checks for drift and audio quality still need a person listening.

## Possible next steps

- Audio sample sounds (replace or extend `src/audio/clicks.ts`, loading files into `AudioBuffer`s)
- Subdivisions (not in scope yet)
