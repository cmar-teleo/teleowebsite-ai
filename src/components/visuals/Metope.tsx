'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Wraps a metope SVG with the behaviour every company shares:
 *  - cursor-reactive depth (the three layers shift at different rates)
 *  - animation only while on screen
 *  - a still frame under prefers-reduced-motion
 */
export default function Metope({ children, className = '', tilt = true }: { children: ReactNode; className?: string; tilt?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const svg = el.querySelector('svg') as SVGSVGElement | null
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      // settle on a representative frame, then hold
      try {
        svg?.setCurrentTime(3.9)
        svg?.pauseAnimations()
      } catch {}
      el.dataset.paused = 'true'
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        el.dataset.paused = e.isIntersecting ? 'false' : 'true'
        try {
          if (e.isIntersecting) svg?.unpauseAnimations()
          else svg?.pauseAnimations()
        } catch {}
      },
      { rootMargin: '80px' },
    )
    io.observe(el)

    let raf = 0
    const move = (e: PointerEvent) => {
      if (!tilt || e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--tx', x.toFixed(3))
        el.style.setProperty('--ty', y.toFixed(3))
      })
    }
    const leave = () => {
      el.style.setProperty('--tx', '0')
      el.style.setProperty('--ty', '0')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [tilt])

  return (
    <div ref={ref} className={`metope ${className}`}>
      {children}
    </div>
  )
}
