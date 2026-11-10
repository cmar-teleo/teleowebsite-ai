'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroPoster from './HeroPoster'
import Arrow from './Arrow'

gsap.registerPlugin(ScrollTrigger)

// The 3D scene is code-split and only requested after first paint; the SVG poster holds the frame until then.
const HeroScene = dynamic(() => import('./three/HeroScene'), { ssr: false })

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
const vis = (p: number, [a, b, c, d]: [number, number, number, number]) => {
  const fin = b <= a ? 1 : Math.max(0, Math.min(1, (p - a) / (b - a)))
  const fout = d <= c ? 1 : 1 - Math.max(0, Math.min(1, (p - c) / (d - c)))
  return Math.min(fin, fout)
}

export default function HomeHero() {
  const track = useRef<HTMLElement>(null)
  const layers = useRef<(HTMLElement | null)[]>([])
  const rail = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [mount3d, setMount3d] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // request the 3D bundle once the page is idle
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const id = idle ? idle(() => setMount3d(true), { timeout: 1200 }) : window.setTimeout(() => setMount3d(true), 400)

    const apply = (p: number) => {
      progress.current = p
      layers.current.forEach((el, i) => {
        if (!el) return
        const v = vis(p, RANGES[i])
        el.style.opacity = String(v)
        el.style.transform = `translate3d(0, ${(1 - v) * (p > RANGES[i][2] ? -18 : 18)}px, 0)`
        el.style.visibility = v < 0.01 ? 'hidden' : 'visible'
      })
      if (rail.current) rail.current.style.setProperty('--p', String(p))
    }
    apply(0)
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => apply(self.progress),
      onToggle: (self) => setActive(self.isActive || self.progress < 1),
    })
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    if (track.current) io.observe(track.current)
    return () => {
      st.kill()
      io.disconnect()
      if (idle) (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id)
      else clearTimeout(id)
    }
  }, [])

  const setLayer = (i: number) => (el: HTMLElement | null) => {
    layers.current[i] = el
  }

  return (
    <section ref={track} aria-label="TELEO Capital: a carve-out, from parent to standalone" className="relative motion-safe:h-[560vh]">
      {/* ---------------------------------------------------------------- stage */}
      <div className="grain relative h-[100svh] overflow-hidden motion-safe:sticky motion-safe:top-0">
        <HeroPoster state="start" className="absolute inset-0 h-full w-full motion-reduce:hidden" />
        <HeroPoster state="end" className="absolute inset-0 hidden h-full w-full motion-reduce:block" />
        {mount3d && (
          <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <HeroScene progress={progress} active={active} onReady={() => setReady(true)} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-midnight/85 via-midnight/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-midnight via-midnight/60 to-transparent md:h-1/2 md:via-midnight/50" />

        {/* intro */}
        <div ref={setLayer(0)} className="absolute inset-x-0 bottom-0 pb-[clamp(4.5rem,11vh,8rem)]">
          <div className="wrap">
            <p className="eyebrow">Operators with Capital</p>
            <h1 className="display mt-6 max-w-[15ch] md:max-w-[17ch]">
              We acquire and build complex <em className="text-bronze-hi">software and technology</em> businesses
            </h1>
            <p className="lede mt-7 max-w-xl">An operator-led private equity firm with particular depth in corporate carve-outs.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/strategy" className="btn">
                Our Strategy <Arrow />
              </Link>
              <Link href="/contact" className="btn btn--bronze">
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
          <span aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-bronze to-transparent" />
          <span aria-hidden="true">Scroll</span>
        </div>

        {/* chapter rail */}
        <div ref={rail} aria-hidden="true" className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 font-mono text-[0.62rem] tracking-[0.2em] text-vein motion-safe:lg:flex">
          <span>I</span>
          <span className="relative h-28 w-px bg-marble/15">
            <span className="absolute inset-x-0 top-0 origin-top bg-aegean" style={{ height: '100%', transform: 'scaleY(var(--p, 0))' }} />
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
            The upside, <em className="text-bronze-hi">in focus.</em>
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
