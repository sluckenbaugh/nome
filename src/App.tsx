import { BeatLight } from './components/BeatLight'
import { DropsControl } from './components/DropsControl'
import { MenuBar } from './components/MenuBar'
import { Module } from './components/Module'
import { SoundSelect } from './components/SoundSelect'
import { StartStopButton } from './components/StartStopButton'
import { StepCount } from './components/StepCount'
import { StepGrid } from './components/StepGrid'
import { TapTempoButton } from './components/TapTempoButton'
import { TempoControl } from './components/TempoControl'
import { VolumeFader } from './components/VolumeFader'
import { Window } from './components/Window'
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
  const { preference: theme, setPreference: setTheme } = useTheme()
  const { isPlaying, activeBeat, activeStep, activeDropped, toggle } = useMetronome({ bpm, steps, volume, drops, kit })
  const { tap, flash } = useTapTempo(setBpm)
  useKeyboardShortcuts({ onSpace: toggle, onEnter: tap })

  return (
    <div className="desktop min-h-dvh font-sans text-ink">
      <MenuBar
        appName=".nome"
        menus={[
          { label: 'Sound', items: SOUND_KITS.map((k) => ({ label: k.label, checked: k.id === kitId, onSelect: () => setKitId(k.id) })) },
          {
            label: 'View',
            items: [
              { label: 'Light', checked: theme === 'light', onSelect: () => setTheme('light') },
              { label: 'Dark', checked: theme === 'dark', onSelect: () => setTheme('dark') },
              { label: 'Match System', checked: theme === 'system', onSelect: () => setTheme('system') },
            ],
          },
        ]}
      />
      <div className="mx-auto max-w-md px-3 pt-6 sm:pt-10">
        <Window title="Metronome">
          <main className="flex flex-col gap-4">
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
        </Window>
      </div>

      <footer className="px-4 py-8 text-center text-xs text-ink">Free, no sign-up. On iPhone, turn off silent mode to hear clicks.</footer>
    </div>
  )
}
