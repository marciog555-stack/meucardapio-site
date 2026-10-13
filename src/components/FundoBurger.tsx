import { useEffect, useRef } from 'react'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'

const TOTAL_QUADROS = 96
const CAMINHO = (i: number) => `/hero-burger/frame-${String(i + 1).padStart(3, '0')}.webp`

// Cor de fundo da página (--color-carvao) — usada como base atrás do
// quadro, igual o fundo do vídeo original, e como "véu" escuro por cima
// pra garantir contraste com o texto em qualquer seção da página.
const COR_FUNDO = '#0a0908'

// Distância de rolagem (em alturas de tela) que o hambúrguer leva pra abrir
// totalmente. Depois disso ele fica parado no último quadro, servindo de
// fundo estático pro resto do site.
const ALTURAS_DE_TELA_PRA_ABRIR = 2.4

// Véu extra por cima do hambúrguer depois do Hero: o fundo fica forte no
// topo (onde só tem o título grande) e vai escurecendo até VEU_MAXIMO nas
// seções de texto, que ficavam difíceis de ler com o hambúrguer claro atrás.
const VEU_MAXIMO = 0.7
const VEU_COMECA_EM = 0.55 // em alturas de tela rolada
const VEU_COMPLETO_EM = 1.25

/** Fundo da página inteira: o vídeo real do hambúrguer se abrindo (mandado
 * pelo Márcio), tocado quadro a quadro conforme o scroll — preenchendo a
 * tela toda (sem sobrar preto nas bordas) e acompanhando a rolagem por
 * várias seções, não só o Hero. Fica atrás de tudo (`position: fixed`,
 * z-index negativo) e não precisa de "pin": a página rola livre por cima. */
export function FundoBurger() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const veuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let quadro = 0
    function atualizarVeu() {
      quadro = 0
      const telas = window.scrollY / window.innerHeight
      const t = Math.min(1, Math.max(0, (telas - VEU_COMECA_EM) / (VEU_COMPLETO_EM - VEU_COMECA_EM)))
      if (veuRef.current) veuRef.current.style.opacity = String(t * VEU_MAXIMO)
    }
    function aoRolar() {
      if (!quadro) quadro = requestAnimationFrame(atualizarVeu)
    }
    atualizarVeu()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const contexto = canvas.getContext('2d')
    if (!contexto) return

    let cancelado = false
    const quadros: HTMLImageElement[] = []
    for (let i = 0; i < TOTAL_QUADROS; i++) {
      const img = new Image()
      img.src = CAMINHO(i)
      quadros.push(img)
    }

    function redimensionar() {
      const proporcao = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = window.innerWidth * proporcao
      canvas!.height = window.innerHeight * proporcao
      canvas!.style.width = `${window.innerWidth}px`
      canvas!.style.height = `${window.innerHeight}px`
      contexto!.setTransform(proporcao, 0, 0, proporcao, 0, 0)
    }
    redimensionar()

    /** Desenha um quadro específico cobrindo a tela toda (cortando o
     * excesso), como um background-size:cover — sem barras pretas nas
     * laterais/topo, diferente do encaixe usado antes só no Hero. */
    function desenharQuadro(indice: number) {
      const img = quadros[Math.max(0, Math.min(TOTAL_QUADROS - 1, indice))]
      const largura = window.innerWidth
      const altura = window.innerHeight
      contexto!.fillStyle = COR_FUNDO
      contexto!.fillRect(0, 0, largura, altura)
      if (!img.complete || img.naturalWidth === 0) return
      const escala = Math.max(largura / img.naturalWidth, altura / img.naturalHeight)
      const larguraDesenho = img.naturalWidth * escala
      const alturaDesenho = img.naturalHeight * escala
      contexto!.drawImage(
        img,
        (largura - larguraDesenho) / 2,
        (altura - alturaDesenho) / 2,
        larguraDesenho,
        alturaDesenho,
      )
      // Véu escuro constante por cima do quadro, pra qualquer texto de
      // qualquer seção continuar legível em cima desse fundo.
      contexto!.fillStyle = 'rgba(10, 9, 8, 0.55)'
      contexto!.fillRect(0, 0, largura, altura)
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
        trigger: document.body,
        start: 'top top',
        end: () => `+=${window.innerHeight * ALTURAS_DE_TELA_PRA_ABRIR}`,
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
      scrollTriggerInstancia?.refresh()
    })
    observadorResize.observe(document.body)

    return () => {
      cancelado = true
      scrollTriggerInstancia?.kill()
      observadorResize.disconnect()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-screen w-screen" aria-hidden="true" />
      <div
        ref={veuRef}
        className="bg-carvao pointer-events-none fixed inset-0 -z-10 h-screen w-screen opacity-0"
        aria-hidden="true"
      />
    </>
  )
}
