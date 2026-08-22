import { useEffect } from 'react'
import { gsap, reduzMovimento } from '../lib/gsap'

/** Botões com [data-magnetico] seguem o cursor de leve dentro da própria
 * área — só em telas com mouse de verdade (hover:hover), e nada acontece
 * no toque, então não precisa de fallback mobile. */
export function useBotoesMagneticos() {
  useEffect(() => {
    if (reduzMovimento()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const botoes = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetico]'))

    const limpezas = botoes.map((botao) => {
      const mover = gsap.quickTo(botao, 'x', { duration: 0.4, ease: 'power3.out' })
      const moverY = gsap.quickTo(botao, 'y', { duration: 0.4, ease: 'power3.out' })

      function aoMover(evento: MouseEvent) {
        const bounds = botao.getBoundingClientRect()
        const relX = evento.clientX - (bounds.left + bounds.width / 2)
        const relY = evento.clientY - (bounds.top + bounds.height / 2)
        mover(relX * 0.35)
        moverY(relY * 0.35)
      }

      function aoSair() {
        mover(0)
        moverY(0)
      }

      botao.addEventListener('mousemove', aoMover)
      botao.addEventListener('mouseleave', aoSair)
      return () => {
        botao.removeEventListener('mousemove', aoMover)
        botao.removeEventListener('mouseleave', aoSair)
      }
    })

    return () => limpezas.forEach((limpar) => limpar())
  }, [])
}
