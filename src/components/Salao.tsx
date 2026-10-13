import { Reveal } from './Reveal'

const ITENS = [
  {
    icone: '📱',
    titulo: 'QR Code em cada mesa',
    texto: 'O cliente aponta a câmera e o cardápio já abre na mesa certa. Ninguém digita nada.',
  },
  {
    icone: '🍳',
    titulo: 'Pedido direto pra cozinha',
    texto: 'Cai no painel com o número da mesa, com aviso sonoro e impressão na impressora térmica.',
  },
  {
    icone: '🔔',
    titulo: 'Chamar garçom',
    texto: 'Um toque no celular e o chamado aparece no painel, com a mesa que chamou.',
  },
  {
    icone: '🧾',
    titulo: 'Comandas separadas',
    texto: 'Casal numa conta, amigo em outra — na mesma mesa. Cada um vê e paga o seu.',
  },
  {
    icone: '💳',
    titulo: 'Mesas abertas e conta',
    texto: 'Total de cada comanda, “Imprimir conta” e fechar a mesa inteira ou só uma comanda.',
  },
  {
    icone: '🖥️',
    titulo: 'Tablet na mesa',
    texto: 'Modo tela cheia que volta sozinho pro início depois de alguns minutos sem uso.',
  },
]

export function Salao() {
  return (
    <section id="mesa" className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Bar, restaurante e petiscaria
          </p>
          <h2 className="font-display text-creme mt-3 max-w-3xl text-4xl uppercase sm:text-5xl">
            Atende na mesa? O pedido sai do celular do cliente
          </h2>
          <p className="text-creme/60 mt-4 max-w-xl text-base sm:text-lg">
            Pra quem atende no local, sem delivery: o site vira o cardápio do salão. Menos fila no balcão, menos
            pedido anotado errado, garçom livre pra atender.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITENS.map((item, i) => (
            <Reveal key={item.titulo} as="li" delayMs={60 * (i % 3)}>
              <div className="border-creme/10 bg-carvao-claro h-full rounded-2xl border p-6">
                <span className="text-2xl" aria-hidden="true">
                  {item.icone}
                </span>
                <h3 className="font-display text-creme mt-3 text-xl uppercase">{item.titulo}</h3>
                <p className="text-creme/60 mt-1 text-sm">{item.texto}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
