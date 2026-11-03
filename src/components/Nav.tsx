const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápioGo e quero um site assim pro meu restaurante.')

const LINKS = [
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: '#demos', rotulo: 'Demonstração' },
  { href: '#avaliacoes', rotulo: 'Avaliações' },
  { href: '#preco', rotulo: 'Preço' },
]

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-20">
      <div
        className="from-carvao via-carvao/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b to-transparent"
        aria-hidden="true"
      />
      <span className="font-display text-creme shrink-0 text-xl tracking-wide uppercase">
        Meu<span className="text-burger">Cardápio</span>Go
      </span>

      <ul className="hidden items-center gap-8 lg:flex">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-creme/75 hover:text-creme text-sm font-semibold">
              {link.rotulo}
            </a>
          </li>
        ))}
      </ul>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
        target="_blank"
        rel="noopener noreferrer"
        data-magnetico
        className="bg-burger text-creme inline-flex min-h-10 shrink-0 items-center rounded-full px-5 text-sm font-bold whitespace-nowrap uppercase transition-transform active:scale-95"
      >
        Quero meu site
      </a>
    </nav>
  )
}
