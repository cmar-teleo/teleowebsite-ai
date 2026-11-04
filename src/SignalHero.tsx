import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { JengaTower } from './JengaTower'

gsap.registerPlugin(ScrollTrigger)

const asset = (n: string) => new URL(`./assets/${n}.webp`, import.meta.url).href
const BG = { b1: asset('bg-1'), b3: asset('bg-3'), b4: asset('bg-4') }

const STOPS = [0, 0.33, 0.66, 1]
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export default function SignalHero() {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const towerRef = useRef<JengaTower | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const progressRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  /* ------------------------------------------------ mount the 3D tower */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const tower = new JengaTower(canvas)
    towerRef.current = tower
    const resize = () => tower.resize(canvas.clientWidth, canvas.clientHeight)
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    setReady(true)
    return () => {
      ro.disconnect()
      tower.dispose()
      towerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (towerRef.current) towerRef.current.idle = !reduced
  }, [reduced, ready])

  /* ------------------------------------------------ smooth scroll */
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.085 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  /* ------------------------------------------------ intro + scroll story */
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
          .from('.sg-fig3d', { opacity: 0, duration: 1.6 }, 0.15)
          .from('.sg-top > *', { opacity: 0, y: -8, duration: 1, stagger: 0.08 }, 0.2)
          .from('.sg-head .li', { yPercent: 110, duration: 1.6, stagger: 0.1 }, 0.35)
          .from('.sg-sub__in, .sg-dock__in, .sg-ch--1 .sg-ch__k, .sg-ch--1 .sg-ch__d', { opacity: 0, y: 10, duration: 1.2, stagger: 0.08 }, 0.9)
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      tl.to('.sg-head, .sg-sub, .sg-dock', { opacity: 0, y: -20, duration: 0.05, stagger: 0.012 }, 0.04)
        // backgrounds wash in behind the tower: era photo → office → boardroom in focus
        .to('.sg-bg--meadow', { opacity: 1, duration: 0.1 }, 0.18)
        .to('.sg-bg--wblur', { opacity: 1, duration: 0.1 }, 0.48)
        .to('.sg-bg--window', { opacity: 1, duration: 0.14 }, 0.74)
        .fromTo('.sg-bg', { scale: 1.08 }, { scale: 1, duration: 1 }, 0)
        // the carved block has slid out by now; fade the 3D tower as TELEO resolves
        .to('.sg-fig3d', { opacity: 0, duration: 0.12 }, 0.58)
        .fromTo('.sg-word', { opacity: 0, scale: 0.9, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.62)
        // chapter captions
        .to('.sg-ch--1', { opacity: 0, y: -12, duration: 0.05 }, 0.12)
        .fromTo('.sg-ch--2', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05 }, 0.27)
        .to('.sg-ch--2', { opacity: 0, y: -12, duration: 0.05 }, 0.42)
        .fromTo('.sg-ch--3', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05 }, 0.57)
        .to('.sg-ch--3', { opacity: 0, y: -12, duration: 0.05 }, 0.7)
        .to('.sg-shade', { opacity: 0.15, duration: 0.14 }, 0.74)
        .fromTo('.sg-final', { opacity: 0, y: 30, pointerEvents: 'none' }, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.07 }, 0.9)

      stRef.current = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        animation: reduced ? undefined : tl,
        scrub: reduced ? false : 0.7,
        onUpdate(self) {
          progressRef.current = self.progress
          // scroll drives the carve-out: the block slides out between 15% and 50%
          towerRef.current?.setCarve(clamp01((self.progress - 0.15) / 0.35))
          if (!reduced) return
          const p = self.progress > 0.85 ? 1 : self.progress > 0.55 ? STOPS[2] : self.progress > 0.2 ? STOPS[1] : 0
          tl.progress(p)
        },
      })
    }, stageRef)
    return () => {
      stRef.current = null
      ctx.revert()
    }
  }, [reduced])

  const scrollToProgress = (p: number) => {
    const st = stRef.current
    if (!st) return
    const y = st.start + (st.end - st.start) * p
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: p === 0 ? 2.4 : 1.6 })
    else window.scrollTo({ top: y, behavior: 'auto' })
  }
  const next = () => {
    const p = progressRef.current
    const n = STOPS.find((s) => s > p + 0.02) ?? 1
    scrollToProgress(n)
  }

  return (
    <main className="sg-root" data-state={ready ? 'ready' : 'loading'}>
      <section ref={trackRef} className="sg-track" aria-label="TELEO Capital — a carve-out, in motion">
        <div ref={stageRef} className="sg-stage">
          <div className="sg-bg" aria-hidden="true">
            <div className="sg-bg__in">
              <img className="sg-bg__img sg-bg--meadow" src={BG.b1} alt="" />
              <img className="sg-bg__img sg-bg--wblur" src={BG.b3} alt="" />
              <img className="sg-bg__img sg-bg--window" src={BG.b4} alt="" />
            </div>
          </div>
          <div className="sg-shade" aria-hidden="true" />

          {/* the 3D Jenga tower lives on the right; the middle block carves out on scroll */}
          <canvas
            ref={canvasRef}
            className="sg-fig3d"
            role="img"
            aria-label="A wooden Jenga tower; its middle block slides out as you scroll, then the tower resolves into the word TELEO"
          />
          <div className="sg-word" aria-hidden="true"><span className="sg-word__mark" />TELEO</div>

          <div className="sg-grain" aria-hidden="true" />

          <header className="sg-top">
            <span>TELEO Capital</span>
            <span className="sg-top__c">Operators <em>&amp;</em> Capital</span>
            <span className="sg-top__r">Private Equity</span>
          </header>

          <h1 className="sg-head">
            <span className="ln"><span className="li">Old divisions,</span></span>
            <span className="ln"><span className="li"><em>new momentum.</em></span></span>
          </h1>

          <div className="sg-sub">
            <p className="sg-sub__in">We acquire complex, non-core businesses and build them into independent companies. Scroll to watch a carve-out.</p>
          </div>

          <div className="sg-ch sg-ch--1">
            <p className="sg-ch__k"><span className="sg-ch__in">I · Inside a larger company</span></p>
            <p className="sg-ch__d">Strong businesses are often trapped inside bigger ones: non-core divisions, under-managed and starved of capital.</p>
          </div>
          <div className="sg-ch sg-ch--2" aria-hidden="true">
            <p className="sg-ch__k">II · The carve-out</p>
            <p className="sg-ch__d">We separate the division from its parent, cleanly and with certainty of close, and stand it up on its own.</p>
          </div>
          <div className="sg-ch sg-ch--3" aria-hidden="true">
            <p className="sg-ch__k">III · Built to stand alone</p>
            <p className="sg-ch__d">Our operating team runs it from day one, investing behind the growth that was there all along.</p>
          </div>

          <div className="sg-dock">
            <div className="sg-dock__in">
              <button type="button" onClick={next}>Next ↓</button>
            </div>
          </div>

          <div className="sg-final">
            <p className="sg-final__kicker">TELEO Capital · operators with capital</p>
            <h2 className="sg-final__title">
              The upside, <br />
              <em>in focus.</em>
            </h2>
            <p className="sg-final__body">We acquire complex, non-core, and under-managed businesses, then operate them from day one to build durable, independent companies.</p>
            <button type="button" className="sg-final__btn" onClick={() => scrollToProgress(0)}>
              Watch it again <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
