import { PRECO_360_MENSAL, PRECO_MENSAL, PRECO_MONTAGEM, PRECO_PRIMEIRO_MES } from '../data/planos'
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
          <p className="text-creme/60 mt-2 text-sm">
            {formatarPreco(PRECO_MONTAGEM)} de montagem + {formatarPreco(PRECO_MENSAL)} da primeira mensalidade.
          </p>
          <p className="text-creme/60 mt-3 text-base sm:text-lg">
            Sem contrato, sem fidelidade, sem letra miúda. Cancela quando quiser.
          </p>
          <p className="text-creme/50 mt-3 text-sm">
            A partir de R$40 anual, você tem o seu domínio próprio.
          </p>
          <div className="border-macarrao/40 mt-6 rounded-xl border px-5 py-4">
            <p className="text-macarrao text-xs font-semibold tracking-[0.2em] uppercase">Add-on MeuCardápio 360</p>
            <p className="text-creme mt-1 text-base font-semibold">
              {PRECO_360_MENSAL !== null ? `+${formatarPreco(PRECO_360_MENSAL)} por mês` : 'Valor sob consulta'}
            </p>
            <p className="text-creme/60 mt-1 text-sm">
              Prato em 3D, “Ver na mesa”, giro 360° e, pra quem atende no local, pedido pela mesa com QR Code,
              garçom e comandas.
            </p>
          </div>
          <p className="text-creme/50 mt-6 text-sm">
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
