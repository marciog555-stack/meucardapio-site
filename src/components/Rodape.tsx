const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápio e quero um site assim pro meu restaurante.')

export function Rodape() {
  return (
    <footer className="border-creme/10 border-t px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-display text-creme text-2xl uppercase">
            Meu<span className="text-burger">Cardápio</span>
          </span>
          <p className="text-creme/50 mt-3 max-w-xs text-sm">
            O sistema de pedidos que é seu — site próprio, WhatsApp direto,
            sem comissão por pedido.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetico
            className="bg-burger text-creme inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold uppercase transition-transform active:scale-95"
          >
            Falar no WhatsApp
          </a>
          <p className="text-creme/60 text-xs">Resposta rápida, sem robô</p>
        </div>
      </div>

      <div className="text-creme/60 mx-auto mt-14 flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span>© {new Date().getFullYear()} MeuCardápio — Todos os direitos reservados.</span>
        <a href="/privacidade" className="hover:text-creme underline">
          Política de Privacidade
        </a>
      </div>
    </footer>
  )
}
