import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { SOUND_KITS } from './audio/soundKits'
import { MenuBar } from './components/MenuBar'
import { PlayingIndicator } from './components/PlayingIndicator'
import { SilentModeNotice } from './components/SilentModeNotice'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useTheme } from './hooks/useTheme'
import { MetronomePage } from './pages/MetronomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useMetronomeContext } from './state/metronomeContext'

// The Guide is loaded on demand so the metronome page doesn't download it.
const GuidePage = lazy(() => import('./pages/GuidePage').then((m) => ({ default: m.GuidePage })))

/** Page frame shared by every route: desktop, menu bar, the current page, and the footer. */
export default function App() {
  const { kitId, setKitId, isPlaying, toggle, tap } = useMetronomeContext()
  const { preference: theme, setPreference: setTheme } = useTheme()
  const { pathname } = useLocation()
  // Space and Return work on every page; the metronome keeps playing across pages.
  useKeyboardShortcuts({ onSpace: toggle, onEnter: tap })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="desktop min-h-dvh font-sans text-ink">
      <MenuBar
        appName=".nome"
        homeTo="/"
        menus={[
          { label: 'Sounds', items: SOUND_KITS.map((k) => ({ label: k.label, checked: k.id === kitId, onSelect: () => setKitId(k.id) })) },
          {
            label: 'Mode',
            items: [
              { label: 'Morning Dove', checked: theme === 'light', onSelect: () => setTheme('light') },
              { label: 'Night Owl', checked: theme === 'dark', onSelect: () => setTheme('dark') },
              { label: 'Match System', checked: theme === 'system', onSelect: () => setTheme('system') },
            ],
          },
        ]}
        links={[{ label: 'Guide', to: '/guide' }]}
        aside={isPlaying && pathname !== '/' ? <PlayingIndicator onStop={toggle} /> : null}
      />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<MetronomePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <SilentModeNotice />

      <footer className="px-4 py-8 text-center text-xs text-ink">Free, no sign-up, no pop-ups, just clicks. On mobile, turn off silent mode to hear audio.</footer>
    </div>
  )
}
