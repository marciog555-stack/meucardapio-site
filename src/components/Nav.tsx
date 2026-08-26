export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center px-6 py-5 sm:px-10 lg:px-20">
      <div
        className="from-carvao via-carvao/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b to-transparent"
        aria-hidden="true"
      />
      <span className="font-display text-creme text-xl tracking-wide uppercase">
        Meu<span className="text-burger">Cardápio</span>Go
      </span>
    </nav>
  )
}
