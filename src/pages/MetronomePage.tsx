import { SOUND_KITS } from '../audio/soundKits'
import { BeatLight } from '../components/BeatLight'
import { DropsControl } from '../components/DropsControl'
import { Module } from '../components/Module'
import { Page, SITE_TITLE } from '../components/Page'
import { SoundSelect } from '../components/SoundSelect'
import { StartStopButton } from '../components/StartStopButton'
import { StepCount } from '../components/StepCount'
import { StepGrid } from '../components/StepGrid'
import { TapTempoButton } from '../components/TapTempoButton'
import { TempoControl } from '../components/TempoControl'
import { VolumeFader } from '../components/VolumeFader'
import { useMetronomeContext } from '../state/metronomeContext'

export function MetronomePage() {
  const { bpm, setBpm, steps, setSteps, volume, setVolume, drops, setDrops, kitId, setKitId, isPlaying, activeBeat, activeStep, activeDropped, toggle, tap, flash } =
    useMetronomeContext()

  return (
    <Page title="Controls" documentTitle={SITE_TITLE}>
      {/*
        Phones: one column (Tempo, Steps, Output, Start). Wide screens: Tempo over Output on the
        left, Steps filling the right column, Start across the bottom. When Steps is taller, the
        extra height goes to the Output row so Tempo keeps its natural size.
      */}
      <main className="flex flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-[auto_1fr_auto] md:gap-x-5">
        <Module label="Tempo" className="md:col-start-1 md:row-start-1">
          <TempoControl
            bpm={bpm}
            onChange={setBpm}
            tapKey={<TapTempoButton flash={flash} onTap={tap} />}
            beatLight={<BeatLight beat={activeBeat} steps={steps} />}
          />
        </Module>

        <Module label="Steps" aside={<StepCount steps={steps} onChange={setSteps} />} className="md:col-start-2 md:row-span-2 md:row-start-1">
          {/* Pads at the top, Drops pinned to the bottom when the box is stretched. */}
          <div className="flex flex-1 flex-col justify-between gap-4">
            <StepGrid steps={steps} activeStep={activeStep} activeDropped={activeDropped} onChange={setSteps} />
            <DropsControl drops={drops} onChange={setDrops} />
          </div>
        </Module>

        <Module label="Output" className="md:col-start-1 md:row-start-2">
          <div className="flex flex-col gap-3">
            <SoundSelect kits={SOUND_KITS} value={kitId} onChange={setKitId} />
            <VolumeFader volume={volume} onChange={setVolume} />
          </div>
        </Module>

        <div className="md:col-span-2 md:row-start-3">
          <StartStopButton isPlaying={isPlaying} onToggle={toggle} />
        </div>
      </main>
    </Page>
  )
}
