import type { ReactNode } from 'react'

export type Motif = 'arc' | 'columns' | 'meander' | 'laurel' | 'code' | 'none'

const B = 'var(--color-bronze)'
const A = 'var(--color-aegean)'

/** Procedural hero backdrops: classical forms rendered as luminous linework. */
function Backdrop({ motif }: { motif: Motif }) {
  if (motif === 'none') return null
  let art: ReactNode = null

  if (motif === 'arc') {
    art = (
      <>
        {[230, 180, 130, 80].map((r, i) => (
          <circle key={r} cx="300" cy="300" r={r} stroke={B} strokeOpacity={0.5 - i * 0.09} pathLength={1} strokeDasharray={`${0.82 - i * 0.14} 1`} transform={`rotate(${-90 + i * 24} 300 300)`} />
        ))}
        <circle cx="300" cy="70" r="4" fill={A} />
        <path d="M300 300V70" stroke={A} strokeOpacity="0.4" strokeDasharray="2 6" />
      </>
    )
  }
  if (motif === 'columns') {
    // a colonnade in wireframe, receding
    art = (
      <>
        {Array.from({ length: 6 }, (_, i) => {
          const s = 1 - i * 0.13
          const x = 80 + i * 92
          const top = 300 - 210 * s
          const bot = 300 + 210 * s
          const w = 30 * s
          return (
            <g key={i} stroke={B} strokeOpacity={0.75 - i * 0.1}>
              {[-1, -0.5, 0, 0.5, 1].map((k) => (
                <line key={k} x1={x + k * w} y1={top} x2={x + k * w * 1.12} y2={bot} />
              ))}
              {Array.from({ length: 7 }, (_, k) => {
                const y = top + ((bot - top) * k) / 6
                const ww = w * (1 + 0.12 * (k / 6))
                return <ellipse key={k} cx={x} cy={y} rx={ww} ry={ww * 0.22} strokeOpacity={0.35} />
              })}
              <rect x={x - w * 1.4} y={top - 12 * s} width={w * 2.8} height={12 * s} />
            </g>
          )
        })}
        <path d="M30 76L560 150" stroke={B} strokeOpacity="0.4" />
        <path d="M30 524L560 458" stroke={B} strokeOpacity="0.4" />
        <circle cx="80" cy="300" r="3.5" fill={A} />
      </>
    )
  }
  if (motif === 'meander') {
    const unit = (x: number, y: number, u: number) => `M${x} ${y + 4 * u}h${5 * u}v${-4 * u}h${-4 * u}v${3 * u}h${2 * u}v${-1.5 * u}`
    art = (
      <>
        {[0, 1, 2, 3, 4].map((row) =>
          Array.from({ length: 5 }, (_, i) => (
            <path key={`${row}-${i}`} d={unit(40 + i * 104, 60 + row * 100, 18)} stroke={row === 2 && i < 3 ? A : B} strokeOpacity={row === 2 ? 0.9 : 0.28 + (i % 2) * 0.1} strokeWidth={row === 2 ? 1.6 : 1} />
          )),
        )}
        <path d="M40 332H580" stroke={A} strokeOpacity="0.5" strokeDasharray="2 8" />
      </>
    )
  }
  if (motif === 'laurel') {
    const leaf = (a: number, side: 1 | -1) => {
      const r = 200
      const cx = 300 + Math.cos(a) * r * side
      const cy = 320 - Math.sin(a) * r
      const rot = ((side === 1 ? Math.PI / 2 - a : Math.PI / 2 + a) * 180) / Math.PI + side * -34 + 90
      return <path key={`${a}-${side}`} d="M0 0C10 -14 10 -40 0 -58C-10 -40 -10 -14 0 0Z" transform={`translate(${cx} ${cy}) rotate(${rot})`} stroke={B} strokeOpacity={0.35 + (Math.sin(a) + 1) * 0.25} />
    }
    art = (
      <>
        {Array.from({ length: 13 }, (_, i) => leaf(-0.9 + i * 0.19, 1))}
        {Array.from({ length: 13 }, (_, i) => leaf(-0.9 + i * 0.19, -1))}
        <path d="M300 520A200 200 0 0 1 143 196M300 520A200 200 0 0 0 457 196" stroke={B} strokeOpacity="0.5" />
        <circle cx="300" cy="520" r="4" fill={A} />
      </>
    )
  }
  if (motif === 'code') {
    // a column assembled from code
    const glyphs = ['01', '{}', '=>', '::', '[]', '<>', '&&', '++', 'fn', 'if', '()', '//']
    art = (
      <>
        {Array.from({ length: 26 }, (_, row) =>
          Array.from({ length: 7 }, (_, c) => {
            const k = (c - 3) / 3
            const taper = 1 + (row / 26) * 0.14
            return (
              <text
                key={`${row}-${c}`}
                x={300 + k * 78 * taper}
                y={96 + row * 16}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill={(row * 7 + c * 3) % 11 === 0 ? A : B}
                fillOpacity={0.3 + (1 - Math.abs(k)) * 0.6}
              >
                {glyphs[(row * 5 + c * 7) % glyphs.length]}
              </text>
            )
          }),
        )}
        <rect x="188" y="62" width="224" height="16" stroke={B} />
        <rect x="174" y="512" width="252" height="14" stroke={B} />
        <rect x="160" y="526" width="280" height="14" stroke={B} strokeOpacity="0.6" />
      </>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[58%] items-center md:flex" aria-hidden="true">
      <svg viewBox="0 0 600 600" className="h-[120%] w-full opacity-90" fill="none" data-parallax="0.35">
        {art}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/40 to-transparent" />
    </div>
  )
}

export default function PageHero({
  eyebrow,
  heading,
  ledes = [],
  motif = 'arc',
  children,
}: {
  eyebrow?: string
  heading?: string
  ledes?: string[]
  motif?: Motif
  children?: ReactNode
}) {
  return (
    <section className="grain relative flex min-h-[78svh] items-end overflow-hidden pb-16 pt-[calc(var(--nav-h)+5rem)] md:pb-24">
      <Backdrop motif={motif} />
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative">
        {eyebrow && (
          <p className="eyebrow hero-in">
            {eyebrow}
          </p>
        )}
        <h1 className="display hero-in mt-6 max-w-[52rem]" style={{ animationDelay: '80ms' }}>
          {heading}
        </h1>
        {ledes.map((l, i) => (
          <p key={i} className={`lede hero-in max-w-2xl ${i === 0 ? 'mt-8' : 'mt-4'}`} style={{ animationDelay: `${200 + i * 90}ms` }}>
            {l}
          </p>
        ))}
        {children && (
          <div className="hero-in mt-10 flex flex-wrap gap-4" style={{ animationDelay: '380ms' }}>
            {children}
          </div>
        )}
      </div>
      <div className="meander absolute inset-x-0 bottom-0 opacity-30" aria-hidden="true" />
    </section>
  )
}
