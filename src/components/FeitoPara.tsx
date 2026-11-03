const TIPOS = [
  { icone: '🍔', nome: 'Hamburgueria' },
  { icone: '🍝', nome: 'Massas' },
  { icone: '🍱', nome: 'Marmitaria' },
  { icone: '🍺', nome: 'Bar e petiscaria' },
]

/** Faixa rápida entre seções — só os tipos de negócio que o produto já
 * atende de verdade hoje (ver animação por restaurante no admin), nada de
 * lista genérica "serve qualquer segmento". */
export function FeitoPara() {
  return (
    <section className="border-creme/10 border-y px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="text-creme/65 shrink-0 text-xs font-semibold tracking-[0.3em] uppercase">
          Feito pra
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TIPOS.map((tipo) => (
            <li key={tipo.nome} className="text-creme/85 flex items-center gap-2 text-sm font-semibold">
              <span className="text-lg" aria-hidden="true">
                {tipo.icone}
              </span>
              {tipo.nome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
