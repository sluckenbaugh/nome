import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { MetronomeProvider } from './state/MetronomeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Above the routes, so playback and settings carry across pages. */}
      <MetronomeProvider>
        <App />
      </MetronomeProvider>
    </BrowserRouter>
  </StrictMode>,
)
