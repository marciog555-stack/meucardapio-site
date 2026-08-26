import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'

// As 4 cores de segmento já usadas no resto do site (index.css @theme) —
// massa, marmita, churrasco/burger e açaí. O "prato" de cada uma é o
// mesmo objeto 3D, só muda a cor: a ideia visual é "mesma plataforma,
// qualquer tipo de comida".
const SEGMENTOS = [
  { cor: 0xe4402c, nome: 'Churrasco' },
  { cor: 0xe0a72e, nome: 'Massas' },
  { cor: 0x4a9b5e, nome: 'Marmitas' },
  { cor: 0x8b4fd1, nome: 'Açaí' },
]

/** "Momento de assinatura" nº2 da página: em vez de sequência de imagens
 * pré-renderizadas (a técnica clássica de "scroll scrubbing" tipo Apple),
 * é uma cena 3D real desenhada quadro a quadro conforme a posição do
 * scroll — mesmo efeito ("o scroll controla, não autoplay"), sem precisar
 * gerar/carregar 100+ imagens. Só redesenha a cena quando o scroll muda
 * (nada de requestAnimationFrame rodando à toa parado). */
export function VitrineMarca() {
  const secaoRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const secao = secaoRef.current
    const canvas = canvasRef.current
    if (!secao || !canvas) return

    const cena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.4, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    cena.add(new THREE.AmbientLight(0xf4ede1, 0.7))
    const luzChave = new THREE.DirectionalLight(0xffffff, 1.4)
    luzChave.position.set(4, 6, 6)
    cena.add(luzChave)
    const luzContorno = new THREE.DirectionalLight(0xe0a72e, 1)
    luzContorno.position.set(-5, -1, -4)
    cena.add(luzContorno)

    const grupo = new THREE.Group()
    // Empurra a composição pra cima, deixando o terço debaixo do quadro
    // livre pro título — que fica ancorado embaixo, fora da área 3D.
    grupo.position.y = 1.3
    cena.add(grupo)

    const pratos = SEGMENTOS.map(({ cor }) => {
      const geometria = new THREE.CylinderGeometry(1.7, 1.7, 0.16, 72)
      const material = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.32, metalness: 0.15 })
      const prato = new THREE.Mesh(geometria, material)
      prato.rotation.x = Math.PI / 2
      grupo.add(prato)
      return prato
    })

    function redimensionar() {
      const largura = secao!.clientWidth
      const altura = secao!.clientHeight
      renderer.setSize(largura, altura, false)
      const aspecto = largura / altura
      camera.aspect = aspecto
      // A composição se espalha mais na horizontal do que na vertical —
      // numa tela estreita (celular em pé) isso cortava as bordas. Afasta
      // a câmera proporcionalmente pra sempre caber, sem depender de FOV
      // horizontal (que o three.js não expõe direto).
      camera.position.z = aspecto < 1 ? 9 / Math.max(aspecto, 0.4) : 9
      camera.updateProjectionMatrix()
    }
    redimensionar()

    /** Desenha a cena pra uma posição de scroll (0 a 1) — determinístico,
     * sem depender de quadros anteriores. */
    function desenhar(progresso: number) {
      const p = progresso
      pratos.forEach((prato, i) => {
        const offset = i - (pratos.length - 1) / 2
        prato.position.x = offset * 2.5 * p
        prato.position.y = Math.sin(offset * 0.9) * 0.45 * p + 0.35 * p
        prato.position.z = -Math.abs(offset) * 0.6 * p
        prato.rotation.y = p * (0.9 + i * 0.35)
        prato.rotation.z = offset * 0.25 * p
      })
      grupo.rotation.y = p * 0.35
      grupo.rotation.x = p * 0.08
      renderer.render(cena, camera)
    }
    desenhar(0)

    const reduzido = reduzMovimento()
    let scrollTriggerInstancia: ScrollTrigger | undefined

    if (reduzido) {
      // Sem scroll-scrub: mostra direto o arranjo final, parado.
      desenhar(1)
    } else {
      scrollTriggerInstancia = ScrollTrigger.create({
        trigger: secao,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => desenhar(self.progress),
      })
    }

    const observadorResize = new ResizeObserver(() => {
      redimensionar()
      desenhar(scrollTriggerInstancia?.progress ?? (reduzido ? 1 : 0))
    })
    observadorResize.observe(secao)

    return () => {
      scrollTriggerInstancia?.kill()
      observadorResize.disconnect()
      pratos.forEach((prato) => {
        prato.geometry.dispose()
        ;(prato.material as THREE.Material).dispose()
      })
      renderer.dispose()
    }
  }, [])

  return (
    <section ref={secaoRef} className="relative h-svh overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="from-carvao via-carvao/10 to-carvao/10 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-16 text-center sm:px-10 sm:pb-24">
        <p className="text-creme/50 text-xs font-semibold tracking-[0.3em] uppercase">
          Uma plataforma pra qualquer cardápio
        </p>
        <h2
          className="font-display text-creme mx-auto mt-3 max-w-2xl uppercase"
          style={{ fontSize: 'clamp(1.75rem, 5.5vw, 3rem)', lineHeight: 1.02 }}
        >
          Massa, marmita, churrasco ou açaí —{' '}
          <span className="text-burger">o sistema é o mesmo.</span>
        </h2>
      </div>
    </section>
  )
}
