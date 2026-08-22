import { GraficoEconomia } from './GraficoEconomia'
import { Reveal } from './Reveal'

export function Problema() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-20">
      <Reveal>
        <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
          O problema
        </p>
        <h2 className="font-display text-creme mt-3 max-w-2xl text-4xl uppercase sm:text-5xl">
          Aplicativo de entrega não trabalha pra você
        </h2>
        <p className="text-creme/60 mt-4 max-w-xl text-base sm:text-lg">
          Até 30% de comissão por pedido, cliente que fica sendo do app — não seu —, e sua marca
          perdida no meio de mil outras. No fim do mês, é você quem paga essa conta.
        </p>
      </Reveal>

      <Reveal delayMs={100}>
        <div className="border-creme/10 bg-carvao-claro mt-14 rounded-2xl border p-6 sm:p-10">
          <GraficoEconomia />
        </div>
      </Reveal>
    </section>
  )
}
