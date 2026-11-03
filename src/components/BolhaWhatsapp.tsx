import { useEffect, useState } from 'react'

const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Vi o MeuCardápioGo e tenho uma dúvida.')

/** Bolha fixa de WhatsApp — só aparece depois que a pessoa já saiu do Hero
 * (lá embaixo já tem um CTA grande, a bolha ali em cima só ia competir com
 * ele). Mesmo WhatsApp do resto da página, mensagem só muda pra soar como
 * dúvida, não como "quero contratar". */
export function BolhaWhatsapp() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    function aoRolar() {
      setVisivel(window.scrollY > window.innerHeight * 0.6)
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvidas no WhatsApp"
      data-magnetico
      className={`bg-carvao-claro border-creme/10 text-creme fixed right-5 bottom-5 z-40 flex min-h-12 items-center gap-2 rounded-full border py-3 pr-5 pl-4 text-sm font-semibold shadow-lg shadow-black/40 transition-[opacity,transform] duration-300 sm:right-8 sm:bottom-8 ${
        visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="text-xl" aria-hidden="true">
        💬
      </span>
      <span className="hidden sm:inline">Tire suas dúvidas</span>
    </a>
  )
}
