'use client'

/**
 * HERO SCENE: "the carve-out, completed"
 * Fully procedural (no textures, no models). Three depth planes:
 *   background: dust field + the bronze telos arc that closes with scroll
 *   midground:  the parent colonnade; one column leaves it and stands alone
 *   foreground: a Greek-key data path on the floor, drifting motes, a near silhouette
 * Scroll progress (0..1) arrives through `progress`; nothing here reads the DOM.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'

const MARBLE = '#e8e2d6'
const BRONZE = '#b8864b'
const AEGEAN = '#4fd8ff'
const MIDNIGHT = '#07090d'

const COL_H = 5
const SPACING = 1.7
const N = 9
const HOME = new THREE.Vector3(SPACING, 0, -2) // slot 5 of the front row
const PLINTH = new THREE.Vector3(6.2, 0.36, 2.6)
const ARC_C = new THREE.Vector3(6.2, 4.95, 0.4)
const ARC_R = 4.6

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const ss = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** A fluted Doric shaft: a tapered cylinder whose radius is scalloped around the circumference. */
function flutedShaft(radial: number, heightSeg = 1) {
  const g = new THREE.CylinderGeometry(0.33, 0.4, COL_H, radial, heightSeg, false)
  const pos = g.attributes.position
  const flutes = 16
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const r = Math.hypot(x, z)
    if (r < 0.01) continue
    const a = Math.atan2(z, x)
    const k = 1 - 0.07 * Math.abs(Math.sin((a * flutes) / 2))
    pos.setX(i, x * k)
    pos.setZ(i, z * k)
  }
  g.translate(0, COL_H / 2, 0)
  g.computeVertexNormals()
  return g
}

/** Greek key as line segments along +X. Each unit is an open square spiral rising from a baseline. */
function meanderSegments(units: number, u: number) {
  const key: [number, number][] = [[0, 0], [0.9, 0], [0.9, 0.8], [0.22, 0.8], [0.22, 0.3], [0.62, 0.3], [0.62, 0.55]]
  const out: number[] = []
  for (let k = 0; k < units; k++) {
    for (let i = 0; i < key.length - 1; i++) {
      out.push((k + key[i][0]) * u, 0, -key[i][1] * u, (k + key[i + 1][0]) * u, 0, -key[i + 1][1] * u)
    }
    out.push((k + 0.9) * u, 0, 0, (k + 1) * u, 0, 0)
  }
  return new Float32Array(out)
}
const SEG_PER_UNIT = 7

type Key = { p: number; pos: [number, number, number]; look: [number, number, number] }
const CAM_DESKTOP: Key[] = [
  { p: 0, pos: [-0.6, 2.6, 17], look: [0.4, 3.2, -2] },
  { p: 0.35, pos: [2.2, 2.4, 15], look: [2.4, 3.0, 0] },
  { p: 0.7, pos: [5.2, 2.6, 14.5], look: [4.6, 3.3, 2.6] },
  { p: 1, pos: [4.0, 3.3, 16.5], look: [4.2, 3.9, 0] },
]
const CAM_MOBILE: Key[] = [
  { p: 0, pos: [0, 3.0, 25], look: [0, 1.0, -2] },
  { p: 0.35, pos: [1.8, 2.6, 17], look: [1.8, 1.0, 0] },
  { p: 0.7, pos: [6.2, 2.6, 15], look: [6.2, 1.2, 2.6] },
  { p: 1, pos: [6.2, 3.4, 17.5], look: [6.2, 1.7, 0] },
]

function World({ progress, mobile }: { progress: MutableRefObject<number>; mobile: boolean }) {
  const { camera } = useThree()
  const pointer = useRef(new THREE.Vector2())
  useEffect(() => {
    const on = (e: PointerEvent) => pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])
  const smooth = useRef(0)
  const look = useRef(new THREE.Vector3(0, 3, -2))
  const drift = useRef(new THREE.Vector2())
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = mobile ? 52 : 35
    cam.updateProjectionMatrix()
  }, [camera, mobile])

  /* ---------------------------------------------------------------- geometry */
  const shaftLo = useMemo(() => flutedShaft(mobile ? 20 : 32), [mobile])
  const shaftHi = useMemo(() => flutedShaft(mobile ? 32 : 64), [mobile])
  const shaftWire = useMemo(() => new THREE.WireframeGeometry(flutedShaft(16, 10)), [])
  const shaftPoints = useMemo(() => flutedShaft(32, 28), [])
  const pediment = useMemo(() => {
    const w = N * SPACING + 1.2
    const s = new THREE.Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(0, 2.1)
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: 1.0, bevelEnabled: false })
  }, [])
  const smallPediment = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.95, 0)
    s.lineTo(1.95, 0)
    s.lineTo(0, 0.75)
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: false })
  }, [])
  const arcGeo = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, ARC_R, ARC_R, Math.PI / 2, Math.PI / 2 - Math.PI * 2, true)
    const pts = curve.getPoints(256).map((p) => new THREE.Vector3(p.x, p.y, 0))
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 256, 0.022, 6, false)
  }, [])
  const meander = useMemo(() => {
    const u = 0.5
    const units = 40
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(meanderSegments(units, u), 3))
    return { g, u, units, x0: -10 }
  }, [])
  const dust = useMemo(() => {
    const n = mobile ? 400 : 1100
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 70
      a[i * 3 + 1] = Math.random() * 26
      a[i * 3 + 2] = -14 - Math.random() * 34
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(a, 3))
    return g
  }, [mobile])
  const motes = useMemo(() => {
    const n = mobile ? 40 : 110
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      a[i * 3] = -8 + Math.random() * 20
      a[i * 3 + 1] = Math.random() * 7
      a[i * 3 + 2] = 3 + Math.random() * 8
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(a, 3))
    return g
  }, [mobile])

  /* ---------------------------------------------------------------- refs */
  const shafts = useRef<THREE.InstancedMesh>(null)
  const caps = useRef<THREE.InstancedMesh>(null)
  const hero = useRef<THREE.Group>(null)
  const heroMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1ebdf', roughness: 0.6, metalness: 0.02, emissive: new THREE.Color(BRONZE), emissiveIntensity: 0, transparent: true }), [])
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const wireMat = useRef<THREE.LineBasicMaterial>(null)
  const ptsMat = useRef<THREE.PointsMaterial>(null)
  const heroLight = useRef<THREE.PointLight>(null)
  const standLight = useRef<THREE.PointLight>(null)
  const flankL = useRef<THREE.Group>(null)
  const flankR = useRef<THREE.Group>(null)
  const lintel = useRef<THREE.Mesh>(null)
  const roof = useRef<THREE.Mesh>(null)
  const arc = useRef<THREE.Mesh>(null)
  const liveKey = useRef<THREE.LineSegments>(null)
  const motesRef = useRef<THREE.Points>(null)
  const slotGlow = useRef<THREE.Mesh>(null)

  // place the parent colonnade (two rows; the hero column's slot is left empty in the front row)
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    let i = 0
    for (let row = 0; row < 2; row++) {
      for (let c = 0; c < N; c++) {
        const x = (c - (N - 1) / 2) * SPACING
        const z = row === 0 ? -2 : -5.4
        if (row === 0 && Math.abs(x - HOME.x) < 0.01) continue
        m.makeTranslation(x, 0, z)
        shafts.current!.setMatrixAt(i, m)
        m.makeTranslation(x, COL_H + 0.11, z)
        caps.current!.setMatrixAt(i, m)
        i++
      }
    }
    shafts.current!.count = i
    caps.current!.count = i
    shafts.current!.instanceMatrix.needsUpdate = true
    caps.current!.instanceMatrix.needsUpdate = true
  }, [])

  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [HOME.clone(), new THREE.Vector3(HOME.x, 0.5, 0.8), new THREE.Vector3(3.2, 0.7, 2.6), new THREE.Vector3(5.2, 0.6, 2.7), PLINTH.clone()],
        false,
        'catmullrom',
        0.4,
      ),
    [],
  )

  const tmpA = useMemo(() => new THREE.Vector3(), [])
  const tmpB = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0015, dt)
    smooth.current += (progress.current - smooth.current) * k
    const p = smooth.current
    const time = state.clock.elapsedTime

    /* camera: keyframed dolly + cursor-reactive drift */
    const keys = mobile ? CAM_MOBILE : CAM_DESKTOP
    let i = 0
    while (i < keys.length - 2 && p > keys[i + 1].p) i++
    const a = keys[i]
    const b = keys[i + 1]
    const t = ss(a.p, b.p, p)
    tmpA.set(a.pos[0], a.pos[1], a.pos[2]).lerp(tmpB.set(b.pos[0], b.pos[1], b.pos[2]), t)
    drift.current.lerp(pointer.current, 0.04)
    camera.position.set(tmpA.x + drift.current.x * 0.55, tmpA.y + drift.current.y * 0.3 + Math.sin(time * 0.25) * 0.05, tmpA.z)
    tmpA.set(a.look[0], a.look[1], a.look[2]).lerp(tmpB.set(b.look[0], b.look[1], b.look[2]), t)
    look.current.copy(tmpA)
    camera.lookAt(look.current)

    /* the carve-out */
    const travel = ss(0.2, 0.6, p)
    const wire = ss(0.16, 0.3, p) * (1 - ss(0.56, 0.72, p))
    const stand = ss(0.62, 0.86, p)
    const chosen = ss(0.02, 0.14, p)

    path.getPoint(travel, tmpA)
    hero.current!.position.copy(tmpA)
    hero.current!.rotation.y = travel * Math.PI * 0.5

    heroMat.opacity = 1 - wire * 0.94
    heroMat.emissiveIntensity = chosen * 0.22 * (1 - stand * 0.6) + wire * 0.1
    wireMat.current!.opacity = wire * 0.9
    ptsMat.current!.opacity = wire
    heroLight.current!.intensity = chosen * 4 + wire * 14
    slotGlow.current!.scale.setScalar(0.6 + travel * 0.6)
    ;(slotGlow.current!.material as THREE.MeshBasicMaterial).opacity = travel * 0.35 * (1 - stand * 0.5)

    /* standing alone: companions rise, the lintel closes, the roof sets */
    const rise = Math.max(0.0001, ss(0.0, 0.7, stand))
    flankL.current!.scale.set(1, rise, 1)
    flankR.current!.scale.set(1, rise, 1)
    lintel.current!.scale.set(Math.max(0.0001, ss(0.5, 0.9, stand)), 1, 1)
    roof.current!.scale.setScalar(Math.max(0.0001, ss(0.7, 1, stand)))
    standLight.current!.intensity = stand * 42
    keyLight.current!.intensity = 2.9 - 1.9 * stand
    const built = stand > 0.01
    flankL.current!.visible = built
    flankR.current!.visible = built
    lintel.current!.visible = stand > 0.5
    roof.current!.visible = stand > 0.7

    /* the telos arc */
    const frac = 0.1 + 0.9 * (0.25 * p + 0.75 * ss(0.5, 0.985, p))
    arc.current!.geometry.setDrawRange(0, Math.floor(256 * frac) * 36)

    /* the data path lights up under the travelling column */
    const fromUnit = Math.floor((HOME.x - meander.x0) / meander.u)
    const toUnit = Math.ceil((PLINTH.x + 1.6 - meander.x0) / meander.u)
    const lit = Math.floor((toUnit - fromUnit) * ss(0.18, 0.62, p))
    liveKey.current!.geometry.setDrawRange(fromUnit * SEG_PER_UNIT * 2, lit * SEG_PER_UNIT * 2)

    /* foreground motes drift upward */
    const mp = motesRef.current!.geometry.attributes.position as THREE.BufferAttribute
    for (let j = 0; j < mp.count; j++) {
      let y = mp.getY(j) + dt * 0.12
      if (y > 7) y = 0
      mp.setY(j, y)
    }
    mp.needsUpdate = true
  })

  const marble = <meshStandardMaterial color={MARBLE} roughness={0.78} metalness={0.02} />

  return (
    <>
      <color attach="background" args={[MIDNIGHT]} />
      <fogExp2 attach="fog" args={[MIDNIGHT, 0.03]} />

      <hemisphereLight args={['#b9c7dd', '#2a2118', 0.75]} />
      <directionalLight ref={keyLight} position={[9, 11, 9]} intensity={2.9} color="#fff0dc" />
      <directionalLight position={[-10, 5, -8]} intensity={0.55} color={AEGEAN} />

      {/* ------------------------------------------------ background plane */}
      <points geometry={dust}>
        <pointsMaterial size={0.07} color={MARBLE} transparent opacity={0.55} sizeAttenuation depthWrite={false} fog={false} />
      </points>
      <group position={ARC_C}>
        <mesh>
          <torusGeometry args={[ARC_R, 0.008, 6, 200]} />
          <meshBasicMaterial color={MARBLE} transparent opacity={0.08} fog={false} />
        </mesh>
        <mesh ref={arc} geometry={arcGeo}>
          <meshBasicMaterial color={BRONZE} fog={false} toneMapped={false} />
        </mesh>
      </group>

      {/* ------------------------------------------------ midground: the parent */}
      <instancedMesh ref={shafts} args={[shaftLo, undefined, N * 2]} frustumCulled={false}>
        {marble}
      </instancedMesh>
      <instancedMesh ref={caps} args={[undefined, undefined, N * 2]} frustumCulled={false}>
        <boxGeometry args={[0.98, 0.22, 0.98]} />
        {marble}
      </instancedMesh>
      {/* stylobate */}
      {[0, 1, 2].map((s) => (
        <mesh key={s} position={[0, -0.12 - s * 0.24, -3.7]}>
          <boxGeometry args={[N * SPACING + 1.2 + s * 0.9, 0.24, 5.4 + s * 0.9]} />
          {marble}
        </mesh>
      ))}
      {/* entablature + pediment */}
      <mesh position={[0, COL_H + 0.57, -2]}>
        <boxGeometry args={[N * SPACING + 0.6, 0.7, 1.05]} />
        {marble}
      </mesh>
      <mesh position={[0, COL_H + 1.0, -2]}>
        <boxGeometry args={[N * SPACING + 1.2, 0.16, 1.25]} />
        {marble}
      </mesh>
      <mesh geometry={pediment} position={[0, COL_H + 1.08, -2.5]}>
        {marble}
      </mesh>
      <mesh position={[0, COL_H + 0.57, -5.4]}>
        <boxGeometry args={[N * SPACING + 0.6, 0.7, 1.05]} />
        {marble}
      </mesh>
      {/* the empty slot glows once the column has left */}
      <mesh ref={slotGlow} position={[HOME.x, 0.02, HOME.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 48]} />
        <meshBasicMaterial color={BRONZE} transparent opacity={0} toneMapped={false} />
      </mesh>

      {/* ------------------------------------------------ the carved-out column */}
      <group ref={hero}>
        <mesh geometry={shaftHi} material={heroMat} />
        <mesh position={[0, COL_H + 0.11, 0]} material={heroMat}>
          <boxGeometry args={[0.98, 0.22, 0.98]} />
        </mesh>
        <lineSegments geometry={shaftWire}>
          <lineBasicMaterial ref={wireMat} color={AEGEAN} transparent opacity={0} toneMapped={false} fog={false} />
        </lineSegments>
        <points geometry={shaftPoints}>
          <pointsMaterial ref={ptsMat} color={AEGEAN} size={0.03} transparent opacity={0} depthWrite={false} toneMapped={false} fog={false} />
        </points>
        <pointLight ref={heroLight} position={[0, 2.4, 1.2]} color={BRONZE} intensity={0} distance={9} />
      </group>

      {/* ------------------------------------------------ the standalone company */}
      <group position={[PLINTH.x, 0, PLINTH.z]}>
        {[0, 1].map((s) => (
          <mesh key={s} position={[0, 0.27 - s * 0.18, 0]}>
            <boxGeometry args={[4.3 + s * 0.6, 0.18, 1.7 + s * 0.6]} />
            {marble}
          </mesh>
        ))}
        <group ref={flankL} position={[-1.45, 0.36, 0]}>
          <mesh geometry={shaftLo}>{marble}</mesh>
          <mesh position={[0, COL_H + 0.11, 0]}>
            <boxGeometry args={[0.98, 0.22, 0.98]} />
            {marble}
          </mesh>
        </group>
        <group ref={flankR} position={[1.45, 0.36, 0]}>
          <mesh geometry={shaftLo}>{marble}</mesh>
          <mesh position={[0, COL_H + 0.11, 0]}>
            <boxGeometry args={[0.98, 0.22, 0.98]} />
            {marble}
          </mesh>
        </group>
        <mesh ref={lintel} position={[0, COL_H + 0.36 + 0.5, 0]}>
          <boxGeometry args={[3.9, 0.5, 1.0]} />
          {marble}
        </mesh>
        <mesh ref={roof} geometry={smallPediment} position={[0, COL_H + 0.36 + 0.75, -0.45]}>
          {marble}
        </mesh>
        <pointLight ref={standLight} position={[0.5, 3.2, 3.2]} color="#ffcf96" intensity={0} distance={12} />
      </group>

      {/* ------------------------------------------------ foreground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.9} metalness={0.1} />
      </mesh>
      <group position={[meander.x0, 0.02, 4.1]}>
        <lineSegments geometry={meander.g}>
          <lineBasicMaterial color={BRONZE} transparent opacity={0.35} />
        </lineSegments>
        <lineSegments ref={liveKey} geometry={useMemo(() => meander.g.clone(), [meander])} position={[0, 0.005, 0]}>
          <lineBasicMaterial color={AEGEAN} toneMapped={false} fog={false} />
        </lineSegments>
      </group>
      <points ref={motesRef} geometry={motes}>
        <pointsMaterial size={0.045} color={BRONZE} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
      </points>
      {/* near silhouette: an out-of-frame column that the camera moves past */}
      {!mobile && (
        <mesh geometry={shaftLo} position={[-7.2, 0, 8.5]} scale={[1.5, 1.6, 1.5]}>
          <meshStandardMaterial color="#141820" roughness={1} />
        </mesh>
      )}
    </>
  )
}

export default function HeroScene({ progress, active, onReady }: { progress: MutableRefObject<number>; active: boolean; onReady: () => void }) {
  const [mobile, setMobile] = useState(false)
  const [dpr, setDpr] = useState(1.5)
  useEffect(() => {
    const on = () => setMobile(window.innerWidth < 820 || window.innerWidth < window.innerHeight)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.25] : [1, dpr]}
      camera={{ fov: mobile ? 52 : 35, near: 0.1, far: 120, position: [0, 2.4, 15.5] }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        onReady()
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <AdaptiveDpr />
      <World key={mobile ? 'm' : 'd'} progress={progress} mobile={mobile} />
    </Canvas>
  )
}
