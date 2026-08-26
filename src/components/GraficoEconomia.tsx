import { useEffect, useRef } from 'react'
import { COMISSAO_APP, FAIXAS_PEDIDOS, PRECO_MENSAL } from '../data/economia'
import { gsap, reduzMovimento, ScrollTrigger } from '../lib/gsap'
import { formatarPreco } from '../lib/formato'

const COR_APP = 'var(--color-burger)'
const COR_MEUCARDAPIO = 'var(--color-marmita)'

const LARGURA_BARRA = 22
const TOPO_AREA = 20
const BASE = 260
const MARGEM_ESQUERDA = 64
const MARGEM_DIREITA = 20
const LARGURA_TOTAL = 640
const DOMINIO_MAX = 2500
const TICKS = [0, 1000, 2000]

function formatarTick(valor: number) {
  return valor === 0 ? 'R$0' : `R$${valor.toLocaleString('pt-BR')}`
}

function y(valor: number) {
  return BASE - (valor / DOMINIO_MAX) * (BASE - TOPO_AREA)
}

/** Caminho de uma barra com topo arredondado e base reta (spec do
 * dataviz: "4px rounded data-end, square at the baseline"). */
function caminhoBarra(x: number, valor: number) {
  const topo = y(valor)
  const r = Math.min(4, LARGURA_BARRA / 2, BASE - topo)
  if (BASE - topo <= 0) return ''
  return `M${x},${BASE} L${x},${topo + r} Q${x},${topo} ${x + r},${topo} L${x + LARGURA_BARRA - r},${topo} Q${x + LARGURA_BARRA},${topo} ${x + LARGURA_BARRA},${topo + r} L${x + LARGURA_BARRA},${BASE} Z`
}

export function GraficoEconomia() {
  const svgRef = useRef<SVGSVGElement>(null)
  const barrasRef = useRef<(SVGPathElement | null)[]>([])
  const rotulosRef = useRef<(SVGTextElement | null)[]>([])

  const larguraGrupo = (LARGURA_TOTAL - MARGEM_ESQUERDA - MARGEM_DIREITA) / FAIXAS_PEDIDOS.length
  const faixaCem = FAIXAS_PEDIDOS.find((f) => f.pedidos === 100)
  const economiaCem = faixaCem ? faixaCem.custoApp - faixaCem.custoMeuCardapio : 0

  useEffect(() => {
    if (reduzMovimento() || !svgRef.current) return

    // As barras crescem de baixo pra cima (scaleY, âncora na base) e o
    // valor aparece logo depois — só a cor é o dado; o resto é reforço.
    const ctx = gsap.context(() => {
      gsap.set(barrasRef.current, { scaleY: 0, transformOrigin: '50% 100%' })
      gsap.set(rotulosRef.current, { opacity: 0, y: 6 })

      ScrollTrigger.create({
        trigger: svgRef.current,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          barrasRef.current.forEach((barra, i) => {
            tl.to(barra, { scaleY: 1, duration: 0.4 }, i * 0.04)
            tl.to(rotulosRef.current[i], { opacity: 1, y: 0, duration: 0.25 }, i * 0.04 + 0.22)
          })
        },
      })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COR_APP }}
            aria-hidden="true"
          />
          <span className="text-creme/70">Comissão do app ({COMISSAO_APP * 100}%)</span>
        </li>
        <li className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COR_MEUCARDAPIO }}
            aria-hidden="true"
          />
          <span className="text-creme/70">MeuCardápioGo ({formatarPreco(PRECO_MENSAL)}/mês)</span>
        </li>
      </ul>

      <svg
        ref={svgRef}
        viewBox="0 0 640 300"
        className="w-full"
        role="img"
        aria-labelledby="grafico-economia-titulo"
      >
        <title id="grafico-economia-titulo">
          Comparação de custo mensal: comissão de app de delivery vs. MeuCardápioGo, por faixa de
          pedidos
        </title>

        {TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGEM_ESQUERDA}
              x2={LARGURA_TOTAL - MARGEM_DIREITA}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--color-creme)"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
            <text
              x={MARGEM_ESQUERDA - 8}
              y={y(tick) + 4}
              textAnchor="end"
              className="fill-creme/60 text-[11px]"
            >
              {formatarTick(tick)}
            </text>
          </g>
        ))}

        {FAIXAS_PEDIDOS.map((faixa, i) => {
          const centroGrupo = MARGEM_ESQUERDA + (i + 0.5) * larguraGrupo
          const xApp = centroGrupo - LARGURA_BARRA - 5
          const xMeu = centroGrupo + 5

          return (
            <g key={faixa.pedidos}>
              <path
                ref={(el) => {
                  barrasRef.current[i * 2] = el
                }}
                d={caminhoBarra(xApp, faixa.custoApp)}
                fill={COR_APP}
              />
              <text
                ref={(el) => {
                  rotulosRef.current[i * 2] = el
                }}
                x={xApp + LARGURA_BARRA / 2}
                y={y(faixa.custoApp) - 8}
                textAnchor="middle"
                className="fill-creme text-[12px] font-semibold"
              >
                {formatarPreco(faixa.custoApp)}
              </text>

              <path
                ref={(el) => {
                  barrasRef.current[i * 2 + 1] = el
                }}
                d={caminhoBarra(xMeu, faixa.custoMeuCardapio)}
                fill={COR_MEUCARDAPIO}
              />
              <text
                ref={(el) => {
                  rotulosRef.current[i * 2 + 1] = el
                }}
                x={xMeu + LARGURA_BARRA / 2}
                y={y(faixa.custoMeuCardapio) - 8}
                textAnchor="middle"
                className="fill-creme text-[12px] font-semibold"
              >
                {formatarPreco(faixa.custoMeuCardapio)}
              </text>

              <text
                x={centroGrupo}
                y={BASE + 22}
                textAnchor="middle"
                className="fill-creme/60 text-[12px]"
              >
                {faixa.pedidos} pedidos/mês
              </text>
            </g>
          )
        })}

        <line
          x1={MARGEM_ESQUERDA}
          x2={LARGURA_TOTAL - MARGEM_DIREITA}
          y1={BASE}
          y2={BASE}
          stroke="var(--color-creme)"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
      </svg>

      <table className="sr-only">
        <caption>Custo mensal: comissão do app vs. MeuCardápioGo, por faixa de pedidos</caption>
        <thead>
          <tr>
            <th>Pedidos por mês</th>
            <th>Comissão do app</th>
            <th>MeuCardápioGo</th>
          </tr>
        </thead>
        <tbody>
          {FAIXAS_PEDIDOS.map((faixa) => (
            <tr key={faixa.pedidos}>
              <td>{faixa.pedidos}</td>
              <td>{formatarPreco(faixa.custoApp)}</td>
              <td>{formatarPreco(faixa.custoMeuCardapio)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-creme mt-4 text-base sm:text-lg">
        Com 100 pedidos por mês, isso é{' '}
        <span className="text-burger font-semibold">{formatarPreco(economiaCem)} a mais</span> no
        seu bolso, todo mês.
      </p>
      <p className="text-creme/60 mt-2 text-xs">
        Estimativa com ticket médio de R$45 e comissão de 25% — os números reais do seu restaurante
        podem variar.
      </p>
    </div>
  )
}
