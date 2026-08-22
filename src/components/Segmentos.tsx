import { useState } from 'react'
import { SEGMENTOS } from '../data/segmentos'
import { Reveal } from './Reveal'

export function Segmentos() {
  const [ativo, setAtivo] = useState<string | null>(null)
  const corAtiva = SEGMENTOS.find((s) => s.id === ativo)?.cor

  return (
    <section
      id="segmentos"
      className="relative px-6 py-24 transition-colors duration-700 sm:px-10 lg:px-20"
      style={{
        backgroundColor: corAtiva
          ? `color-mix(in srgb, ${corAtiva} 14%, var(--color-carvao))`
          : undefined,
      }}
    >
      <Reveal>
        <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
          Já rodando de verdade
        </p>
        <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
          Não é mockup — é site no ar
        </h2>
        <p className="text-creme/60 mt-4 max-w-xl text-base sm:text-lg">
          Três restaurantes de verdade já usam o MeuCardápio hoje. Clica e vê
          funcionando no seu celular.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:gap-8 lg:grid-cols-3">
        {SEGMENTOS.map((seg, i) => (
          <Reveal key={seg.id} delayMs={Math.min(i, 8) * 60}>
            <a
              href={seg.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setAtivo(seg.id)}
              onMouseLeave={() => setAtivo(null)}
              onFocus={() => setAtivo(seg.id)}
              onBlur={() => setAtivo(null)}
              className="border-creme/10 bg-carvao-claro group block overflow-hidden rounded-2xl border"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={seg.foto}
                  alt={`Tela do site — ${seg.nome}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-display text-creme text-2xl uppercase">{seg.nome}</h3>
                <p className="text-creme/70 mt-1 text-sm">{seg.descricao}</p>
                <span
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: seg.cor }}
                >
                  Ver o site →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
