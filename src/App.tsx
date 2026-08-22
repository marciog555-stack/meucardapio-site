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

function App() {
  useLenis()
  useBotoesMagneticos()
  useAtualizarScrollAposFontes()

  return (
    <>
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
