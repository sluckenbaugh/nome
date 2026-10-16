import { GUIDE_SECTIONS } from '../content/guide'
import { Module } from '../components/Module'
import { Page } from '../components/Page'

export function GuidePage() {
  return (
    <Page title="Guide" widthClassName="max-w-md md:max-w-2xl">
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
