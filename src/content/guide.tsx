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
    id: 'getting-started',
    title: 'Getting started',
    body: (
      <>
        <p>
          <em>Placeholder.</em> A short introduction to .nome goes here.
        </p>
        <p>
          Formatting examples (delete when you write this section): press <kbd>Space</kbd> to start and stop, and{' '}
          <kbd>Return</kbd> to tap a tempo.
        </p>
        <ul>
          <li>A list item</li>
          <li>
            Another list item with <strong>bold</strong> text
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'tempo',
    title: 'Tempo',
    body: (
      <p>
        <em>Placeholder.</em> Explain the tempo field, the − and + keys, /2 and ×2, the slider, and Tap.
      </p>
    ),
  },
  {
    id: 'steps',
    title: 'Steps',
    body: (
      <p>
        <em>Placeholder.</em> Explain steps per bar, and tapping a pad to cycle normal → accent → mute.
      </p>
    ),
  },
  {
    id: 'drops',
    title: 'Drops',
    body: (
      <p>
        <em>Placeholder.</em> Explain what Drops does and how the density slider works.
      </p>
    ),
  },
  {
    id: 'output',
    title: 'Sounds and volume',
    body: (
      <p>
        <em>Placeholder.</em> Explain choosing a sound and setting the volume.
      </p>
    ),
  },
]
