import { PRECO_360_MENSAL, TABELA_3D } from '../data/planos'
import { formatarPreco } from '../lib/formato'
import { Prato3D } from './Prato3D'
import { Reveal } from './Reveal'

const RECURSOS = [
  {
    titulo: 'Prato em 3D',
    texto: 'O cliente gira a porção com o dedo, aproxima e vê cada detalhe — muito além de uma foto.',
  },
  {
    titulo: '“Ver na mesa” (realidade aumentada)',
    texto: 'Pela câmera do celular, o prato aparece em tamanho real em cima da mesa, antes de pedir.',
  },
  {
    titulo: 'Giro 360° por vídeo',
    texto: 'Pra drinks, copos e o que não dá pra escanear: um vídeo curto do prato girando já basta.',
  },
  {
    titulo: 'QR Code por produto',
    texto: 'Imprima no cardápio de papel ou no display da mesa: abre direto naquele prato em 3D.',
  },
  {
    titulo: 'Quanto vende quem tem 3D',
    texto: 'No painel: quantos abriram o 3D, quantos viram na mesa e as vendas de cada prato.',
  },
]

export function Novidade360() {
  return (
    <section id="3d" className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-macarrao text-xs font-semibold tracking-[0.3em] uppercase">
            Novo · MeuCardápio 3D
          </p>
          <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
            O prato na mesa antes do pedido
          </h2>
          <p className="text-creme/75 mt-4 max-w-xl text-base sm:text-lg">
            O cliente vê exatamente o que vai chegar. Esse prato aqui é de verdade: abra no celular e toque em
            “Ver na sua mesa”.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {RECURSOS.map((r) => (
              <li key={r.titulo} className="border-creme/10 border-l-2 pl-4">
                <h3 className="text-creme font-semibold">{r.titulo}</h3>
                <p className="text-creme/75 mt-0.5 text-sm">{r.texto}</p>
              </li>
            ))}
          </ul>
          <p className="text-creme/65 mt-8 text-sm">
            Add-on opcional
            {PRECO_360_MENSAL !== null ? ` · +${formatarPreco(PRECO_360_MENSAL)}/mês` : ' · valor sob consulta'}, com
            pacotes de pratos a partir de {formatarPreco(TABELA_3D[0].preco)}. Inclui também o atendimento na mesa
            (abaixo).
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
