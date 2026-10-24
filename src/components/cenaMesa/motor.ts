import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/**
 * Cena 3D da seção "Do celular pra mesa": o cardápio real da loja demo
 * Resenha Bar num celular, o toque em "Ver na sua mesa" e o frango a
 * passarinho (o mesmo .glb do <model-viewer> logo abaixo, em escala real:
 * o prato tem 27 cm) pousando na mesa. Tudo é dirigido por um único número,
 * o progresso da rolagem (0 a 1). Este arquivo só é baixado quando a seção
 * chega perto da tela.
 */

const COR_FUNDO = 0x0a0908
const COR_MARCA = 0xe0a72e

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const faixa = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
const suave = (t: number) => t * t * (3 - 2 * t)
const saidaExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))
const saidaVolta = (t: number) => {
  const c = 1.4
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
}
const misturar = (a: THREE.Vector3, b: THREE.Vector3, t: number, alvo: THREE.Vector3) => alvo.copy(a).lerp(b, t)

/** Veio de madeira desenhado num canvas — sem baixar imagem nenhuma. */
function texturaMadeira() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1024
  const g = c.getContext('2d')!
  g.fillStyle = '#2b1b11'
  g.fillRect(0, 0, 1024, 1024)
  let semente = 7
  const aleatorio = () => {
    semente = (semente * 16807) % 2147483647
    return semente / 2147483647
  }
  // Tábuas
  for (let t = 0; t < 4; t++) {
    const y0 = t * 256
    g.fillStyle = `rgba(${52 + aleatorio() * 18}, ${33 + aleatorio() * 10}, ${20 + aleatorio() * 6}, 0.6)`
    g.fillRect(0, y0, 1024, 256)
    for (let i = 0; i < 46; i++) {
      const y = y0 + aleatorio() * 256
      const onda = 3 + aleatorio() * 9
      const freq = 0.002 + aleatorio() * 0.006
      g.strokeStyle = aleatorio() > 0.45 ? `rgba(14, 8, 3, ${0.05 + aleatorio() * 0.1})` : `rgba(120, 82, 48, ${0.03 + aleatorio() * 0.06})`
      g.lineWidth = 1 + aleatorio() * 3
      g.beginPath()
      for (let x = 0; x <= 1024; x += 16) {
        const yy = y + Math.sin(x * freq + i) * onda
        if (x === 0) g.moveTo(x, yy)
        else g.lineTo(x, yy)
      }
      g.stroke()
    }
    g.fillStyle = 'rgba(8, 4, 2, 0.75)'
    g.fillRect(0, y0, 1024, 3)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1.6, 1.6)
  tex.anisotropy = 8
  return tex
}

/** Botão "Ver na sua mesa" desenhado igual ao do cardápio de verdade. */
function texturaBotao() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = '#e0a72e'
  g.beginPath()
  g.roundRect(4, 4, 504, 120, 60)
  g.fill()
  g.fillStyle = '#0a0908'
  g.font = '700 46px Manrope, system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('Ver na sua mesa', 256, 68)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export interface OpcoesCena {
  canvas: HTMLCanvasElement
  telaCelular: string
  modeloPrato: string
  /** Desloca o enquadramento pra direita, deixando espaço pro texto. */
  deslocamentoX: () => number
  /** Celular / aparelho fraco: sem sombra calculada e menos pixels. */
  leve: boolean
  aoCarregar?: () => void
  aoFalhar?: () => void
}

export function criarCena(op: OpcoesCena) {
  const renderer = new THREE.WebGLRenderer({ canvas: op.canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(COR_FUNDO, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  // No modo leve, a sombra do prato vem só da "sombra de contato" (um
  // círculo esfumado), que custa quase nada.
  renderer.shadowMap.enabled = !op.leve
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const cena = new THREE.Scene()
  cena.fog = new THREE.Fog(COR_FUNDO, 0.9, 2.4)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  cena.environment = ambiente
  cena.environmentIntensity = 0.35

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 10)

  // ── Luz: um foco quente de cima (a luz do bar) e um contorno laranja atrás
  const foco = new THREE.SpotLight(0xffe2bd, 7, 3, Math.PI / 5.5, 0.7, 1.2)
  foco.position.set(0.25, 1.1, 0.45)
  foco.target.position.set(0, 0, 0)
  foco.castShadow = true
  foco.shadow.mapSize.set(1024, 1024)
  foco.shadow.bias = -0.0004
  foco.shadow.radius = 6
  cena.add(foco, foco.target)
  const contorno = new THREE.PointLight(0xff7a2a, 1.6, 1.6, 1.5)
  contorno.position.set(-0.35, 0.3, -0.45)
  cena.add(contorno)
  cena.add(new THREE.HemisphereLight(0xffe6c7, 0x1a0f08, 0.35))

  // ── Mesa
  const mesa = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({ map: texturaMadeira(), roughness: 0.62, metalness: 0 }),
  )
  mesa.rotation.x = -Math.PI / 2
  mesa.receiveShadow = true
  cena.add(mesa)

  // ── Celular
  const celular = new THREE.Group()
  const corpo = new THREE.Mesh(
    new RoundedBoxGeometry(0.077, 0.146, 0.008, 6, 0.011),
    new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.28, metalness: 0.75 }),
  )
  corpo.castShadow = true
  celular.add(corpo)

  const LARG_TELA = 0.071
  const ALT_TELA = 0.139
  const texTela = new THREE.TextureLoader().load(op.telaCelular, (t) => {
    // "cover": corta as laterais da captura pra caber na proporção da tela
    const img = t.image as HTMLImageElement
    const prop = LARG_TELA / ALT_TELA / (img.width / img.height)
    t.repeat.set(prop, 1)
    t.offset.set((1 - prop) / 2, 0)
  })
  texTela.colorSpace = THREE.SRGBColorSpace
  texTela.anisotropy = 8
  const tela = new THREE.Mesh(
    new THREE.PlaneGeometry(LARG_TELA, ALT_TELA),
    new THREE.MeshBasicMaterial({ map: texTela, toneMapped: false }),
  )
  tela.position.z = 0.00405
  celular.add(tela)

  const vidro = new THREE.Mesh(
    new THREE.PlaneGeometry(LARG_TELA, ALT_TELA),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0.05, metalness: 0, clearcoat: 1 }),
  )
  vidro.position.z = 0.0042
  celular.add(vidro)

  const camerinha = new THREE.Mesh(
    new THREE.CircleGeometry(0.0022, 24),
    new THREE.MeshBasicMaterial({ color: 0x050505 }),
  )
  camerinha.position.set(0, ALT_TELA / 2 - 0.006, 0.0043)
  celular.add(camerinha)

  const botao = new THREE.Mesh(
    new THREE.PlaneGeometry(0.05, 0.0125),
    new THREE.MeshBasicMaterial({ map: texturaBotao(), transparent: true, toneMapped: false }),
  )
  botao.position.set(0, -0.046, 0.0045)
  celular.add(botao)

  // Anel de "toque" que sai do botão
  const toque = new THREE.Mesh(
    new THREE.RingGeometry(0.004, 0.0052, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false }),
  )
  toque.position.set(0.012, -0.046, 0.0047)
  celular.add(toque)
  cena.add(celular)

  // ── Mira da realidade aumentada (onde o prato vai pousar)
  const mira = new THREE.Group()
  const anel = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.156, 96),
    new THREE.MeshBasicMaterial({ color: COR_MARCA, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
  )
  const anelInterno = new THREE.Mesh(
    new THREE.RingGeometry(0.004, 0.009, 32),
    new THREE.MeshBasicMaterial({ color: COR_MARCA, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
  )
  const pontos: THREE.Mesh[] = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const p = new THREE.Mesh(
      new THREE.CircleGeometry(0.0026, 12),
      new THREE.MeshBasicMaterial({ color: COR_MARCA, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
    )
    p.position.set(Math.cos(a) * 0.11, Math.sin(a) * 0.11, 0)
    pontos.push(p)
    mira.add(p)
  }
  mira.add(anel, anelInterno)
  mira.rotation.x = -Math.PI / 2
  mira.position.y = 0.0015
  cena.add(mira)

  // ── Prato (carregado à parte; a cena funciona mesmo antes de chegar)
  const prato = new THREE.Group()
  prato.visible = false
  cena.add(prato)
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
    op.modeloPrato,
    (gltf) => {
      gltf.scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.castShadow = true
          m.receiveShadow = true
        }
      })
      prato.add(gltf.scene)
      op.aoCarregar?.()
    },
    undefined,
    () => op.aoFalhar?.(),
  )

  // Sombra de contato macia embaixo do prato (fica bonita até em celular fraco)
  const sombra = new THREE.Mesh(
    new THREE.CircleGeometry(0.17, 48),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      alphaMap: (() => {
        const c = document.createElement('canvas')
        c.width = c.height = 128
        const g = c.getContext('2d')!
        const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
        gr.addColorStop(0, '#fff')
        gr.addColorStop(1, '#000')
        g.fillStyle = gr
        g.fillRect(0, 0, 128, 128)
        return new THREE.CanvasTexture(c)
      })(),
    }),
  )
  sombra.rotation.x = -Math.PI / 2
  sombra.position.y = 0.001
  cena.add(sombra)

  // ── Quadros-chave da câmera e do celular
  const CAM_PERTO = new THREE.Vector3(0, 0.125, 0.34)
  const OLHA_PERTO = new THREE.Vector3(0, 0.118, 0)
  const CAM_MESA = new THREE.Vector3(0.05, 0.36, 0.56)
  const OLHA_MESA = new THREE.Vector3(-0.04, 0.03, 0)
  const CEL_PERTO = new THREE.Vector3(0, 0.118, 0)
  // No fim, o celular fica deitado na mesa, ao lado do prato
  const CEL_MESA = new THREE.Vector3(0.1, 0.0045, -0.27)

  const posCam = new THREE.Vector3()
  const olhar = new THREE.Vector3()
  const posCel = new THREE.Vector3()

  let alvo = 0
  let atual = 0
  let largura = 1
  let altura = 1
  let relogio = 0
  let ultimo = performance.now()

  function aplicar(p: number, tempo: number) {
    // 0 → 0,5: celular na mão, cardápio na tela, toque no botão
    // 0,5 → 0,74: câmera abre pra mesa, celular vira "câmera" do cliente
    // 0,74 → 1: o prato pousa na mira e fica girando devagar
    const abre = suave(faixa(p, 0.5, 0.74))
    const retrato = largura / altura < 0.9
    const afasta = retrato ? 1 + (0.9 - largura / altura) * (0.95 + 0.45 * abre) : 1

    misturar(CAM_PERTO, CAM_MESA, abre, posCam)
    posCam.z *= afasta
    posCam.y *= 1 + (afasta - 1) * 0.5
    misturar(OLHA_PERTO, OLHA_MESA, abre, olhar)
    // Em pé (celular), o prato fica no centro da tela, sem o texto do lado
    if (retrato) {
      posCam.x += 0.02 * abre
      olhar.x += 0.035 * abre
      olhar.z -= 0.03 * abre
    }
    camera.position.copy(posCam)
    camera.lookAt(olhar)

    misturar(CEL_PERTO, CEL_MESA, abre, posCel)
    // Arco: sobe um pouco no meio do caminho em vez de atravessar a mesa
    posCel.y += Math.sin(abre * Math.PI) * 0.06
    celular.position.copy(posCel)
    const balanco = Math.sin(tempo * 0.9) * 0.035 * (1 - abre)
    celular.rotation.set(-0.06 - abre * (Math.PI / 2 - 0.06), balanco, abre * 0.4)

    // Toque no botão
    const t = faixa(p, 0.3, 0.46)
    const apertando = Math.sin(Math.min(1, faixa(p, 0.3, 0.38)) * Math.PI)
    botao.scale.setScalar(1 - apertando * 0.08)
    toque.scale.setScalar(1 + t * 3.2)
    ;(toque.material as THREE.MeshBasicMaterial).opacity = t > 0 && t < 1 ? (1 - t) * 0.9 : 0

    // Mira
    const miraVisivel = faixa(p, 0.6, 0.7) * (1 - faixa(p, 0.84, 0.94))
    const pulso = 1 + Math.sin(tempo * 4) * 0.025
    mira.scale.setScalar((0.8 + 0.2 * saidaExpo(faixa(p, 0.6, 0.72))) * pulso)
    mira.rotation.z = tempo * 0.35
    ;(anel.material as THREE.MeshBasicMaterial).opacity = miraVisivel * 0.85
    ;(anelInterno.material as THREE.MeshBasicMaterial).opacity = miraVisivel
    pontos.forEach((pt, i) => {
      const onda = 0.5 + 0.5 * Math.sin(tempo * 3 - i * 0.5)
      ;(pt.material as THREE.MeshBasicMaterial).opacity = miraVisivel * (0.25 + 0.75 * onda)
    })

    // Prato
    const pousa = faixa(p, 0.74, 0.9)
    prato.visible = pousa > 0
    const queda = saidaVolta(pousa)
    prato.position.set(0, (1 - saidaExpo(pousa)) * 0.22, 0)
    prato.scale.setScalar(Math.max(0.001, 0.35 + 0.65 * queda))
    prato.rotation.y = -1.4 * (1 - saidaExpo(pousa)) + tempo * 0.22 * pousa
    ;(sombra.material as THREE.MeshBasicMaterial).opacity = saidaExpo(pousa) * 0.55
  }

  function redimensionar(l: number, a: number) {
    largura = Math.max(1, l)
    altura = Math.max(1, a)
    const retrato = largura / altura < 0.9
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, op.leve ? 1.25 : 1.75))
    renderer.setSize(largura, altura, false)
    camera.aspect = largura / altura
    camera.fov = retrato ? 42 : 34
    const dx = op.deslocamentoX()
    if (dx) camera.setViewOffset(largura, altura, -dx * largura, 0, largura, altura)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }

  function quadro() {
    const agora = performance.now()
    const dt = Math.min(0.05, (agora - ultimo) / 1000)
    ultimo = agora
    relogio += dt
    atual += (alvo - atual) * (1 - Math.exp(-dt * 10))
    aplicar(atual, relogio)
    renderer.render(cena, camera)
  }

  return {
    definirProgresso(p: number) {
      alvo = clamp01(p)
    },
    /** Pula direto pra um ponto (sem a suavização) e desenha uma vez. */
    fixar(p: number) {
      alvo = atual = clamp01(p)
      aplicar(atual, relogio)
      renderer.render(cena, camera)
    },
    iniciar() {
      ultimo = performance.now()
      renderer.setAnimationLoop(quadro)
    },
    parar() {
      renderer.setAnimationLoop(null)
    },
    redimensionar,
    destruir() {
      renderer.setAnimationLoop(null)
      cena.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((mat) => {
            Object.values(mat).forEach((v) => {
              if (v instanceof THREE.Texture) v.dispose()
            })
            mat.dispose()
          })
        }
      })
      ambiente.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}

export type Cena = ReturnType<typeof criarCena>
