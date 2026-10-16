import type { ReactNode } from 'react'

export interface GuideSection {
  /** Used for the box's heading and as a stable id (e.g. for links like /guide#tempo). */
  id: string
  title: string
  body: ReactNode
}

/*
 * The Guide's content: one entry per box, shown top to bottom. Edit the text here; add a box by
 * adding an entry. Inside `body` you can use <p>, <ul>/<ol> with <li>, <h3>, <strong>, <em>,
 * <a href="...">, and <kbd>Space</kbd> for key names; they're styled by `.guide-prose`.
 *
 * Everything below is placeholder text.
 */
export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'intro',
    title: 'Intro',
    body: (
      <article>
        <p>
          <strong>Nome is not a drum machine,</strong>
        </p>
        <p>
          but it is inspired by them. Drum machines can be a great tool for musicians in the shed looking to improve their internal clock. They afford the user the ability to create an “arrangement” through a step sequencer instead of a rigid, constant click. Nome takes this idea and melds it into a simpler tool specifically designed for practice. Nome features a step sequencer (up to 16 steps) that can be customized and even randomized. Each step can be muted, accented or deleted. Instead of being confined to pre-defined time signatures and subdivisions, this sequencer approach is more or less a blank canvas, malleable to the needs of your current musical exploration. 
        </p>
        <br />
        <p>And Remember, great time is not about playing perfectly on each click but being perfectly cozy in the silence between them. Happy practicing!</p>
      </article>
    ),
  },
  {
    id: 'start',
    title: 'Quick Start',
    body: (
      <article>
        <p>
          Set the bpm and press <kbd>Space</kbd> to start and stop. You can set the tempo manually or by using the tap{' '}
          <kbd>Return</kbd> feature. For best results, tap the desired tempo until the bpm indicator "settles" on a tempo.
        </p>
        <br />
        <p>BPM can be quickly halved or doubled with the /2 and x2 buttons respectively.</p>
      </article>
    ),
  },
  {
    id: 'steps',
    title: 'Steps',
    body: (
      <article>
        <p>
          The step sequencer can be programmed to utilize 1 to 16 steps. It is initially set to 4 steps intimating one measure of 4/4 time. Add or subtract steps to represent odd meters, longer phrases, or subdivisions.
          <strong> By clicking on a step</strong>, it rotates through three different states a step can be in:
        </p>
        <ul className='mt-2'>
          <li><strong>Normal</strong> - The default click sound. It plays the kick sound when the sound source is set to Kick and Snare.</li>
          <li><strong>Accent</strong> - The accented click sound. It plays the snare sound when set to Kick and Snare.</li>
          <li><strong>Muted</strong> - Does not play any sound but is still advancing the sequencer.</li>
        </ul>
      </article>
    ),
  },
  {
    id: 'drops',
    title: 'Drops',
    body: (
      <article>
        <strong>When enabled, the drops algorithm randomly mutes steps</strong> while the sequencer advances. This is a great way to add some real-time unpredictability that tests your internal clock.
        <br />
        <br />
        <p>
          The percentage slider indicates the probability that a step will be "dropped" with no drops at 0% and all steps dropped at 100%. The sweetspot tends to be between 20% and 50% depending on tempo.
        </p>
      </article>
    ),
  },
]
