import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// O ticker do GSAP entra em modo economia (poucos quadros por segundo)
// quando não tem nenhuma animação do próprio GSAP rodando — mas é ele que
// move o Lenis (rolagem suave) a cada quadro. O GSAP não sabe que o Lenis
// também depende desses quadros, então sem isso a rolagem pode ficar lenta
// depois que as animações de entrada da página terminam.
gsap.config({ autoSleep: 0 })

// No celular, a barra de endereço aparece/some enquanto rola e muda a altura
// da viewport — sem isso, o ScrollTrigger acha que a página mudou de
// tamanho e recalcula tudo no meio da rolagem, dando a sensação da tela
// "puxar" ou balançar de lado.
ScrollTrigger.config({ ignoreMobileResize: true })

export const reduzMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
