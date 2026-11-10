'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A horizontal "tracking shot": on desktop the section pins and vertical scroll pans the
 * camera sideways across its panels. The pan runs until the LAST panel is fully in frame,
 * then holds there briefly before the page moves on. On touch widths and under reduced
 * motion it is a plain vertical stack.
 */
const HOLD = 0.16 // share of the scroll spent resting on the last panel

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
      // distance to bring the right edge of the last panel inside the page gutter
      const dist = () => {
        const last = t.lastElementChild as HTMLElement | null
        if (!last) return 0
        const gutter = Math.max(20, (o.clientWidth - 1248) / 2)
        const right = t.offsetLeft + last.offsetLeft + last.offsetWidth
        return Math.max(0, right - (o.clientWidth - gutter))
      }
      const size = () => (o.style.height = `${window.innerHeight + dist() / (1 - HOLD)}px`)
      size()
      const st = ScrollTrigger.create({
        trigger: o,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: size,
        onUpdate: (self) => {
          const p = Math.min(1, self.progress / (1 - HOLD))
          gsap.set(t, { x: -dist() * p })
          if (bar.current) bar.current.style.transform = `scaleX(${p})`
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
      {/* pinned frame: header at the top, panels fill the rest; nothing is centred against a fixed height, so nothing crops */}
      <div className="py-24 group-data-[live=true]/reel:sticky group-data-[live=true]/reel:top-0 group-data-[live=true]/reel:flex group-data-[live=true]/reel:h-screen group-data-[live=true]/reel:flex-col group-data-[live=true]/reel:overflow-hidden group-data-[live=true]/reel:pb-8 group-data-[live=true]/reel:pt-[calc(var(--nav-h)+1.25rem)]">
        <div className="wrap flex shrink-0 items-end justify-between gap-8">
          {header}
          <div className="hidden items-center gap-4 font-mono text-[0.68rem] tracking-[0.2em] text-vein group-data-[live=true]/reel:flex" aria-hidden="true">
            <span>01</span>
            <span className="relative h-px w-24 bg-marble/15">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-orange" />
            </span>
            <span>{String(count).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="mt-10 group-data-[live=true]/reel:mt-6 group-data-[live=true]/reel:flex group-data-[live=true]/reel:min-h-0 group-data-[live=true]/reel:flex-1 group-data-[live=true]/reel:items-center">
          <div
            ref={track}
            className="wrap flex flex-col gap-6 will-change-transform group-data-[live=true]/reel:!mx-0 group-data-[live=true]/reel:!ml-[max(1.25rem,calc((100vw-78rem)/2))] group-data-[live=true]/reel:!w-max group-data-[live=true]/reel:flex-row group-data-[live=true]/reel:items-stretch group-data-[live=true]/reel:gap-10"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
