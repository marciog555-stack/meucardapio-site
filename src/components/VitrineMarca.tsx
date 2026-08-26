import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'

// Mesmas cores do hambúrguer de mentirinha que já aparece ao lado do nome
// no site do cliente (tokens.css) — pão, alface, tomate, queijo e carne,
// de baixo pra cima.
const CAMADAS = [
  { nome: 'Pão de baixo', cor: 0xd99a52, raioTopo: 1.55, raioBase: 1.72, altura: 0.34 },
  { nome: 'Alface', cor: 0x7ab648, raioTopo: 1.82, raioBase: 1.82, altura: 0.09 },
  { nome: 'Tomate', cor: 0xe05f47, raioTopo: 1.4, raioBase: 1.4, altura: 0.14 },
  { nome: 'Queijo', cor: 0xf0b429, raioTopo: 1.7, raioBase: 1.7, altura: 0.07 },
  { nome: 'Carne', cor: 0x6b4226, raioTopo: 1.52, raioBase: 1.52, altura: 0.26 },
  { nome: 'Pão de cima', cor: 0xe8a765, raioTopo: 1.2, raioBase: 1.72, altura: 0.78 },
]

const ESPALHAMENTO = 0.62

/** "Momento de assinatura" nº2 da página: em vez de sequência de imagens
 * pré-renderizadas (a técnica clássica de "scroll scrubbing" tipo Apple),
 * é uma cena 3D real desenhada quadro a quadro conforme a posição do
 * scroll — mesmo efeito ("o scroll controla, não autoplay"), sem precisar
 * gerar/carregar 100+ imagens. Um hambúrguer fechado se abre em camadas
 * conforme rola. Só redesenha a cena quando o scroll muda (nada de
 * requestAnimationFrame rodando à toa parado). */
export function VitrineMarca() {
  const secaoRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const secao = secaoRef.current
    const canvas = canvasRef.current
    if (!secao || !canvas) return

    const cena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.3, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    cena.add(new THREE.AmbientLight(0xf4ede1, 0.75))
    const luzChave = new THREE.DirectionalLight(0xfff4de, 1.5)
    luzChave.position.set(4, 6, 6)
    cena.add(luzChave)
    const luzContorno = new THREE.DirectionalLight(0xe0a72e, 0.9)
    luzContorno.position.set(-5, -1, -4)
    cena.add(luzContorno)

    const grupo = new THREE.Group()
    // Empurra a composição pra cima, deixando o terço debaixo do quadro
    // livre pro título — que fica ancorado embaixo, fora da área 3D.
    grupo.position.y = 0.9
    cena.add(grupo)

    // Posição fechada (empilhado, tocando) de cada camada — centralizada
    // em y=0 pelo total da altura do hambúrguer fechado.
    let acumulado = 0
    const yFechado = CAMADAS.map((c) => {
      const y = acumulado + c.altura / 2
      acumulado += c.altura
      return y
    })
    const alturaTotal = acumulado
    const centralizacao = alturaTotal / 2

    const camadas = CAMADAS.map(({ cor, raioTopo, raioBase, altura }) => {
      const geometria = new THREE.CylinderGeometry(raioTopo, raioBase, altura, 56)
      const material = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.5, metalness: 0.05 })
      const camada = new THREE.Mesh(geometria, material)
      grupo.add(camada)
      return camada
    })

    let distanciaBase = 9

    function redimensionar() {
      const largura = secao!.clientWidth
      const altura = secao!.clientHeight
      renderer.setSize(largura, altura, false)
      const aspecto = largura / altura
      camera.aspect = aspecto
      // Numa tela estreita (celular em pé) o hambúrguer aberto (bem mais
      // alto que largo) cortava em cima/embaixo. Afasta a câmera
      // proporcionalmente pra sempre caber.
      distanciaBase = aspecto < 1 ? 9 / Math.max(aspecto, 0.45) : 9
      camera.updateProjectionMatrix()
    }
    redimensionar()

    /** Desenha a cena pra uma posição de scroll (0 a 1) — determinístico,
     * sem depender de quadros anteriores. */
    function desenhar(progresso: number) {
      const p = progresso
      camadas.forEach((camada, i) => {
        camada.position.y = yFechado[i] - centralizacao + i * ESPALHAMENTO * p
        camada.position.x = Math.sin(i * 2.1) * 0.22 * p
        camada.position.z = Math.cos(i * 1.7) * 0.18 * p
        camada.rotation.y = p * (0.5 + i * 0.22)
      })
      grupo.rotation.y = -0.55 + p * 0.85
      // O hambúrguer fica bem mais alto quando abre — afasta a câmera
      // conforme o scroll avança pra tudo continuar cabendo no quadro.
      camera.position.z = distanciaBase * (1 + p * 1.1)
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
      camadas.forEach((camada) => {
        camada.geometry.dispose()
        ;(camada.material as THREE.Material).dispose()
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
