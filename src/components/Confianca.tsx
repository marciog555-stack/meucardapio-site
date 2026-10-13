import { PRECO_360_MENSAL, PRECO_MENSAL, PRECO_MONTAGEM, PRECO_PRIMEIRO_MES, TABELA_3D } from '../data/planos'
import { formatarPreco } from '../lib/formato'
import { Reveal } from './Reveal'

const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápioGo e quero um site assim pro meu restaurante.')

export function Confianca() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-20">
      <Reveal>
        <div className="border-creme/10 mx-auto max-w-2xl rounded-2xl border p-8 text-center sm:p-12">
          <h2 className="font-display text-creme text-3xl uppercase sm:text-4xl">
            {formatarPreco(PRECO_PRIMEIRO_MES)} no primeiro mês. {formatarPreco(PRECO_MENSAL)} por mês depois.
          </h2>
          <p className="text-creme/75 mt-2 text-sm">
            {formatarPreco(PRECO_MONTAGEM)} de implantação + {formatarPreco(PRECO_MENSAL)} da primeira mensalidade.
          </p>
          <p className="text-creme/75 mt-3 text-base sm:text-lg">
            Sem contrato, sem fidelidade, sem letra miúda. Cancela quando quiser.
          </p>
          <p className="text-creme/65 mt-3 text-sm">
            A partir de R$40 anual, você tem o seu domínio próprio.
          </p>
          <div className="border-macarrao/40 mt-6 rounded-xl border px-5 py-5 text-left">
            <p className="text-macarrao text-center text-xs font-semibold tracking-[0.2em] uppercase">
              Add-on MeuCardápio 3D
            </p>
            <p className="text-creme mt-1 text-center text-xl font-semibold">
              {PRECO_360_MENSAL !== null ? `+${formatarPreco(PRECO_360_MENSAL)} por mês` : 'Valor sob consulta'}
            </p>
            <p className="text-creme/75 mt-1 text-center text-sm">
              Prato em 3D, “Ver na mesa”, giro 360° e, pra quem atende no local, pedido pela mesa com QR Code,
              garçom e comandas.
            </p>
            <p className="text-creme/65 mt-4 text-xs font-semibold tracking-[0.2em] uppercase">
              Implantação dos pratos (pagamento único)
            </p>
            <ul className="divide-creme/10 mt-1 divide-y">
              {TABELA_3D.map((linha) => (
                <li key={linha.item} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <span className="text-creme/80">
                    {linha.item}
                    {linha.detalhe && <span className="text-creme/55"> · {linha.detalhe}</span>}
                  </span>
                  <span className="text-creme shrink-0 font-semibold tabular-nums">{formatarPreco(linha.preco)}</span>
                </li>
              ))}
            </ul>
          </div>
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
