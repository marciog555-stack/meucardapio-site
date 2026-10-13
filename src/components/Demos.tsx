import { DEMOS } from '../data/demos'
import { Reveal } from './Reveal'

export function Demos() {
  return (
    <section id="demos" className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-creme/65 text-xs font-semibold tracking-[0.3em] uppercase">
            Não é mockup — é site no ar
          </p>
          <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
            Teste agora no seu celular
          </h2>
          <p className="text-creme/75 mt-4 max-w-xl text-base sm:text-lg">
            Duas lojas de demonstração, com cardápio de exemplo, rodando no mesmo sistema que vai pro seu
            restaurante.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {DEMOS.map((demo, i) => (
            <Reveal key={demo.nome} delayMs={80 * i}>
              <div className="border-creme/10 bg-carvao-claro grid h-full overflow-hidden rounded-2xl border sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <a
                  href={demo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-80 overflow-hidden sm:aspect-[480/820] sm:h-auto"
                  aria-label={`Abrir a loja ${demo.nome}`}
                >
                  <img
                    src={demo.foto}
                    alt={`Tela do site — ${demo.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </a>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: demo.cor }}>
                    {demo.tipo}
                  </span>
                  <h3 className="font-display text-creme mt-2 text-3xl uppercase">{demo.nome}</h3>
                  <p className="text-creme/75 mt-3 text-sm sm:text-base">{demo.descricao}</p>
                  <a
                    href={demo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: demo.cor }}
                  >
                    Abrir a loja →
                  </a>
                  <span className="text-creme/55 mt-1 text-xs">{demo.dica}</span>
                  <a
                    href={demo.painel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-creme/20 text-creme mt-5 inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold"
                  >
                    Ver o painel do dono →
                  </a>
                  <span className="text-creme/55 mt-1 text-xs">Pedidos, vendas, mesas abertas — pode clicar, nada é salvo</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
