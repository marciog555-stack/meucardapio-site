import { useCallback, useRef, useState } from 'react'
import { Reveal } from './Reveal'

/** Comparações honestas — nada de número inventado, só o que o produto
 * realmente faz diferente de pedir por aplicativo de entrega. */
const LINHAS = [
  { icone: '💸', titulo: 'Comissão por pedido', sem: 'Até 30% por pedido', com: 'Zero — fica tudo com você' },
  { icone: '📱', titulo: 'Seu cliente', sem: 'Cadastrado no aplicativo', com: 'Salvo no seu WhatsApp' },
  { icone: '📋', titulo: 'Atualizar o cardápio', sem: 'Reimprimir, esperar aprovação', com: 'Você muda, na hora' },
  { icone: '🎁', titulo: 'Fidelidade', sem: 'Não existe', com: 'Pontos automáticos a cada compra' },
  { icone: '🔔', titulo: 'Avisar o cliente', sem: 'Ninguém avisa, ele fica no escuro', com: 'Mensagem pronta de "saiu pra entrega"' },
]

/** Slider "antes/depois" arrastável — duas colunas lado a lado (não uma
 * imagem só), cada uma com a própria lista completa; arrastar só muda a
 * largura de cada coluna (overflow escondido), em vez de recortar texto por
 * cima de texto — com clip-path por cima de linhas de texto, o valor que
 * fica coladinho na borda direita quase nunca aparece, porque o recorte
 * cresce da esquerda e demora a chegar lá. Duas colunas de verdade não tem
 * esse problema: cada lado sempre mostra o próprio conteúdo, só mais
 * apertado ou mais largo. */
export function Comparativo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrastando = useRef(false)
  const [pos, setPos] = useState(50)

  const atualizarPos = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(90, Math.max(10, p)))
  }, [])

  function aoPressionar(e: React.PointerEvent) {
    arrastando.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    atualizarPos(e.clientX)
  }
  function aoMover(e: React.PointerEvent) {
    if (!arrastando.current) return
    atualizarPos(e.clientX)
  }
  function aoSoltar() {
    arrastando.current = false
  }

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-creme/65 text-center text-xs font-semibold tracking-[0.3em] uppercase">
            Antes e depois
          </p>
          <h2 className="font-display text-creme mt-3 text-center text-4xl uppercase sm:text-5xl">
            Arraste e compare
          </h2>
        </Reveal>

        <Reveal delayMs={100}>
          <div
            ref={containerRef}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerLeave={aoSoltar}
            className="border-creme/10 relative mt-10 flex touch-none overflow-hidden rounded-2xl border select-none"
          >
            <div
              className="flex min-w-0 shrink-0 flex-col overflow-hidden"
              style={{ width: `${100 - pos}%`, backgroundColor: 'color-mix(in srgb, var(--color-burger) 10%, transparent)' }}
            >
              <span className="text-burger px-5 pt-5 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase sm:px-8">
                Sem MeuCardápioGo
              </span>
              {LINHAS.map((linha) => (
                <div
                  key={linha.titulo}
                  className="border-creme/10 flex min-h-[84px] flex-col justify-center gap-0.5 border-b px-5 py-4 last:border-b-0 sm:px-8"
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-lg" aria-hidden="true">
                      {linha.icone}
                    </span>
                    <span className="text-creme text-sm font-semibold">{linha.titulo}</span>
                  </div>
                  <span className="text-burger text-sm font-semibold whitespace-nowrap">{linha.sem}</span>
                </div>
              ))}
            </div>

            <div
              className="flex min-w-0 shrink-0 flex-col overflow-hidden"
              style={{ width: `${pos}%`, backgroundColor: 'color-mix(in srgb, var(--color-marmita) 12%, transparent)' }}
            >
              <span className="text-marmita px-5 pt-5 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase sm:px-8">
                Com MeuCardápioGo
              </span>
              {LINHAS.map((linha) => (
                <div
                  key={linha.titulo}
                  className="border-creme/10 flex min-h-[84px] flex-col justify-center gap-0.5 border-b px-5 py-4 last:border-b-0 sm:px-8"
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-lg" aria-hidden="true">
                      {linha.icone}
                    </span>
                    <span className="text-creme text-sm font-semibold">{linha.titulo}</span>
                  </div>
                  <span className="text-marmita text-sm font-semibold whitespace-nowrap">{linha.com}</span>
                </div>
              ))}
            </div>

            <div className="absolute inset-y-0 z-10 w-px bg-white/40" style={{ left: `${100 - pos}%` }}>
              <div
                onPointerDown={aoPressionar}
                role="slider"
                aria-label="Arraste para comparar antes e depois"
                aria-valuenow={Math.round(pos)}
                aria-valuemin={10}
                aria-valuemax={90}
                tabIndex={0}
                className="bg-creme text-carvao absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full text-base font-bold shadow-lg shadow-black/40"
              >
                ⇆
              </div>
            </div>
          </div>
          <p className="text-creme/55 mt-3 text-center text-xs">Arraste a bolinha pros lados</p>
        </Reveal>
      </div>
    </section>
  )
}
