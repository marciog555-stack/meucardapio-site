import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const ehPrivacidade = window.location.pathname.startsWith('/privacidade')

// Cada rota carrega só o que usa: a política de privacidade não depende de
// GSAP/Lenis/ScrollTrigger (a landing inteira depende), então dividir os
// dois bundles evita que quem cai em /privacidade baixe esse peso à toa.
const App = lazy(() => import('./App.tsx'))
const PoliticaPrivacidade = lazy(() =>
  import('./pages/PoliticaPrivacidade.tsx').then((m) => ({ default: m.PoliticaPrivacidade })),
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>{ehPrivacidade ? <PoliticaPrivacidade /> : <App />}</Suspense>
  </StrictMode>,
)
