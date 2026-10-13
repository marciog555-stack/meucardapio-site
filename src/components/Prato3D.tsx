import { createElement, useEffect, useRef, useState } from 'react'

/**
 * Demonstração ao vivo do MeuCardápio 3D: o mesmo <model-viewer> (versão
 * fixada no package.json) que roda no cardápio dos clientes, com o frango da
 * loja de demonstração Resenha Bar. A biblioteca e o modelo (~2,4 MB) só
 * baixam quando a seção chega perto da tela.
 */
export function Prato3D() {
  const caixaRef = useRef<HTMLDivElement>(null)
  const [perto, setPerto] = useState(false)
  const [pronto, setPronto] = useState(false)
  const [falhou, setFalhou] = useState(false)

  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPerto(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!perto) return
    let cancelado = false
    import('@google/model-viewer')
      .then(() => {
        if (!cancelado) setPronto(true)
      })
      .catch(() => {
        if (!cancelado) setFalhou(true)
      })
    return () => {
      cancelado = true
    }
  }, [perto])

  return (
    <div
      ref={caixaRef}
      className="border-creme/10 bg-carvao-claro relative aspect-square w-full overflow-hidden rounded-2xl border"
    >
      {pronto && !falhou ? (
        createElement(
          'model-viewer',
          {
            src: '/3d/frango-a-passarinho.glb',
            alt: 'Porção de frango a passarinho em 3D',
            ar: '',
            'ar-modes': 'webxr scene-viewer quick-look',
            'ar-scale': 'fixed',
            'camera-controls': '',
            'auto-rotate': '',
            'touch-action': 'pan-y',
            'shadow-intensity': '1',
            'interaction-prompt': 'none',
            style: { width: '100%', height: '100%', backgroundColor: 'transparent' },
          },
          <button
            type="button"
            slot="ar-button"
            className="bg-macarrao text-carvao absolute bottom-4 left-1/2 min-h-12 -translate-x-1/2 rounded-full px-6 text-sm font-bold whitespace-nowrap shadow-lg"
          >
            📱 Ver na sua mesa
          </button>,
        )
      ) : (
        <p className="text-creme/50 flex h-full items-center justify-center p-8 text-center text-sm">
          {falhou ? 'Não consegui carregar o 3D neste aparelho.' : 'Carregando o prato em 3D…'}
        </p>
      )}
      <span className="bg-carvao/80 text-creme/80 pointer-events-none absolute top-3 left-3 rounded-full px-3 py-1 text-xs">
        Ao vivo · arraste para girar
      </span>
    </div>
  )
}
