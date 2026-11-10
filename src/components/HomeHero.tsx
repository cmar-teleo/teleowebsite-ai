'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import plates from '@/lib/plates.json'
import Arrow from './Arrow'

gsap.registerPlugin(ScrollTrigger)

/**
 * THE HERO FILM
 * A fresco in separate painted layers (public/plates), moved in depth by scroll:
 *   far    the plaster wall and the ochre arc
 *   middle the parent temple, the column that leaves it, the temple painted round it
 *   near   the floor band with its Greek key
 * The camera pans and pushes across the painting; the column lifts out as an
 * underdrawing, travels, and is painted again where it comes to stand.
 * Every layer is an image file, so a real painting can be dropped in (see README).
 */
const L = plates.layers
const WORLD = plates.world

type Face = { name: string; role: string; photo: string }

const CHAPTERS = [
  { k: 'I', title: 'Inside a larger company', body: 'Strong businesses are often trapped inside bigger ones: non-core divisions, under-managed and starved of capital.' },
  { k: 'II', title: 'The carve-out', body: 'We separate the division from its parent, cleanly and with certainty of close, and stand it up on its own.' },
  { k: 'III', title: 'Built to stand alone', body: 'Our operating team runs it from day one, investing behind the growth that was there all along.' },
]

/** [fade-in start, fade-in end, fade-out start, fade-out end] in scroll progress */
const RANGES: [number, number, number, number][] = [
  [-1, -1, 0.07, 0.13], // intro
  [0.15, 0.2, 0.31, 0.36], // I
  [0.38, 0.43, 0.56, 0.61], // II
  [0.64, 0.69, 0.8, 0.85], // III
  [0.89, 0.95, 2, 2], // final
]
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const ss = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const vis = (p: number, [a, b, c, d]: [number, number, number, number]) => {
  const fin = b <= a ? 1 : clamp((p - a) / (b - a))
  const fout = d <= c ? 1 : 1 - clamp((p - c) / (d - c))
  return Math.min(fin, fout)
}

/** Camera keyframes in world units. Desktop frames by visible height, mobile by visible width. */
type Key = { p: number; cx: number; cy: number; span: number }
const CAM_DESKTOP: Key[] = [
  { p: 0, cx: 1010, cy: 560, span: 1120 },
  { p: 0.35, cx: 1140, cy: 610, span: 900 },
  { p: 0.7, cx: 1700, cy: 600, span: 900 },
  { p: 1, cx: 1630, cy: 560, span: 1050 },
]
const CAM_MOBILE: Key[] = [
  { p: 0, cx: 830, cy: 880, span: 1500 },
  { p: 0.35, cx: 1050, cy: 860, span: 1050 },
  { p: 0.7, cx: 1720, cy: 860, span: 1000 },
  { p: 1, cx: 1900, cy: 840, span: 1060 },
]
/** How much each layer lags the camera (0 = fixed to the scene, + = farther, - = nearer). */
const DEPTH = { wall: 0.5, arc: 0.22, temple: 0, column: -0.02, site: 0, floor: -0.28 }

export default function HomeHero({ faces }: { faces: Face[] }) {
  const track = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const layers = useRef<(HTMLElement | null)[]>([])
  const rail = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = 0
    let smooth = 0
    let px = 0
    let py = 0
    let dx = 0
    let dy = 0
    let raf = 0
    let running = true

    const paint = (p: number) => {
      const st = stage.current
      const w = world.current
      if (!st || !w) return
      const vw = st.clientWidth
      const vh = st.clientHeight
      const mobile = vw < 820 || vw < vh
      const keys = mobile ? CAM_MOBILE : CAM_DESKTOP
      let i = 0
      while (i < keys.length - 2 && p > keys[i + 1].p) i++
      const a = keys[i]
      const b = keys[i + 1]
      const t = ss(a.p, b.p, p)
      const cx = a.cx + (b.cx - a.cx) * t + dx * 26
      const cy = a.cy + (b.cy - a.cy) * t + dy * 14
      const span = a.span + (b.span - a.span) * t
      const z = mobile ? vw / span : vh / span
      w.style.transform = `translate3d(${vw / 2 - cx * z}px, ${vh / 2 - cy * z}px, 0) scale(${z})`

      // depth: far layers lag the camera, near layers lead it
      const ox = cx - 1010
      const oy = cy - 560
      const shift = (k: number) => `translate3d(${ox * k}px, ${oy * k * 0.6}px, 0)`
      const r = refs.current
      if (r.wall) r.wall.style.transform = `${shift(DEPTH.wall)} scale(${mobile ? 3 : 1.45})`
      if (r.floor) r.floor.style.transform = shift(DEPTH.floor)
      if (r.arc) {
        r.arc.style.transform = shift(DEPTH.arc)
        const frac = 0.1 + 0.9 * (0.25 * p + 0.75 * ss(0.5, 0.985, p))
        const m = `conic-gradient(from 0deg, #000 ${frac * 100}%, transparent ${frac * 100 + 0.4}%)`
        r.arc.style.maskImage = m
        r.arc.style.webkitMaskImage = m
      }

      // the carve-out: lift as underdrawing, travel, be painted again
      const travel = ss(0.2, 0.6, p)
      const under = ss(0.16, 0.3, p) * (1 - ss(0.56, 0.72, p))
      const stand = ss(0.62, 0.86, p)
      const x = plates.home.x + (plates.site.x - plates.home.x) * travel
      const y = plates.home.y - Math.sin(travel * Math.PI) * 70
      const tf = `translate3d(${x}px, ${y}px, 0)`
      if (r.column) {
        r.column.style.transform = tf
        r.column.style.opacity = String(1 - under * 0.96)
      }
      if (r.sinopia) {
        r.sinopia.style.transform = tf
        r.sinopia.style.opacity = String(under)
      }
      if (r.ghost) r.ghost.style.opacity = String(travel * 0.5)
      if (r.site) {
        r.site.style.opacity = String(clamp(stand * 1.4))
        r.site.style.clipPath = `inset(${(1 - stand) * 100}% 0 0 0)`
      }
      if (r.temple) r.temple.style.opacity = String(1 - stand * 0.5)
    }

    const captions = (p: number) => {
      layers.current.forEach((el, i) => {
        if (!el) return
        const v = vis(p, RANGES[i])
        el.style.opacity = String(v)
        el.style.transform = `translate3d(0, ${(1 - v) * (p > RANGES[i][2] ? -18 : 18)}px, 0)`
        el.style.visibility = v < 0.01 ? 'hidden' : 'visible'
      })
      if (rail.current) rail.current.style.setProperty('--p', String(p))
    }

    const loop = () => {
      if (!running) return
      smooth += (target - smooth) * 0.085
      dx += (px - dx) * 0.05
      dy += (py - dy) * 0.05
      paint(smooth)
      raf = requestAnimationFrame(loop)
    }

    const move = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1
      py = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })

    captions(0)
    paint(0)
    setReady(true)
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        target = self.progress
        captions(self.progress)
      },
    })
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      cancelAnimationFrame(raf)
      if (running) raf = requestAnimationFrame(loop)
    })
    if (track.current) io.observe(track.current)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      st.kill()
      io.disconnect()
      window.removeEventListener('pointermove', move)
    }
  }, [])

  const setLayer = (i: number) => (el: HTMLElement | null) => {
    layers.current[i] = el
  }
  const ref = (k: string) => (el: HTMLElement | null) => {
    refs.current[k] = el
  }
  const box = (l: { x: number; y: number; w: number; h: number }) => ({ left: l.x, top: l.y, width: l.w, height: l.h })

  return (
    <section ref={track} aria-label="TELEO Capital: a carve-out, from parent to standalone" className="relative motion-safe:h-[560vh]">
      {/* ---------------------------------------------------------------- stage */}
      <div ref={stage} className="relative h-[100svh] overflow-hidden bg-[#14110e] motion-safe:sticky motion-safe:top-0">
        {/* still frames: first paint while the layers load, and the finished painting for reduced motion */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/plates/hero-start.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/plates/hero-end.webp"
          alt="Fresco of a Greek temple on a dark wall. One column has left its colonnade and stands in a small temple of its own, inside a painted ochre circle."
          className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        />

        {/* the painting, in layers */}
        <div
          ref={world}
          role="img"
          aria-label="A fresco in motion: a column leaves a Greek temple, travels as an underdrawing, and is painted again inside a small temple of its own as an ochre circle closes around it."
          className={`absolute left-0 top-0 origin-top-left transition-opacity duration-1000 will-change-transform motion-reduce:hidden ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: WORLD.w, height: WORLD.h }}
        >
          {/* eslint-disable @next/next/no-img-element */}
          <img ref={ref('wall')} src={L.wall.src} alt="" className="absolute max-w-none" style={box(L.wall)} />
          <img ref={ref('arc')} src={L.arc.src} alt="" className="absolute max-w-none" style={box(L.arc)} />
          <img ref={ref('temple')} src={L.temple.src} alt="" className="absolute max-w-none" style={box(L.temple)} />
                    <img src={L['site-base'].src} alt="" className="absolute max-w-none" style={box(L['site-base'])} />
          <img ref={ref('site')} src={L['site-temple'].src} alt="" className="absolute max-w-none opacity-0" style={box(L['site-temple'])} />
          <img ref={ref('ghost')} src={L['column-sinopia'].src} alt="" className="absolute max-w-none opacity-0" style={{ left: plates.home.x, top: plates.home.y, width: plates.column.w, height: plates.column.h }} />
          <img ref={ref('sinopia')} src={L['column-sinopia'].src} alt="" className="absolute left-0 top-0 max-w-none opacity-0" style={{ width: plates.column.w, height: plates.column.h, transform: `translate3d(${plates.home.x}px, ${plates.home.y}px, 0)` }} />
          <img ref={ref('column')} src={L.column.src} alt="" className="absolute left-0 top-0 max-w-none" style={{ width: plates.column.w, height: plates.column.h, transform: `translate3d(${plates.home.x}px, ${plates.home.y}px, 0)` }} />
          <img ref={ref('floor')} src={L.floor.src} alt="" className="absolute max-w-none" style={box(L.floor)} />
          {/* eslint-enable @next/next/no-img-element */}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0b09]/85 via-[#0d0b09]/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/60 to-transparent md:h-1/2 md:via-[#0d0b09]/45" />

        {/* intro */}
        <div ref={setLayer(0)} className="absolute inset-x-0 bottom-0 pb-[clamp(4.5rem,11vh,8rem)]">
          <div className="wrap">
            <p className="eyebrow">Operators with Capital</p>
            <h1 className="display mt-6 max-w-[46rem]">
              We acquire and build complex <em>software and technology</em> businesses
            </h1>
            <p className="lede mt-7 max-w-xl">An operator-led private equity firm with particular depth in corporate carve-outs.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/strategy" className="btn">
                Our Strategy <Arrow />
              </Link>
              <Link href="/contact" className="btn btn--primary">
                Get in Touch <Arrow />
              </Link>
            </div>
          </div>
        </div>

        {/* scroll cue + skip */}
        <div className="absolute bottom-6 right-6 hidden items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-vein motion-safe:flex">
          <a href="#after-hero" className="underline-offset-4 hover:text-marble hover:underline">
            Skip the film
          </a>
          <span aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-marble/60 to-transparent" />
          <span aria-hidden="true">Scroll</span>
        </div>

        {/* chapter rail */}
        <div ref={rail} aria-hidden="true" className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 font-mono text-[0.62rem] tracking-[0.2em] text-vein motion-safe:lg:flex">
          <span>I</span>
          <span className="relative h-28 w-px bg-marble/15">
            <span className="absolute inset-x-0 top-0 origin-top bg-orange" style={{ height: '100%', transform: 'scaleY(var(--p, 0))' }} />
          </span>
          <span>III</span>
        </div>
      </div>

      {/* ---------------------------------------------------------------- chapters: pinned overlay when animated, a plain list when not */}
      <div className="pointer-events-none motion-safe:sticky motion-safe:top-0 motion-safe:-mt-[100svh] motion-safe:h-[100svh] motion-reduce:py-20">
        <ol className="wrap relative h-full motion-reduce:grid motion-reduce:gap-10 motion-reduce:md:grid-cols-3">
          {CHAPTERS.map((c, i) => (
            <li
              key={c.k}
              ref={setLayer(i + 1)}
              className="max-w-md motion-safe:invisible motion-safe:absolute motion-safe:bottom-[clamp(4.5rem,14vh,9rem)] motion-safe:left-0 motion-safe:opacity-0"
            >
              {/* the people who run it: real portraits, inside the third scene */}
              {i === 2 && faces.length > 0 && (
                <ul className="mb-7 flex gap-3" aria-label="Members of the TELEO team">
                  {faces.map((f) => (
                    <li key={f.name} className="w-[22%] max-w-[7.5rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.photo} alt={`${f.name}, ${f.role}`} width={500} height={460} loading="lazy" className="block h-auto w-full" />
                      <span className="mt-1.5 hidden font-mono text-[0.58rem] uppercase leading-tight tracking-[0.12em] text-marble/80 sm:block">{f.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="eyebrow">
                {c.k} · {c.title}
              </p>
              <p className="mt-5 font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.15]">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------------------------------------------------------------- final */}
      <div className="pointer-events-none motion-safe:sticky motion-safe:top-0 motion-safe:-mt-[100svh] motion-safe:h-[100svh]">
        <div ref={setLayer(4)} className="wrap flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0 motion-safe:invisible motion-safe:opacity-0 motion-reduce:pb-24">
          <p className="eyebrow">τελέω · to perform, to execute, to bring to completion</p>
          <h2 className="display mt-6 max-w-[12ch]">
            The upside, <em>in focus.</em>
          </h2>
          <p className="lede mt-7 max-w-lg">We acquire complex, non-core, and under-managed businesses, then operate them from day one to build durable, independent companies.</p>
          <div className="pointer-events-auto mt-9">
            <Link href="/sellers" className="btn">
              For corporate sellers <Arrow />
            </Link>
          </div>
        </div>
      </div>
      <div id="after-hero" className="absolute bottom-0" />
    </section>
  )
}
