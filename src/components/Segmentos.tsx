import { SEGMENTO_DESTAQUE } from '../data/segmentos'
import { Reveal } from './Reveal'

export function Segmentos() {
  return (
    <section id="segmentos" className="px-6 py-24 sm:px-10 lg:px-20">
      <Reveal>
        <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
          Não é mockup — é site no ar
        </p>
        <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
          Um restaurante de verdade já usa
        </h2>
      </Reveal>

      <Reveal delayMs={80}>
        <a
          href={SEGMENTO_DESTAQUE.link}
          target="_blank"
          rel="noopener noreferrer"
          className="border-creme/10 bg-carvao-claro group mt-10 grid overflow-hidden rounded-2xl border sm:grid-cols-2"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={SEGMENTO_DESTAQUE.foto}
              alt={`Tela do site — ${SEGMENTO_DESTAQUE.nome}`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h3 className="font-display text-creme text-3xl uppercase sm:text-4xl">
              {SEGMENTO_DESTAQUE.nome}
            </h3>
            <p className="text-creme/70 mt-3 max-w-sm text-base">{SEGMENTO_DESTAQUE.descricao}</p>
            <span
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: SEGMENTO_DESTAQUE.cor }}
            >
              Ver o site →
            </span>
          </div>
        </a>
      </Reveal>
    </section>
  )
}
