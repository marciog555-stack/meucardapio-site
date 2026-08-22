import { useEffect, useRef } from 'react'
import { gsap, reduzMovimento } from '../lib/gsap'

const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápio e quero um site assim pro meu restaurante.')

export function Hero() {
  const secaoRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } })
      tl.from('[data-hero-eyebrow]', { opacity: 0, y: 16 })
        .from('[data-hero-titulo] > span', { opacity: 0, y: 28, stagger: 0.08 }, '-=0.35')
        .from('[data-hero-sub]', { opacity: 0, y: 16 }, '-=0.3')
        .from('[data-hero-cta]', { opacity: 0, y: 16 }, '-=0.35')

      if (!reduzMovimento() && bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: secaoRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }
    }, secaoRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secaoRef} className="relative flex min-h-svh items-end overflow-hidden">
      <div
        ref={bgRef}
        className="hero-bg absolute inset-0 -z-20 bg-cover bg-center"
      />
      <div className="from-carvao via-carvao/80 absolute inset-0 -z-10 bg-gradient-to-t to-transparent" />

      <div className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-24 lg:px-20">
        <p
          data-hero-eyebrow
          className="text-creme/70 text-xs font-semibold tracking-[0.35em] uppercase sm:text-sm"
        >
          Sistema de pedidos pra restaurantes
        </p>
        <h1
          data-hero-titulo
          className="font-display text-creme mt-4 uppercase"
          style={{ fontSize: 'clamp(2.5rem, 8.5vw, 6rem)', lineHeight: 0.94 }}
        >
          <span className="block">Seu cardápio.</span>
          <span className="block">Sua marca.</span>
          <span className="text-burger block">Zero comissão.</span>
        </h1>
        <p data-hero-sub className="text-creme/80 mt-6 max-w-lg text-base sm:text-lg">
          Um site profissional só seu, pedido caindo direto no seu WhatsApp —
          sem pagar 30% de comissão por pedido pro aplicativo.
        </p>
        <div data-hero-cta>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-burger text-creme mt-8 inline-flex min-h-14 items-center gap-3 rounded-full px-8 text-base font-bold tracking-wide uppercase transition-transform active:scale-95"
            data-magnetico
          >
            Quero meu site
          </a>
          <p className="text-creme/50 mt-3 text-sm">
            R$100 pra montar + R$50/mês depois. Sem contrato, sem fidelidade.
          </p>
        </div>
      </div>
    </section>
  )
}
