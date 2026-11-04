import { PRECO_MENSAL, PRECO_MONTAGEM, PRECO_PRIMEIRO_MES } from '../data/planos'
import { formatarPreco } from '../lib/formato'
import { Reveal } from './Reveal'

const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápioGo e quero um site assim pro meu restaurante.')

const SELOS = ['Sem comissão por pedido', 'Sem contrato', 'Fala direto com o dono', 'Cancela quando quiser']

export function Confianca() {
  return (
    <section id="preco" className="px-6 py-24 sm:px-10 lg:px-20">
      <Reveal>
        <div className="border-creme/10 mx-auto max-w-2xl rounded-2xl border p-8 text-center sm:p-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {SELOS.map((selo) => (
              <li key={selo} className="text-creme/75 flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-marmita" aria-hidden="true">✓</span>
                {selo}
              </li>
            ))}
          </ul>
          <h2 className="font-display text-creme mt-6 text-3xl uppercase sm:text-4xl">
            {formatarPreco(PRECO_PRIMEIRO_MES)} no primeiro mês. {formatarPreco(PRECO_MENSAL)} por mês depois.
          </h2>
          <p className="text-creme/75 mt-2 text-sm">
            {formatarPreco(PRECO_MONTAGEM)} de implantação + {formatarPreco(PRECO_MENSAL)} da primeira mensalidade.
          </p>
          <p className="text-creme/65 mt-3 text-sm">
            A partir de R$40 anual, você tem o seu domínio próprio.
          </p>
          <p className="text-creme/65 mt-6 text-sm">
            Fala direto comigo — sem vendedor, sem robô de atendimento.
          </p>
          <p className="text-creme mt-1 font-semibold">Márcio</p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetico
            className="bg-burger text-creme mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold uppercase transition-transform active:scale-95"
          >
            Quero meu site
          </a>
        </div>
      </Reveal>
    </section>
  )
}
