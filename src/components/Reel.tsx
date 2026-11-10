'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A horizontal "tracking shot": on desktop the section pins and vertical scroll pans the
 * camera sideways across its panels. On touch widths and under reduced motion it is a
 * plain vertical stack.
 */
export default function Reel({ children, header, count }: { children: ReactNode; header: ReactNode; count: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const o = outer.current!
      const t = track.current!
      o.dataset.live = 'true'
      const dist = () => Math.max(0, t.scrollWidth - o.clientWidth)
      o.style.height = `calc(100vh + ${dist()}px)`
      const st = ScrollTrigger.create({
        trigger: o,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: () => (o.style.height = `calc(100vh + ${dist()}px)`),
        onUpdate: (self) => {
          gsap.set(t, { x: -dist() * self.progress })
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
        },
      })
      return () => {
        st.kill()
        o.style.height = ''
        delete o.dataset.live
        gsap.set(t, { clearProps: 'transform' })
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={outer} className="group/reel relative">
      <div className="py-24 group-data-[live=true]/reel:sticky group-data-[live=true]/reel:top-0 group-data-[live=true]/reel:flex group-data-[live=true]/reel:h-screen group-data-[live=true]/reel:flex-col group-data-[live=true]/reel:justify-center group-data-[live=true]/reel:overflow-hidden group-data-[live=true]/reel:py-0">
        <div className="wrap flex items-end justify-between gap-8">
          {header}
          <div className="hidden items-center gap-4 font-mono text-[0.68rem] tracking-[0.2em] text-vein group-data-[live=true]/reel:flex" aria-hidden="true">
            <span>01</span>
            <span className="relative h-px w-24 bg-marble/15">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-aegean" />
            </span>
            <span>{String(count).padStart(2, '0')}</span>
          </div>
        </div>
        <div ref={track} className="wrap mt-12 flex flex-col gap-6 will-change-transform group-data-[live=true]/reel:!ml-[max(1.25rem,calc((100vw-78rem)/2))] group-data-[live=true]/reel:!w-max group-data-[live=true]/reel:flex-row group-data-[live=true]/reel:gap-10 group-data-[live=true]/reel:pr-[10vw]">
          {children}
        </div>
      </div>
    </div>
  )
}
