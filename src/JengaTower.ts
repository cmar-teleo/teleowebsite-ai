// A realistic 3D Jenga tower (Three.js) whose middle block carves out on demand.
// Transparent canvas + shadow-catcher so it floats over the page; scroll drives
// the carve via setCarve(0..1). No physics — the tower is static.
import * as THREE from 'three'

const L = 3, W = 1, H = 0.6
const LAYERS = 18
const GAP = 0.015
const CARVE_LAYER = 8 // an even layer: its blocks run along X, so the middle one slides out along X
const TOWER_H = LAYERS * H
const OUT = 5.5

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** procedural wood grain, so there are no external texture files */
function makeWoodTexture(seed = 0) {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const tones = ['#caa06a', '#c49a62', '#bd925a', '#d2a972']
  ctx.fillStyle = tones[seed % tones.length]
  ctx.fillRect(0, 0, s, s)
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * s
    ctx.strokeStyle = `rgba(${90 + Math.random() * 40}, ${60 + Math.random() * 30}, ${30 + Math.random() * 20}, ${0.05 + Math.random() * 0.12})`
    ctx.lineWidth = 0.5 + Math.random() * 1.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(s * 0.33, y + (Math.random() - 0.5) * 6, s * 0.66, y + (Math.random() - 0.5) * 6, s, y + (Math.random() - 0.5) * 4)
    ctx.stroke()
  }
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(60,40,20,${Math.random() * 0.06})`
    ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class JengaTower {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private carveBlock!: THREE.Mesh
  private carveAxis: 'x' | 'z' = 'x'
  private home = { x: 0, y: 0, z: 0 }
  private homeRotY = 0
  private woods: THREE.Texture[]
  private spin = 0
  idle = true // slow camera drift; turn off for reduced motion

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.18
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200)
    this.camera.position.set(9.5, 8.5, 13)
    this.camera.lookAt(0, TOWER_H * 0.46, 0)

    // lighting
    this.scene.add(new THREE.HemisphereLight('#a7c8e0', '#1a1510', 0.55))
    const key = new THREE.DirectionalLight('#fff3e0', 2.5)
    key.position.set(9, 18, 8)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 60
    Object.assign(key.shadow.camera, { left: -14, right: 14, top: 22, bottom: -4 })
    key.shadow.bias = -0.0004
    key.shadow.radius = 4
    this.scene.add(key)
    const rim = new THREE.DirectionalLight('#9fc0ff', 0.5)
    rim.position.set(-10, 6, -8)
    this.scene.add(rim)

    // shadow catcher (transparent) so the tower casts a soft shadow onto the page
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.ShadowMaterial({ opacity: 0.34 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    this.woods = Array.from({ length: 4 }, (_, i) => makeWoodTexture(i))
    this.buildTower()

    this.renderer.setAnimationLoop(() => this.render())
  }

  private buildTower() {
    const geo = new THREE.BoxGeometry(L - GAP, H - GAP, W - GAP)
    const tower = new THREE.Group()
    for (let layer = 0; layer < LAYERS; layer++) {
      const y = H / 2 + layer * H
      const alongX = layer % 2 === 0
      for (let b = -1; b <= 1; b++) {
        const mat = new THREE.MeshStandardMaterial({ map: this.woods[(layer * 3 + b + 1) % this.woods.length], roughness: 0.72, metalness: 0.02 })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (alongX) mesh.position.set(0, y, b * W)
        else {
          mesh.rotation.y = Math.PI / 2
          mesh.position.set(b * W, y, 0)
        }
        tower.add(mesh)
        if (layer === CARVE_LAYER && b === 0) {
          this.carveBlock = mesh
          this.carveAxis = alongX ? 'x' : 'z'
        }
      }
    }
    this.scene.add(tower)
    this.home = { x: this.carveBlock.position.x, y: this.carveBlock.position.y, z: this.carveBlock.position.z }
    this.homeRotY = this.carveBlock.rotation.y
  }

  /** t: 0 = block seated in the tower, 1 = fully carved out */
  setCarve(t: number) {
    t = clamp01(t)
    const lift = smooth(0, 0.2, t) * 0.22
    const slide = smooth(0.08, 1, t) * OUT
    const rot = smooth(0.08, 1, t) * 0.06
    this.carveBlock.position[this.carveAxis] = this.home[this.carveAxis] + slide
    this.carveBlock.position.y = this.home.y + lift
    this.carveBlock.rotation.y = this.homeRotY + rot
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / Math.max(1, h)
    this.camera.updateProjectionMatrix()
  }

  private render() {
    if (this.idle) {
      // a very slow idle drift so it feels alive without full orbit controls
      this.spin += 0.0012
      const r = 16.3
      this.camera.position.x = Math.sin(this.spin) * r
      this.camera.position.z = Math.cos(this.spin) * r
      this.camera.position.y = 8.5
      this.camera.lookAt(0, TOWER_H * 0.46, 0)
    }
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.renderer.dispose()
  }
}
