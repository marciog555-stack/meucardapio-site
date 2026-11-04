import { PRECO_360_MENSAL, PRECO_3D_A_PARTIR_DE } from '../data/planos'
import { formatarPreco } from '../lib/formato'
import { Prato3D } from './Prato3D'
import { Reveal } from './Reveal'

/** Junta num grid só o que antes eram duas seções separadas (3D/AR e
 * atendimento na mesa) — mesmo add-on, menos espaço na página. */
const RECURSOS = [
  { icone: '🔄', titulo: 'Prato em 3D', texto: 'Gira com o dedo, aproxima, vê cada detalhe — muito além de uma foto.' },
  { icone: '📲', titulo: '"Ver na mesa" (AR)', texto: 'Pela câmera do celular, o prato aparece em tamanho real antes de pedir.' },
  { icone: '📱', titulo: 'QR Code na mesa', texto: 'O cliente aponta a câmera e o pedido cai direto pra cozinha.' },
  { icone: '🔔', titulo: 'Chamar garçom', texto: 'Um toque no celular e o chamado aparece no painel.' },
  { icone: '🧾', titulo: 'Comandas separadas', texto: 'Casal numa conta, amigo em outra — cada um vê e paga o seu.' },
  { icone: '📊', titulo: 'Métricas de venda', texto: 'Quantos abriram o 3D, viram na mesa e o quanto venderam.' },
]

export function Novidade360() {
  return (
    <section id="3d" className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-macarrao text-xs font-semibold tracking-[0.3em] uppercase">
            Add-on · MeuCardápio 3D
          </p>
          <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
            Prato em 3D e pedido na mesa
          </h2>
          <p className="text-creme/75 mt-4 max-w-xl text-base sm:text-lg">
            Esse prato aqui é de verdade: abra no celular e toque em "Ver na sua mesa". Pra quem
            atende no local, vira também o cardápio da mesa — sem papel, sem fila no balcão.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RECURSOS.map((r) => (
              <li key={r.titulo} className="border-creme/10 bg-carvao-claro rounded-xl border p-4">
                <span className="text-lg" aria-hidden="true">
                  {r.icone}
                </span>
                <h3 className="text-creme mt-1.5 text-sm font-semibold">{r.titulo}</h3>
                <p className="text-creme/70 mt-0.5 text-xs">{r.texto}</p>
              </li>
            ))}
          </ul>

          <p className="text-creme/65 mt-8 text-sm">
            Opcional
            {PRECO_360_MENSAL !== null ? ` · +${formatarPreco(PRECO_360_MENSAL)}/mês` : ' · valor sob consulta'}, com
            pratos em 3D a partir de {formatarPreco(PRECO_3D_A_PARTIR_DE)}.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <Prato3D />
          <p className="text-creme/55 mt-3 text-center text-xs">
            “Ver na sua mesa” aparece em celulares com realidade aumentada (a maioria dos Android e iPhone atuais).
          </p>
        </Reveal>
      </div>
    </section>
  )
}
