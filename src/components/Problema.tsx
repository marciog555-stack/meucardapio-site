import { GraficoEconomia } from './GraficoEconomia'
import { Reveal } from './Reveal'

const PONTOS_DE_DOR = [
  {
    icone: '🕒',
    titulo: 'Cliente espera, desiste',
    texto: 'Sem link direto, o pedido demora mais um passo — e parte do cliente desiste no meio.',
  },
  {
    icone: '💸',
    titulo: 'Até 30% vai embora',
    texto: 'Comissão por pedido come a margem antes do dinheiro cair na sua conta.',
  },
  {
    icone: '👤',
    titulo: 'O cliente é do app',
    texto: 'Quem pediu fica cadastrado na plataforma — não no seu WhatsApp, não na sua marca.',
  },
  {
    icone: '🎨',
    titulo: 'Sua marca, perdida',
    texto: 'Catálogo genérico, igual ao do concorrente logo ao lado, no mesmo aplicativo.',
  },
]

export function Problema() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-creme/65 text-xs font-semibold tracking-[0.3em] uppercase">
            O problema
          </p>
          <h2 className="font-display text-creme mt-3 max-w-2xl text-4xl uppercase sm:text-5xl">
            Aplicativo de entrega não trabalha pra você
          </h2>
          <p className="text-creme/75 mt-4 max-w-xl text-base sm:text-lg">
            No fim do mês, é você quem paga essa conta — de quatro jeitos diferentes.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PONTOS_DE_DOR.map((ponto, i) => (
            <Reveal key={ponto.titulo} as="li" delayMs={60 * i}>
              <div className="border-creme/10 bg-carvao-claro h-full rounded-2xl border p-6">
                <span className="text-2xl" aria-hidden="true">
                  {ponto.icone}
                </span>
                <h3 className="text-creme mt-3 font-semibold">{ponto.titulo}</h3>
                <p className="text-creme/75 mt-1 text-sm">{ponto.texto}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delayMs={100}>
          <div className="border-creme/10 bg-carvao-claro mt-10 max-w-2xl rounded-2xl border p-6 sm:p-10">
            <GraficoEconomia />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
