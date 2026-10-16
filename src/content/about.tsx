import type { ReactNode } from 'react'

/*
 * The "About the Developer" window on the Guide page. Edit the text here. You can use <p>,
 * <ul>/<ol> with <li>, <h3>, <strong>, <em> and <a href="...">; they're styled by `.guide-prose`.
 *
 * Everything below is placeholder text.
 */
export const ABOUT_TITLE = 'About the Developer'

export const ABOUT_BODY: ReactNode = (
  <article>
    <p>Nome was designed and built in 2026 by musician, producer, and developer Shane Luckenbaugh after the realization that the internet offered very few, if any, free but effective metronomes.
      Everything from excessive pop-up ads, abrasive click sounds, and lack of volume control inspired him to put his web development, sound design skills, and 20+ years of being a practicing instrumentalist together to build a useful tool for musicians on the internet.
    </p>
    <br />
    <p>Shane resides in Red Bank, New Jersey, makes music under the name dreamschool, and contributes to many other projects as a touring musician and producer. If you use and enjoy Nome, consider supporting his efforts below.</p>
    <br />
    <p>
      {/* Opens in a new tab so leaving for the link doesn't stop the metronome. */}
      <a href="https://buymeacoffee.com/shaneluckenbaugh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.5h9v3.5a3.5 3.5 0 0 1-3.5 3.5h-2a3.5 3.5 0 0 1-3.5-3.5z" />
          <path d="M11.5 7.5h1a1.75 1.75 0 0 1 0 3.5h-1.2" />
          <path d="M5.5 1.5c-.6.8.6 1.4 0 2.4M8 1.5c-.6.8.6 1.4 0 2.4" />
        </svg>
        Buy me a coffee
      </a>
    </p>
  </article>
)
