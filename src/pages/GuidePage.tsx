import shhhPoster from '../assets/video/shhh-poster.jpg'
import shhhVideo from '../assets/video/shhh.mp4'
import { ABOUT_BODY, ABOUT_TITLE } from '../content/about'
import { GUIDE_SECTIONS } from '../content/guide'
import { Module } from '../components/Module'
import { Page } from '../components/Page'
import { Window } from '../components/Window'

export function GuidePage() {
  return (
    <Page
      title="Guide"
      widthClassName="max-w-md md:max-w-2xl lg:max-w-5xl"
      aside={
        <aside aria-label={ABOUT_TITLE}>
          <Window title={ABOUT_TITLE} headingLevel="h2">
            {/* Decorative loop with no audio track. muted + playsInline let it autoplay, including on iOS. */}
            <video
              src={shhhVideo}
              poster={shhhPoster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
              className="mb-4 aspect-square w-full border border-line"
            />
            <div className="guide-prose">{ABOUT_BODY}</div>
          </Window>
        </aside>
      }
    >
      <main className="flex flex-col gap-4">
        {GUIDE_SECTIONS.map((section) => (
          <Module key={section.id} label={section.title} id={section.id}>
            <div className="guide-prose">{section.body}</div>
          </Module>
        ))}
      </main>
    </Page>
  )
}
