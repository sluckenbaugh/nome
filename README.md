# Nome

A free browser metronome — no sign-up, no backend. See `project-scope.md` for the feature scope.

## Development

```sh
npm install
npm run dev      # local dev server
npm test         # unit tests (Vitest)
npm run lint
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## How timing works

Clicks are scheduled with a lookahead scheduler on the Web Audio clock (see Chris Wilson,
"A Tale of Two Clocks"), not played directly from JS timers:

- `src/audio/scheduler.worker.ts` ticks every 25ms from a Web Worker (not throttled in background tabs).
- On each tick, `src/audio/MetronomeEngine.ts` schedules every click due in the next 100ms with
  sample-accurate `start(time)` calls.
- The engine is a plain class outside React; `src/hooks/useMetronome.ts` pushes settings into it.
- The step indicator is driven by `requestAnimationFrame` against `AudioContext.currentTime`,
  compensating for output latency, so the visual matches what you hear.
- Clicks are synthesized in `src/audio/clicks.ts` — swap this out to use audio samples.

## Controls

- **Space** — start/stop
- **Return/Enter** — tap tempo
- (When a button is focused with Tab, Space/Enter press that button instead.)
- Steps: click a step to cycle normal → accent → mute; change the number of steps (1–16) with −/+ or by typing it in; steps wrap four per row
- Drops: when on, beats are randomly silenced; the % slider sets the chance per beat (0% none, 100% all)
- Settings (tempo, steps, volume, drops, theme) are saved in `localStorage`.

## Deployment

`render.yaml` defines a Render static site (Blueprint). Alternatively create a Static Site in
the Render dashboard with build command `npm ci && npm run build` and publish directory `dist`.
