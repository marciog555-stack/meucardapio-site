import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reduzMovimento } from '../lib/gsap'

/** Rolagem suave. Desligada de propósito quando o sistema pede menos
 * movimento — Lenis muda a física do scroll, e isso é o tipo de coisa que
 * incomoda quem tem sensibilidade vestibular. */
export function useLenis() {
  useEffect(() => {
    if (reduzMovimento()) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    function raf(time: number) {
      lenis.raf(time)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
