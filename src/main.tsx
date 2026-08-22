import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PoliticaPrivacidade } from './pages/PoliticaPrivacidade.tsx'

const ehPrivacidade = window.location.pathname.startsWith('/privacidade')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{ehPrivacidade ? <PoliticaPrivacidade /> : <App />}</StrictMode>,
)
