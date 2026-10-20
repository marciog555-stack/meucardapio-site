import { useEffect, useRef } from 'react'
import { gsap, reduzMovimento } from '../lib/gsap'
import { PRECO_MENSAL, PRECO_PRIMEIRO_MES } from '../data/planos'
import { formatarPreco } from '../lib/formato'
import {
  HERO_EYEBROW,
  HERO_TITULO_LINHAS,
  HERO_SUBTITULO,
  HERO_CTA_TEXTO,
  HERO_WHATSAPP_NUMERO,
  HERO_WHATSAPP_MENSAGEM,
} from '../data/heroTexto.mjs'

const WHATSAPP = HERO_WHATSAPP_NUMERO
const MENSAGEM = encodeURIComponent(HERO_WHATSAPP_MENSAGEM)

export function Hero() {
  const secaoRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const alvos = ['[data-hero-eyebrow]', '[data-hero-titulo] > span', '[data-hero-sub]', '[data-hero-cta]']

      if (reduzMovimento()) {
        // Pula direto pro estado final em vez de tocar a tween: com o
        // encadeamento em sobreposição negativa que a timeline usa, o
        // GSAP acaba capturando o valor "de chegada" de cada .from() no
        // momento errado e a entrada trava no opacity:0 pra sempre —
        // melhor nem tentar animar aqui.
        gsap.set(alvos, { opacity: 1, y: 0 })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 0.6 } })
        .from(alvos[0], { opacity: 0, y: 16 })
        .from(alvos[1], { opacity: 0, y: 28, stagger: 0.08 }, '-=0.35')
        .from(alvos[2], { opacity: 0, y: 16 }, '-=0.3')
        .from(alvos[3], { opacity: 0, y: 16 }, '-=0.35')
    }, secaoRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secaoRef} className="relative flex min-h-svh items-end overflow-hidden">
      <div className="from-carvao via-carvao/75 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24 lg:px-20">
        <p
          data-hero-eyebrow
          className="text-creme/70 text-xs font-semibold tracking-[0.35em] uppercase sm:text-sm"
        >
          {HERO_EYEBROW}
        </p>
        <h1
          data-hero-titulo
          className="font-display text-creme mt-4 uppercase"
          style={{ fontSize: 'clamp(2.5rem, 8.5vw, 6rem)', lineHeight: 0.94 }}
        >
          {HERO_TITULO_LINHAS.map((linha, i) => (
            <span
              key={linha}
              className={i === HERO_TITULO_LINHAS.length - 1 ? 'text-burger block' : 'block'}
            >
              {linha}
            </span>
          ))}
        </h1>
        <p data-hero-sub className="text-creme/80 mt-6 max-w-lg text-base sm:text-lg">
          {HERO_SUBTITULO}
        </p>
        <div data-hero-cta>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-burger text-creme mt-8 inline-flex min-h-14 items-center gap-3 rounded-full px-8 text-base font-bold tracking-wide uppercase transition-transform active:scale-95"
            data-magnetico
          >
            {HERO_CTA_TEXTO}
          </a>
          <p className="text-creme/65 mt-3 text-sm">
            {formatarPreco(PRECO_PRIMEIRO_MES)} no 1º mês, {formatarPreco(PRECO_MENSAL)}/mês depois. Sem contrato, sem
            fidelidade.
          </p>
        </div>
      </div>
    </section>
  )
}
