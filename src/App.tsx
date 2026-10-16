import { BeatLight } from './components/BeatLight'
import { DropsControl } from './components/DropsControl'
import { Module } from './components/Module'
import { SoundSelect } from './components/SoundSelect'
import { StartStopButton } from './components/StartStopButton'
import { StepCount } from './components/StepCount'
import { StepGrid } from './components/StepGrid'
import { TapTempoButton } from './components/TapTempoButton'
import { TempoControl } from './components/TempoControl'
import { ThemeToggle } from './components/ThemeToggle'
import { SILKSCREEN } from './components/ui'
import { VolumeFader } from './components/VolumeFader'
import { getKit, isKitId, SOUND_KITS } from './audio/soundKits'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useMetronome } from './hooks/useMetronome'
import { usePersistentState } from './hooks/usePersistentState'
import { useTapTempo } from './hooks/useTapTempo'
import { useTheme } from './hooks/useTheme'
import { DEFAULT_DROPS, isDropSettings } from './logic/drops'
import { SYNTH_KIT_ID } from './logic/soundKits'
import { DEFAULT_STEPS, isSteps } from './logic/steps'
import { DEFAULT_BPM, isBpm } from './logic/tempo'
import { DEFAULT_VOLUME, isVolume } from './logic/volume'

export default function App() {
  const [bpm, setBpm] = usePersistentState('nome:bpm', DEFAULT_BPM, isBpm)
  const [steps, setSteps] = usePersistentState('nome:steps', DEFAULT_STEPS, isSteps)
  const [volume, setVolume] = usePersistentState('nome:volume', DEFAULT_VOLUME, isVolume)
  const [drops, setDrops] = usePersistentState('nome:drops', DEFAULT_DROPS, isDropSettings)
  const [kitId, setKitId] = usePersistentState('nome:kit', SYNTH_KIT_ID, isKitId)
  const kit = getKit(kitId)
  const { isDark, toggleTheme } = useTheme()
  const { isPlaying, activeBeat, activeStep, activeDropped, toggle } = useMetronome({ bpm, steps, volume, drops, kit })
  const { tap, flash } = useTapTempo(setBpm)
  useKeyboardShortcuts({ onSpace: toggle, onEnter: tap })

  return (
    <div className="min-h-dvh bg-page px-3 py-6 font-sans text-ink sm:py-10">
      <div className="mx-auto flex max-w-md items-stretch drop-shadow-[0_10px_18px_rgb(0_0_0/0.25)]">
        <div aria-hidden className="wood w-3 shrink-0 rounded-l-md sm:w-5" />
        <div className="min-w-0 flex-1 border-y border-black/15 bg-body px-3 pt-3 pb-4 sm:px-4">
          <header className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold tracking-tight">.nome</h1>
              <span className={SILKSCREEN}>Metronome</span>
            </div>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </header>

          <main className="flex flex-col gap-3">
            <Module label="Tempo">
              <TempoControl
                bpm={bpm}
                onChange={setBpm}
                tapKey={<TapTempoButton flash={flash} onTap={tap} />}
                beatLight={<BeatLight beat={activeBeat} steps={steps} />}
              />
            </Module>

            <Module label="Steps" aside={<StepCount steps={steps} onChange={setSteps} />}>
              <div className="flex flex-col gap-4">
                <StepGrid steps={steps} activeStep={activeStep} activeDropped={activeDropped} onChange={setSteps} />
                <DropsControl drops={drops} onChange={setDrops} />
              </div>
            </Module>

            <Module label="Output">
              <div className="flex flex-col gap-3">
                <SoundSelect kits={SOUND_KITS} value={kitId} onChange={setKitId} />
                <VolumeFader volume={volume} onChange={setVolume} />
              </div>
            </Module>

            <StartStopButton isPlaying={isPlaying} onToggle={toggle} />
          </main>
        </div>
        <div aria-hidden className="wood w-3 shrink-0 rounded-r-md sm:w-5" />
      </div>

      <footer className="px-4 py-6 text-center text-xs text-ink-muted">Free, no sign-up. On iPhone, turn off silent mode to hear clicks.</footer>
    </div>
  )
}
