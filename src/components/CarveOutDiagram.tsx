'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A living, qualitative diagram of a carve-out: a non-core division leaves its parent,
 * the ties it shared with the parent release one at a time, and each is re-established
 * as the division's own. Scroll scrubs it; reduced motion shows the finished state.
 * No figures: it illustrates the idea in the copy and nothing more.
 */
const TIES = ['Systems', 'People', 'Customers', 'Vendors']
const SLOT = { x: 335, y: 182 }
const DX = 385

export default function CarveOutDiagram({ phases }: { phases: string[] }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, paused: true })
      tl.to('.co-div', { x: DX, duration: 1 }, 0.25)
        .to('.co-tie-old', { attr: { x2: SLOT.x + DX }, duration: 1 }, 0.25)
        .to('.co-tie-old', { opacity: 0, duration: 0.18, stagger: 0.16 }, 0.5)
        .to('.co-slot', { opacity: 1, duration: 0.3 }, 0.4)
        .fromTo('.co-tie-new', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.14 }, 1.25)
        .fromTo('.co-node', { opacity: 0, scale: 0.4, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.14 }, 1.35)
        .fromTo('.co-own', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 1.8)
        .fromTo('.co-arc', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9 }, 1.5)
        .to('.co-parent-label', { opacity: 0.45, duration: 0.4 }, 0.6)
      // phase captions light up in turn
      const steps = gsap.utils.toArray<HTMLElement>('.co-phase')
      steps.forEach((s, i) => tl.to(s, { opacity: 1, duration: 0.25 }, 0.1 + i * (2.2 / steps.length)))

      if (reduced) {
        tl.progress(1)
        return
      }
      // hold the diagram in the middle of the screen until the whole sequence has played
      const frame = el.parentElement ?? el
      ScrollTrigger.create({ trigger: frame, start: 'center center', end: '+=140%', pin: frame, pinSpacing: true, anticipatePin: 1, scrub: 0.8, animation: tl })
    }, el)
    return () => ctx.revert()
  }, [])

  const cx = SLOT.x + DX + 35
  const cy = SLOT.y + 28
  const nodes = TIES.map((_, i) => ({ x: cx + 118, y: cy - 96 + i * 64 }))
  const anchors = [
    { x: 285, y: 138 },
    { x: 200, y: 210 },
    { x: 285, y: 282 },
    { x: 115, y: 138 },
  ]

  return (
    <div ref={root} className="relative">
      <svg
        viewBox="0 0 1000 420"
        className="h-auto w-full"
        role="img"
        aria-label="Diagram of a carve-out. A non-core division separates from its parent company. The ties it shared with the parent, such as systems, people, customers and vendors, are released and re-established as its own, leaving a standalone company."
        fill="none"
        strokeLinecap="round"
      >
        {/* parent */}
        <rect x="60" y="90" width="360" height="240" stroke="var(--color-bronze)" strokeOpacity="0.5" />
        <path d="M52 90h376M240 46L52 90M240 46l188 44M52 330h376M40 340h400" stroke="var(--color-bronze)" strokeOpacity="0.35" />
        {Array.from({ length: 12 }, (_, i) => {
          const c = i % 4
          const r = Math.floor(i / 4)
          if (c === 3 && r === 1) return null
          return <rect key={i} x={80 + c * 85} y={110 + r * 72} width="70" height="56" stroke="var(--color-marble)" strokeOpacity="0.22" />
        })}
        <rect className="co-slot" x={SLOT.x} y={SLOT.y} width="70" height="56" stroke="var(--color-bronze)" strokeDasharray="3 5" opacity="0" />
        <text className="co-parent-label" x="60" y="372" fill="var(--color-marble)" fontSize="13" letterSpacing="3" fontFamily="var(--font-mono)">
          PARENT COMPANY
        </text>

        {/* ties to the parent, released one by one */}
        {anchors.map((a, i) => (
          <line key={i} className="co-tie-old" x1={a.x} y1={a.y} x2={SLOT.x} y2={SLOT.y + 10 + i * 12} stroke="var(--color-bronze)" strokeDasharray="2 5" />
        ))}

        {/* the telos arc around the standalone company */}
        <circle className="co-arc" cx={cx} cy={cy} r="172" stroke="var(--color-bronze)" strokeWidth="1.2" pathLength={1} strokeDasharray="1" transform={`rotate(-90 ${cx} ${cy})`} />

        {/* its own ties */}
        {nodes.map((n, i) => (
          <g key={i}>
            <path className="co-tie-new" d={`M${cx + 35} ${cy - 18 + i * 12}C${cx + 75} ${cy - 18 + i * 12} ${n.x - 50} ${n.y} ${n.x - 8} ${n.y}`} stroke="var(--color-marble)" pathLength={1} strokeDasharray="1" />
            <g className="co-node">
              <circle cx={n.x} cy={n.y} r="6" stroke="var(--color-marble)" />
              <circle cx={n.x} cy={n.y} r="2" fill="var(--color-marble)" />
              <text x={n.x + 16} y={n.y + 4} fill="var(--color-marble)" fontSize="12" letterSpacing="2.5" fontFamily="var(--font-mono)">
                {TIES[i].toUpperCase()}
              </text>
            </g>
          </g>
        ))}

        {/* the division */}
        <g className="co-div">
          <rect x={SLOT.x} y={SLOT.y} width="70" height="56" fill="var(--color-obsidian)" stroke="var(--color-bronze-hi)" strokeWidth="1.5" />
          <path d={`M${SLOT.x + 14} ${SLOT.y + 12}v32M${SLOT.x + 28} ${SLOT.y + 12}v32M${SLOT.x + 42} ${SLOT.y + 12}v32M${SLOT.x + 56} ${SLOT.y + 12}v32`} stroke="var(--color-bronze-hi)" strokeOpacity="0.7" />
          <g className="co-own">
            <path d={`M${SLOT.x - 8} ${SLOT.y}h86M${SLOT.x + 35} ${SLOT.y - 22}l-43 22M${SLOT.x + 35} ${SLOT.y - 22}l43 22M${SLOT.x - 8} ${SLOT.y + 56}h86M${SLOT.x - 16} ${SLOT.y + 64}h102`} stroke="var(--color-bronze-hi)" />
            <text x={SLOT.x + 35} y={SLOT.y + 92} textAnchor="middle" fill="var(--color-marble)" fontSize="13" letterSpacing="3" fontFamily="var(--font-mono)">
              STANDALONE
            </text>
          </g>
        </g>
      </svg>

      <ol className="mt-8 grid gap-4 border-t border-marble/10 pt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] sm:grid-cols-3">
        {phases.map((p, i) => (
          <li key={p} className="co-phase flex items-center gap-3 opacity-40">
            <span className="text-bronze-hi">{String(i + 1).padStart(2, '0')}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
