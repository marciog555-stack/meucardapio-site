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

// Carrega o three.js só quando esse trecho da página é necessário — sem
// isso ele entrava no bundle principal e atrasava o primeiro parágrafo
// visível (o Hero), que é o que mais importa numa página de vendas.
const VitrineMarca = lazy(() =>
  import('./components/VitrineMarca').then((m) => ({ default: m.VitrineMarca })),
)

function App() {
  useLenis()
  useBotoesMagneticos()
  useAtualizarScrollAposFontes()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <VitrineMarca />
        </Suspense>
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
