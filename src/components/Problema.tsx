import { PROBLEMAS } from '../data/problemas'
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
      </Reveal>

      <ul className="border-creme/10 mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
        {PROBLEMAS.map((problema, i) => (
          <Reveal as="li" key={problema.titulo} delayMs={Math.min(i, 8) * 60}>
            <div className="bg-carvao-claro flex h-full flex-col gap-2 p-6 sm:p-8">
              <span className="text-burger font-mono text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-creme text-xl uppercase sm:text-2xl">
                {problema.titulo}
              </h3>
              <p className="text-creme/60 text-sm sm:text-base">{problema.descricao}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
