import { Reveal } from './Reveal'

const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápioGo e quero um site assim pro meu restaurante.')

export function Confianca() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-20">
      <Reveal>
        <div className="border-creme/10 mx-auto max-w-2xl rounded-2xl border p-8 text-center sm:p-12">
          <h2 className="font-display text-creme text-3xl uppercase sm:text-4xl">
            R$100 pra montar. R$50 por mês depois.
          </h2>
          <p className="text-creme/60 mt-3 text-base sm:text-lg">
            Sem contrato, sem fidelidade, sem letra miúda. Cancela quando quiser.
          </p>
          <p className="text-creme/50 mt-3 text-sm">
            Prefere usar o domínio da sua própria marca? Também dá — é só me falar.
          </p>
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
