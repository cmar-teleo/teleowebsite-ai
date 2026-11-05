// Modular layered structure (Three.js) representing a carve-out.
// One clean module extracts from the larger system on scroll.
// Transparent canvas + shadow-catcher; scroll drives the extraction via setCarve(0..1).
// No physics — the remaining structure stays fully static.
import * as THREE from 'three'

const MODULE_W = 1.15
const MODULE_D = 1.15
const MODULE_H = 0.42
const GAP = 0.045
const LAYERS = 11
const MODULES_PER_LAYER = 5
const CARVE_LAYER = 5
const CARVE_INDEX = 2 // middle module of the carve layer
const STRUCTURE_H = LAYERS * (MODULE_H + GAP) - GAP
const OUT = 4.8

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export class JengaTower {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private carveModule!: THREE.Mesh
  private home = { x: 0, y: 0, z: 0 }
  private spin = 0
  idle = true

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)
    this.camera.position.set(8.2, 6.4, 11.5)
    this.camera.lookAt(0, STRUCTURE_H * 0.42, 0)

    // Lighting — cooler, more architectural
    this.scene.add(new THREE.HemisphereLight('#c5d4e8', '#1a1c20', 0.6))
    const key = new THREE.DirectionalLight('#f4efe6', 2.2)
    key.position.set(7, 14, 6)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 50
    Object.assign(key.shadow.camera, { left: -12, right: 12, top: 16, bottom: -3 })
    key.shadow.bias = -0.0003
    key.shadow.radius = 3
    this.scene.add(key)
    const rim = new THREE.DirectionalLight('#9eb8d8', 0.45)
    rim.position.set(-8, 5, -6)
    this.scene.add(rim)

    // Shadow catcher
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.ShadowMaterial({ opacity: 0.28 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    this.buildStructure()
    this.renderer.setAnimationLoop(() => this.render())
  }

  private buildStructure() {
    const geo = new THREE.BoxGeometry(MODULE_W, MODULE_H, MODULE_D)
    const group = new THREE.Group()

    // Base material for the larger system
    const baseMat = new THREE.MeshStandardMaterial({
      color: '#2a333c',
      roughness: 0.65,
      metalness: 0.08,
    })

    // Accent material for the module being carved out
    const carveMat = new THREE.MeshStandardMaterial({
      color: '#e8903e',
      roughness: 0.45,
      metalness: 0.12,
    })

    const step = MODULE_W + GAP
    const startX = -((MODULES_PER_LAYER - 1) * step) / 2

    for (let layer = 0; layer < LAYERS; layer++) {
      const y = MODULE_H / 2 + layer * (MODULE_H + GAP)
      for (let i = 0; i < MODULES_PER_LAYER; i++) {
        const isCarve = layer === CARVE_LAYER && i === CARVE_INDEX
        const mat = isCarve ? carveMat : baseMat
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true

        const x = startX + i * step
        // Subtle alternating offset for visual interest without looking like Jenga
        const zOffset = (layer % 2 === 0 ? 0 : 0.18)
        mesh.position.set(x, y, zOffset)

        group.add(mesh)
        if (isCarve) {
          this.carveModule = mesh
        }
      }
    }

    this.scene.add(group)
    this.home = {
      x: this.carveModule.position.x,
      y: this.carveModule.position.y,
      z: this.carveModule.position.z,
    }
  }

  /** t: 0 = module seated in the structure, 1 = fully extracted */
  setCarve(t: number) {
    t = clamp01(t)
    const lift = smooth(0, 0.18, t) * 0.28
    const slide = smooth(0.06, 1, t) * OUT
    const separation = smooth(0.1, 0.7, t) * 0.12

    this.carveModule.position.x = this.home.x + slide
    this.carveModule.position.y = this.home.y + lift
    this.carveModule.position.z = this.home.z + separation
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / Math.max(1, h)
    this.camera.updateProjectionMatrix()
  }

  private render() {
    if (this.idle) {
      this.spin += 0.0009
      const r = 13.8
      this.camera.position.x = Math.sin(this.spin) * r
      this.camera.position.z = Math.cos(this.spin) * r
      this.camera.position.y = 6.4
      this.camera.lookAt(0, STRUCTURE_H * 0.42, 0)
    }
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.renderer.dispose()
  }
}
