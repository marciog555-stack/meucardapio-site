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

/** No celular, arrastar uma faixa estreita competia com o dedo tentando só
 * rolar a página (o toque ficava "preso" ali) e o texto cortava de lado —
 * então no mobile isso vira um toggle simples de 2 botões, sem gesto
 * nenhum. Do tablet pra cima, onde tem espaço de sobra e normalmente é
 * mouse, continua o slider arrastável lado a lado. */
export function Comparativo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrastando = useRef(false)
  const [pos, setPos] = useState(50)
  const [ladoMobile, setLadoMobile] = useState<'sem' | 'com'>('com')

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
            Compare
          </h2>
        </Reveal>

        {/* Celular: toggle de 2 botões, uma coluna só por vez. */}
        <Reveal delayMs={100} className="sm:hidden">
          <div className="border-creme/10 mt-8 flex gap-1 rounded-full border p-1">
            <button
              type="button"
              onClick={() => setLadoMobile('sem')}
              className={`min-h-10 flex-1 rounded-full text-sm font-bold uppercase transition-colors ${
                ladoMobile === 'sem' ? 'bg-burger text-creme' : 'text-burger'
              }`}
            >
              Sem
            </button>
            <button
              type="button"
              onClick={() => setLadoMobile('com')}
              className={`min-h-10 flex-1 rounded-full text-sm font-bold uppercase transition-colors ${
                ladoMobile === 'com' ? 'bg-marmita text-carvao' : 'text-marmita'
              }`}
            >
              Com MeuCardápioGo
            </button>
          </div>
          <div
            className="border-creme/10 mt-3 flex flex-col overflow-hidden rounded-2xl border"
            style={{
              backgroundColor: `color-mix(in srgb, var(--color-${ladoMobile === 'sem' ? 'burger' : 'marmita'}) ${ladoMobile === 'sem' ? 10 : 12}%, transparent)`,
            }}
          >
            {LINHAS.map((linha) => (
              <div
                key={linha.titulo}
                className="border-creme/10 flex flex-col gap-0.5 border-b px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {linha.icone}
                  </span>
                  <span className="text-creme text-sm font-semibold">{linha.titulo}</span>
                </div>
                <span className={`text-sm font-semibold ${ladoMobile === 'sem' ? 'text-burger' : 'text-marmita'}`}>
                  {ladoMobile === 'sem' ? linha.sem : linha.com}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tablet/desktop: slider arrastável lado a lado. */}
        <Reveal delayMs={100} className="hidden sm:block">
          <div
            ref={containerRef}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerLeave={aoSoltar}
            className="border-creme/10 relative mt-10 flex overflow-hidden rounded-2xl border select-none"
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
                style={{ touchAction: 'none' }}
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
