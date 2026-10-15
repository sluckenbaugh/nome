import { DropsControl } from './components/DropsControl'
import { StartStopButton } from './components/StartStopButton'
import { StepGrid } from './components/StepGrid'
import { TapTempoButton } from './components/TapTempoButton'
import { TempoControl } from './components/TempoControl'
import { ThemeToggle } from './components/ThemeToggle'
import { VolumeFader } from './components/VolumeFader'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useMetronome } from './hooks/useMetronome'
import { usePersistentState } from './hooks/usePersistentState'
import { useTapTempo } from './hooks/useTapTempo'
import { useTheme } from './hooks/useTheme'
import { DEFAULT_DROPS, isDropSettings } from './logic/drops'
import { DEFAULT_STEPS, isSteps } from './logic/steps'
import { DEFAULT_BPM, isBpm } from './logic/tempo'
import { DEFAULT_VOLUME, isVolume } from './logic/volume'

export default function App() {
  const [bpm, setBpm] = usePersistentState('nome:bpm', DEFAULT_BPM, isBpm)
  const [steps, setSteps] = usePersistentState('nome:steps', DEFAULT_STEPS, isSteps)
  const [volume, setVolume] = usePersistentState('nome:volume', DEFAULT_VOLUME, isVolume)
  const [drops, setDrops] = usePersistentState('nome:drops', DEFAULT_DROPS, isDropSettings)
  const { isDark, toggleTheme } = useTheme()
  const { isPlaying, activeStep, activeDropped, toggle } = useMetronome({ bpm, steps, volume, drops })
  const { tap, flash } = useTapTempo(setBpm)
  useKeyboardShortcuts({ onSpace: toggle, onEnter: tap })

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-4">
        <h1 className="text-2xl font-bold tracking-tight">.nome</h1>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </header>

      <main className="mx-auto mt-6 flex max-w-md flex-col items-center gap-8 rounded-3xl bg-white px-6 py-8 shadow-sm dark:bg-zinc-900 max-sm:mx-4">
        <TempoControl bpm={bpm} onChange={setBpm} />
        <div className="flex w-full flex-col items-center gap-4">
          <StepGrid steps={steps} activeStep={activeStep} activeDropped={activeDropped} onChange={setSteps} />
          <DropsControl drops={drops} onChange={setDrops} />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <StartStopButton isPlaying={isPlaying} onToggle={toggle} />
          <TapTempoButton flash={flash} onTap={tap} />
        </div>
        <VolumeFader volume={volume} onChange={setVolume} />
      </main>

      <footer className="px-4 py-6 text-center text-xs text-zinc-500">
        Free, no sign-up. On iPhone, turn off silent mode to hear clicks.
      </footer>
    </div>
  )
}
