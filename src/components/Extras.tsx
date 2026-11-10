import type { CSSProperties } from 'react'
import { community } from '@/lib/content'
import Arrow from './Arrow'

const d = (n: number) => ({ '--d': n }) as CSSProperties

/** Organizations the team supports. `full` adds each description (Responsibility page). */
export function CommunityList({ full = false }: { full?: boolean }) {
  return (
    <section className="pb-24 md:pb-32">
      <div className="wrap">
        <ul className={`grid gap-px overflow-hidden border border-marble/10 bg-marble/10 ${full ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {community.map((o, i) => (
            <li key={o.name} className="bg-midnight" data-reveal style={d(i % 3)}>
              <a href={o.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col p-7 transition-colors hover:bg-obsidian">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-serif text-2xl leading-tight">{o.name}</span>
                  <Arrow className="mt-1 shrink-0 -rotate-45 text-bronze-hi transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                {full && <span className="mt-4 text-[0.95rem] leading-relaxed text-marble/70">{o.desc}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Sellers page: the TSA comparison from the source copy, kept qualitative. */
export function TsaCompare() {
  return (
    <section className="pb-24">
      <div className="wrap">
        <div className="border border-marble/10 p-7 md:p-10" data-reveal>
          <p className="eyebrow">TSA Duration</p>
          <dl className="mt-8 space-y-7">
            <div>
              <dt className="flex items-baseline justify-between gap-4 text-vein">
                <span>Typical market TSA</span>
                <span className="font-serif text-xl text-marble">12-18 months</span>
              </dt>
              <dd className="mt-3 h-1.5 w-full bg-marble/20" aria-hidden="true" />
            </div>
            <div>
              <dt className="flex items-baseline justify-between gap-4 text-vein">
                <span>TELEO-led TSA</span>
                <span className="font-serif text-xl text-aegean">Short &amp; clean</span>
              </dt>
              <dd className="mt-3 h-1.5 w-1/4 bg-aegean shadow-[0_0_12px_var(--color-aegean)]" aria-hidden="true" />
            </div>
          </dl>
          <p className="muted mt-8 max-w-2xl text-sm">Because separation begins during exclusivity, day-one readiness is largely complete at signing.</p>
        </div>
      </div>
    </section>
  )
}

/** Strategy page: People, Product, Process on concentric rings. */
export function ThreePs() {
  return (
    <div className="pointer-events-none mx-auto -mt-6 mb-[-2rem] hidden w-full max-w-md opacity-80 md:block" aria-hidden="true">
      <svg viewBox="0 0 300 150" fill="none" className="w-full">
        {[130, 95, 60].map((r, i) => (
          <path key={r} d={`M${150 - r} 150A${r} ${r} 0 0 1 ${150 + r} 150`} stroke="var(--color-bronze)" strokeOpacity={0.3 + i * 0.2} />
        ))}
        <circle cx="150" cy="150" r="5" fill="var(--color-aegean)" />
        {[
          [58, 58],
          [150, 55],
          [208, 134],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="var(--color-midnight)" stroke="var(--color-aegean)" />
        ))}
      </svg>
    </div>
  )
}
