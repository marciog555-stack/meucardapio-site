import { lazy, Suspense } from 'react'
import { useLenis } from './hooks/useLenis'
import { useBotoesMagneticos } from './hooks/useBotoesMagneticos'
import { useAtualizarScrollAposFontes } from './hooks/useAtualizarScrollAposFontes'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problema } from './components/Problema'
import { FeitoPara } from './components/FeitoPara'
import { Comparativo } from './components/Comparativo'
import { AtendimentoMesa } from './components/AtendimentoMesa'
import { Demos } from './components/Demos'
import { Depoimentos } from './components/Depoimentos'
import { ComoFunciona } from './components/ComoFunciona'
import { Confianca } from './components/Confianca'
import { Rodape } from './components/Rodape'
import { BolhaWhatsapp } from './components/BolhaWhatsapp'

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
        <Comparativo />
        <Demos />
        <AtendimentoMesa />
        <FeitoPara />
        <Depoimentos />
        <ComoFunciona />
        <Confianca />
      </main>
      <Rodape />
      <BolhaWhatsapp />
    </>
  )
}

export default App
