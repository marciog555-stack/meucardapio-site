import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { ScrollTrigger, reduzMovimento } from '../lib/gsap'

// Mesmas cores do hambúrguer de mentirinha que já aparece ao lado do nome
// no site do cliente (tokens.css) — pão, alface, tomate, queijo e carne,
// de baixo pra cima. `clearcoat` simula a camada de "verniz" molhado/
// derretido (queijo, tomate) que aparece nas referências que o Márcio
// mandou — sem isso as camadas ficavam foscas demais, tipo plástico fosco.
const CAMADAS = [
  { nome: 'Pão de baixo', cor: 0xd99a52, raioTopo: 1.55, raioBase: 1.72, altura: 0.34, rugosidade: 0.55, clearcoat: 0.12 },
  { nome: 'Alface', cor: 0x7ab648, raioTopo: 1.82, raioBase: 1.82, altura: 0.09, rugosidade: 0.4, clearcoat: 0.35 },
  { nome: 'Tomate', cor: 0xe05f47, raioTopo: 1.4, raioBase: 1.4, altura: 0.14, rugosidade: 0.28, clearcoat: 0.7 },
  { nome: 'Queijo', cor: 0xf0b429, raioTopo: 1.7, raioBase: 1.7, altura: 0.07, rugosidade: 0.2, clearcoat: 0.95 },
  { nome: 'Carne', cor: 0x6b4226, raioTopo: 1.52, raioBase: 1.52, altura: 0.26, rugosidade: 0.6, clearcoat: 0.25 },
  { nome: 'Pão de cima', cor: 0xe8a765, raioTopo: 1.2, raioBase: 1.72, altura: 0.78, rugosidade: 0.5, clearcoat: 0.18 },
]

const ESPALHAMENTO = 0.62
const INDICE_PAO_CIMA = CAMADAS.length - 1

/** Cena 3D do "momento de assinatura" da página — desenhada quadro a
 * quadro conforme a posição do scroll, no lugar da sequência de imagens
 * pré-renderizadas (técnica clássica de "scroll scrubbing" tipo Apple).
 * Vive dentro do Hero, ocupando o lugar da foto estática de fundo. Recebe
 * a seção do Hero por fora (`containerRef`) pra usar como gatilho/tamanho
 * do ScrollTrigger. */
export function BurgerCena({
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

    const cena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.3, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Fundo escuro + luz dramática de três pontos, tipo estúdio de
    // fotografia de comida — luz quente forte de um lado, contorno fria
    // do outro, e um brilho pontual atrás pra separar o hambúrguer do
    // fundo preto (igual às referências).
    cena.add(new THREE.AmbientLight(0xfff1dd, 0.35))
    const luzChave = new THREE.DirectionalLight(0xffe8c2, 2.4)
    luzChave.position.set(4, 6, 6)
    cena.add(luzChave)
    const luzContorno = new THREE.DirectionalLight(0xe0a72e, 1.1)
    luzContorno.position.set(-5, -1, -4)
    cena.add(luzContorno)
    const luzGlow = new THREE.PointLight(0xff8a3d, 6, 14, 2)
    luzGlow.position.set(0, 1.4, -3.5)
    cena.add(luzGlow)

    const grupo = new THREE.Group()
    grupo.position.y = 0.4
    cena.add(grupo)

    let acumulado = 0
    const yFechado = CAMADAS.map((c) => {
      const y = acumulado + c.altura / 2
      acumulado += c.altura
      return y
    })
    const alturaTotal = acumulado
    const centralizacao = alturaTotal / 2

    const camadas = CAMADAS.map(({ cor, raioTopo, raioBase, altura, rugosidade, clearcoat }) => {
      const geometria = new THREE.CylinderGeometry(raioTopo, raioBase, altura, 64)
      const material = new THREE.MeshPhysicalMaterial({
        color: cor,
        roughness: rugosidade,
        metalness: 0.04,
        clearcoat,
        clearcoatRoughness: 0.15,
      })
      const camada = new THREE.Mesh(geometria, material)
      grupo.add(camada)
      return camada
    })

    // Gergelim no pão de cima — instanciado como filho da camada, então
    // já herda a posição/rotação que ela ganha ao explodir, sem precisar
    // de lógica extra por quadro.
    const paoCima = camadas[INDICE_PAO_CIMA]
    const { raioTopo: raioPaoCima, altura: alturaPaoCima } = CAMADAS[INDICE_PAO_CIMA]
    const NUM_SEMENTES = 46
    const geometriaSemente = new THREE.SphereGeometry(0.035, 8, 6)
    geometriaSemente.scale(1, 0.55, 1.8)
    const materialSemente = new THREE.MeshStandardMaterial({ color: 0xf6e9c9, roughness: 0.6 })
    const sementes = new THREE.InstancedMesh(geometriaSemente, materialSemente, NUM_SEMENTES)
    const auxiliar = new THREE.Object3D()
    for (let i = 0; i < NUM_SEMENTES; i++) {
      const raio = Math.sqrt(Math.random()) * raioPaoCima * 0.82
      const angulo = Math.random() * Math.PI * 2
      auxiliar.position.set(Math.cos(angulo) * raio, alturaPaoCima / 2 + 0.02, Math.sin(angulo) * raio)
      auxiliar.rotation.set(Math.random() * 0.4 - 0.2, Math.random() * Math.PI * 2, Math.random() * 0.4 - 0.2)
      auxiliar.updateMatrix()
      sementes.setMatrixAt(i, auxiliar.matrix)
    }
    sementes.instanceMatrix.needsUpdate = true
    paoCima.add(sementes)

    // Sombra de contato — um disco escuro e suave embaixo do hambúrguer,
    // pra ele não parecer flutuando solto no fundo preto.
    const sombraGeometria = new THREE.CircleGeometry(2.1, 48)
    const sombraMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })
    const sombra = new THREE.Mesh(sombraGeometria, sombraMaterial)
    sombra.rotation.x = -Math.PI / 2
    sombra.position.y = -centralizacao + grupo.position.y - 0.05
    cena.add(sombra)

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
      sombra.scale.setScalar(1 + p * 0.35)
      ;(sombraMaterial as THREE.MeshBasicMaterial).opacity = 0.45 - p * 0.22
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
        end: '+=120%',
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
      geometriaSemente.dispose()
      materialSemente.dispose()
      sombraGeometria.dispose()
      sombraMaterial.dispose()
      renderer.dispose()
    }
  }, [containerRef])

  return <canvas ref={canvasRef} className={className ?? 'absolute inset-0 h-full w-full'} />
}
