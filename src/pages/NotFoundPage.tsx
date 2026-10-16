import { Link } from 'react-router'
import { Module } from '../components/Module'
import { Page } from '../components/Page'
import { KEY } from '../components/ui'

export function NotFoundPage() {
  return (
    <Page title="Not Found" widthClassName="max-w-md">
      <main>
        <Module label="Page not found">
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm">There's nothing at this address.</p>
            <Link to="/" className={`${KEY} h-9 px-3 text-sm`}>
              Back to the metronome
            </Link>
          </div>
        </Module>
      </main>
    </Page>
  )
}
