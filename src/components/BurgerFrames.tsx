import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'

const TOTAL_QUADROS = 96
const CAMINHO = (i: number) => `/hero-burger/frame-${String(i + 1).padStart(3, '0')}.webp`

// Cor de fundo da página (--color-carvao) — usada pra "molhar" as bordas do
// quadro (que já é quase preto no vídeo original) com o resto da seção, em
// vez de deixar uma barra sólida diferente aparecendo nas laterais/topo.
const COR_FUNDO = '#0a0908'

/** "Momento de assinatura" do Hero: um vídeo real do hambúrguer se abrindo
 * (mandado pelo Márcio), tocado quadro a quadro conforme o scroll — a
 * técnica clássica de "scroll scrubbing" tipo Apple, com sequência de
 * imagens em vez de um <video> rodando sozinho. Recebe a seção do Hero por
 * fora (`containerRef`) pra usar como gatilho/tamanho do ScrollTrigger. */
export function BurgerFrames({
  containerRef,
  className,
}: {
  containerRef: RefObject<HTMLElement | null>
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const secao = containerRef.current
    const canvas = canvasRef.current
    if (!secao || !canvas) return

    const contexto = canvas.getContext('2d')
    if (!contexto) return

    let cancelado = false
    const quadros: HTMLImageElement[] = []
    for (let i = 0; i < TOTAL_QUADROS; i++) {
      const img = new Image()
      img.src = CAMINHO(i)
      quadros.push(img)
    }

    function tamanhoCss() {
      return { largura: secao!.clientWidth, altura: secao!.clientHeight }
    }

    function redimensionar() {
      const { largura, altura } = tamanhoCss()
      const proporcao = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = largura * proporcao
      canvas!.height = altura * proporcao
      canvas!.style.width = `${largura}px`
      canvas!.style.height = `${altura}px`
      contexto!.setTransform(proporcao, 0, 0, proporcao, 0, 0)
    }
    redimensionar()

    /** Desenha um quadro específico encaixado inteiro na área (sem cortar
     * as bordas do hambúrguer) — como o fundo do vídeo é quase preto igual
     * o fundo da página, a "moldura" fica invisível. */
    function desenharQuadro(indice: number) {
      const img = quadros[Math.max(0, Math.min(TOTAL_QUADROS - 1, indice))]
      const { largura, altura } = tamanhoCss()
      contexto!.fillStyle = COR_FUNDO
      contexto!.fillRect(0, 0, largura, altura)
      if (!img.complete || img.naturalWidth === 0) return
      const escala = Math.min(largura / img.naturalWidth, altura / img.naturalHeight)
      const larguraDesenho = img.naturalWidth * escala
      const alturaDesenho = img.naturalHeight * escala
      contexto!.drawImage(
        img,
        (largura - larguraDesenho) / 2,
        (altura - alturaDesenho) / 2,
        larguraDesenho,
        alturaDesenho,
      )
    }

    desenharQuadro(0)

    const reduzido = reduzMovimento()
    let scrollTriggerInstancia: ScrollTrigger | undefined
    let progressoAtual = 0

    quadros[0].addEventListener(
      'load',
      () => {
        if (!cancelado) desenharQuadro(0)
      },
      { once: true },
    )

    Promise.all(
      quadros.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve()
            else img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
          }),
      ),
    ).then(() => {
      if (cancelado) return
      if (reduzido) {
        desenharQuadro(TOTAL_QUADROS - 1)
        return
      }
      scrollTriggerInstancia = ScrollTrigger.create({
        trigger: secao,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          progressoAtual = self.progress
          desenharQuadro(Math.round(progressoAtual * (TOTAL_QUADROS - 1)))
        },
      })
    })

    const observadorResize = new ResizeObserver(() => {
      redimensionar()
      desenharQuadro(Math.round(progressoAtual * (TOTAL_QUADROS - 1)))
    })
    observadorResize.observe(secao)

    return () => {
      cancelado = true
      scrollTriggerInstancia?.kill()
      observadorResize.disconnect()
    }
  }, [containerRef])

  return <canvas ref={canvasRef} className={className ?? 'absolute inset-0 h-full w-full'} />
}
