import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// No celular, a barra de endereço aparece/some enquanto rola e muda a altura
// da viewport — sem isso, o ScrollTrigger acha que a página mudou de
// tamanho e recalcula tudo no meio da rolagem, dando a sensação da tela
// "puxar" ou balançar de lado.
ScrollTrigger.config({ ignoreMobileResize: true })

export const reduzMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
