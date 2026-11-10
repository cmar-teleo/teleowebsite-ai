'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null

/**
 * Site-wide scroll choreography.
 *  - Lenis smooth scrolling, synced to GSAP ScrollTrigger
 *  - writes page progress to --scroll (drives the site arc and the nav meander)
 *  - reveals [data-reveal] elements as they enter
 *  - scrubs [data-parallax] (depth planes) and [data-pushin] (camera push-ins)
 * All of it is skipped under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    const setProgress = () => {
      const max = root.scrollHeight - window.innerHeight
      root.style.setProperty('--scroll', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '1')
    }
    setProgress()
    window.addEventListener('scroll', setProgress, { passive: true })
    window.addEventListener('resize', setProgress)

    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09 })
      activeLenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis!.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    return () => {
      window.removeEventListener('scroll', setProgress)
      window.removeEventListener('resize', setProgress)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      activeLenis = null
    }
  }, [])

  // per-route effects
  useEffect(() => {
    // a new page always opens at its top (unless the link targets an anchor)
    if (!window.location.hash) {
      window.scrollTo(0, 0)
      activeLenis?.scrollTo(0, { immediate: true, force: true })
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    // A clip-path mask hides the element from IntersectionObserver, so masked elements are
    // revealed when their parent enters instead.
    const watch = new Map<Element, HTMLElement[]>()
    els.forEach((el) => {
      const target = el.dataset.reveal === 'mask' && el.parentElement ? el.parentElement : el
      watch.set(target, [...(watch.get(target) ?? []), el])
    })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          watch.get(e.target)?.forEach((el) => el.classList.add('is-in'))
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    )
    watch.forEach((_, target) => io.observe(target))

    const ctx = gsap.context(() => {
      if (reduced) return
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax || '0.2')
        gsap.fromTo(el, { yPercent: -12 * depth * 5 }, {
          yPercent: 12 * depth * 5,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      document.querySelectorAll<HTMLElement>('[data-pushin]').forEach((el) => {
        gsap.fromTo(el, { scale: 0.9, opacity: 0.4 }, {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
        })
      })
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => { clearTimeout(t); io.disconnect(); ctx.revert() }
  }, [pathname])

  return null
}
