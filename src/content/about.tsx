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
  </article>
)
