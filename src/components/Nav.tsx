const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápio e quero um site assim pro meu restaurante.')

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-20">
      <div
        className="from-carvao via-carvao/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b to-transparent"
        aria-hidden="true"
      />
      <span className="font-display text-creme text-xl tracking-wide uppercase">
        Meu<span className="text-burger">Cardápio</span>
      </span>
      <a
        href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
        target="_blank"
        rel="noopener noreferrer"
        data-magnetico
        className="border-creme/30 text-creme hover:bg-creme hover:text-carvao flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold backdrop-blur-sm transition-colors active:scale-95"
      >
        Quero o meu
      </a>
    </nav>
  )
}
