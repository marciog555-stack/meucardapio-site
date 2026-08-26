import { lazy, Suspense } from 'react'
import { useLenis } from './hooks/useLenis'
import { useBotoesMagneticos } from './hooks/useBotoesMagneticos'
import { useAtualizarScrollAposFontes } from './hooks/useAtualizarScrollAposFontes'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problema } from './components/Problema'
import { Segmentos } from './components/Segmentos'
import { ComoFunciona } from './components/ComoFunciona'
import { Confianca } from './components/Confianca'
import { Rodape } from './components/Rodape'

// Carregado à parte pra não atrasar o primeiro parágrafo visível — não
// depende de nada do resto da página, só monta o próprio canvas fixo.
const FundoBurger = lazy(() =>
  import('./components/FundoBurger').then((m) => ({ default: m.FundoBurger })),
)

function App() {
  useLenis()
  useBotoesMagneticos()
  useAtualizarScrollAposFontes()

  return (
    <>
      <Suspense fallback={null}>
        <FundoBurger />
      </Suspense>
      <Nav />
      <main>
        <Hero />
        <Problema />
        <Segmentos />
        <ComoFunciona />
        <Confianca />
      </main>
      <Rodape />
    </>
  )
}

export default App
