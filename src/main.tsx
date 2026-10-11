import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices hébergées avec le site (OFL-1.1) : aucun appel à un CDN externe pour l'affichage.
import '@fontsource-variable/inter'
import '@fontsource-variable/outfit'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
