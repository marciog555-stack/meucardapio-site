import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'
import type { Cena } from './cenaMesa/motor'

interface Passo {
  titulo: string
  texto: string
  /** Trecho da rolagem (0 a 1) em que o passo aparece. */
  de: number
  ate: number
}

const PASSOS: Passo[] = [
  {
    titulo: 'O cliente abre o cardápio',
    texto: 'Pelo QR Code da mesa ou pelo link no WhatsApp, direto no navegador. Não precisa baixar nada.',
    de: 0,
    ate: 0.27,
  },
  {
    titulo: 'Toca em “Ver na sua mesa”',
    texto: 'O botão aparece em todo prato que tem 3D.',
    de: 0.27,
    ate: 0.52,
  },
  {
    titulo: 'A câmera encontra a mesa',
    texto: 'Funciona nos celulares com realidade aumentada: a maioria dos Android e iPhone atuais.',
    de: 0.52,
    ate: 0.75,
  },
  {
    titulo: 'E o prato aparece em tamanho real',
    texto: 'Antes de pedir, ele vê o tamanho da porção. Esse é o modelo 3D de verdade da Resenha Bar, nossa loja de demonstração.',
    de: 0.75,
    ate: 1.01,
  },
]

const TELAS_DE_ROLAGEM = 2.8
const ENTRADA = 0.045

function opacidadePasso(p: number, passo: Passo) {
  const entra = Math.min(1, (p - passo.de) / ENTRADA + (passo.de === 0 ? 1 : 0))
  const sai = passo.ate > 1 ? 1 : Math.min(1, (passo.ate - p) / ENTRADA)
  return Math.max(0, Math.min(entra, sai))
}

/** Lista simples dos passos — usada quando o 3D não roda ou quando o
 * sistema pede menos movimento. */
function ListaPassos() {
  return (
    <ol className="mt-8 flex flex-col gap-6">
      {PASSOS.map((p) => (
        <li key={p.titulo}>
          <h3 className="text-creme text-lg font-semibold">{p.titulo}</h3>
          <p className="text-creme/75 mt-1 max-w-md text-sm sm:text-base">{p.texto}</p>
        </li>
      ))}
    </ol>
  )
}

/**
 * "Do celular pra mesa": seção presa na tela enquanto a pessoa rola, com a
 * cena 3D (three.js) contando o caminho do cliente até o prato aparecer na
 * mesa. O three.js e o modelo só baixam quando a seção chega perto.
 */
export function CenaMesa3D() {
  const palcoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const passosRef = useRef<(HTMLLIElement | null)[]>([])
  const barraRef = useRef<HTMLDivElement>(null)
  const [perto, setPerto] = useState(false)
  const [modo, setModo] = useState<'animado' | 'estatico' | 'sem3d'>(() =>
    reduzMovimento() ? 'estatico' : 'animado',
  )

  useEffect(() => {
    const el = palcoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPerto(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!perto || modo === 'sem3d') return
    const palco = palcoRef.current
    const canvas = canvasRef.current
    if (!palco || !canvas) return

    let cena: Cena | undefined
    let gatilho: ScrollTrigger | undefined
    let visivel: IntersectionObserver | undefined
    let tamanho: ResizeObserver | undefined
    let cancelado = false

    function pintarPassos(p: number) {
      PASSOS.forEach((passo, i) => {
        const li = passosRef.current[i]
        if (!li) return
        const o = opacidadePasso(p, passo)
        li.style.opacity = String(o)
        li.style.transform = `translateY(${(1 - o) * (p < passo.de + ENTRADA ? 18 : -18)}px)`
        li.style.filter = o < 1 ? `blur(${(1 - o) * 6}px)` : 'none'
        li.setAttribute('aria-hidden', o < 0.5 ? 'true' : 'false')
      })
      if (barraRef.current) barraRef.current.style.transform = `scaleX(${p})`
    }

    import('./cenaMesa/motor')
      .then(({ criarCena }) => {
        if (cancelado) return
        const largo = () => window.innerWidth >= 1024
        try {
          cena = criarCena({
            canvas,
            telaCelular: '/img/demo-resenha.webp',
            modeloPrato: '/3d/frango-a-passarinho.glb',
            deslocamentoX: () => (largo() ? 0.19 : 0),
            aoFalhar: () => !cancelado && setModo('sem3d'),
          })
        } catch {
          setModo('sem3d')
          return
        }
        const c = cena
        const medir = () => c.redimensionar(palco.clientWidth, palco.clientHeight)
        medir()
        tamanho = new ResizeObserver(() => {
          medir()
          if (modo === 'estatico') c.fixar(1)
        })
        tamanho.observe(palco)

        if (modo === 'estatico') {
          c.fixar(1)
          return
        }

        gatilho = ScrollTrigger.create({
          trigger: palco,
          start: 'top top',
          end: () => `+=${window.innerHeight * TELAS_DE_ROLAGEM}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            c.definirProgresso(self.progress)
            pintarPassos(self.progress)
          },
        })
        pintarPassos(0)
        c.fixar(0)

        // Só gasta bateria desenhando enquanto a seção está na tela.
        visivel = new IntersectionObserver(([e]) => (e.isIntersecting ? c.iniciar() : c.parar()))
        visivel.observe(palco)
      })
      .catch(() => !cancelado && setModo('sem3d'))

    return () => {
      cancelado = true
      gatilho?.kill(true)
      visivel?.disconnect()
      tamanho?.disconnect()
      cena?.destruir()
    }
  }, [perto, modo])

  const titulo = (
    <h2 className="font-display text-creme text-4xl leading-[0.95] uppercase sm:text-5xl lg:text-6xl">
      Do celular direto <span className="text-macarrao">pra mesa</span>
    </h2>
  )

  if (modo !== 'animado') {
    return (
      <section id="ver-na-mesa" className="bg-carvao px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            {titulo}
            <ListaPassos />
          </div>
          {modo === 'estatico' && (
            <div ref={palcoRef} className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="ver-na-mesa" aria-label="Do celular direto pra mesa">
      <div ref={palcoRef} className="bg-carvao relative h-svh w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Escurece onde fica o texto, sem esconder a cena */}
        <div className="from-carvao via-carvao/70 pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t to-transparent lg:inset-y-0 lg:right-auto lg:left-0 lg:h-full lg:w-[48%] lg:bg-gradient-to-r" />
        <div className="from-carvao pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pt-20 pb-10 sm:px-10 lg:justify-center lg:px-20 lg:py-0">
          <div className="lg:max-w-md">{titulo}</div>

          <div className="lg:mt-12 lg:max-w-md">
            <ol className="relative min-h-48 sm:min-h-44">
              {PASSOS.map((p, i) => (
                <li
                  key={p.titulo}
                  ref={(el) => {
                    passosRef.current[i] = el
                  }}
                  className="absolute inset-x-0 top-0 will-change-[opacity,transform]"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="text-macarrao text-sm font-semibold tabular-nums">
                    {i + 1} de {PASSOS.length}
                  </p>
                  <h3 className="text-creme mt-1 text-2xl font-bold sm:text-3xl">{p.titulo}</h3>
                  <p className="text-creme/80 mt-2 max-w-md text-base">{p.texto}</p>
                </li>
              ))}
            </ol>
            <div className="bg-creme/15 mt-6 h-0.5 w-full max-w-xs overflow-hidden rounded-full">
              <div ref={barraRef} className="bg-macarrao h-full w-full origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
