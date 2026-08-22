import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reduzMovimento } from '../lib/gsap'
import { PASSOS_FUNCIONAMENTO } from '../data/montagem'

/** O outro "momento de assinatura" da página: painel da foto fica fixo
 * enquanto os passos passam ao lado, cada um dando um pulso sutil na foto
 * (scale via transform — não mexe em layout). */
export function ComoFunciona() {
  const secaoRef = useRef<HTMLElement>(null)
  const fotoRef = useRef<HTMLDivElement>(null)
  const passosRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (reduzMovimento()) return

    const ctx = gsap.context(() => {
      const passos = passosRef.current.filter(Boolean) as HTMLLIElement[]

      passos.forEach((passo) => {
        ScrollTrigger.create({
          trigger: passo,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => marcar(passos.indexOf(passo)),
          onEnterBack: () => marcar(passos.indexOf(passo)),
        })
      })

      function marcar(indice: number) {
        passos.forEach((p, i) => {
          p.dataset.ativo = i === indice ? 'true' : 'false'
        })
        gsap.fromTo(
          fotoRef.current,
          { scale: 1.04 },
          { scale: 1, duration: 0.5, ease: 'power2.out' },
        )
      }
    }, secaoRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secaoRef} className="bg-carvao-claro px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Como funciona
          </p>
          <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
            Tudo sob seu controle
          </h2>
          <div
            ref={fotoRef}
            className="border-creme/10 mt-8 aspect-9/16 max-h-[520px] overflow-hidden rounded-3xl border will-change-transform"
          >
            <img
              src="/img/demo-brasa.webp"
              alt="Tela do painel do MeuCardápio"
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {PASSOS_FUNCIONAMENTO.map((passo, i) => (
            <li
              key={passo.titulo}
              ref={(el) => {
                passosRef.current[i] = el
              }}
              data-ativo={i === 0 ? 'true' : 'false'}
              className="border-creme/10 group flex min-h-32 flex-col justify-center border-b py-6 transition-opacity duration-300 last:border-b-0 data-[ativo=false]:opacity-40 sm:min-h-40"
            >
              <span className="text-burger font-mono text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-creme mt-1 text-2xl uppercase sm:text-3xl">
                {passo.titulo}
              </h3>
              <p className="text-creme/60 mt-1 max-w-sm text-sm sm:text-base">
                {passo.descricao}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
