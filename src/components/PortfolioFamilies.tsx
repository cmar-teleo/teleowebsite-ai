import Link from 'next/link'
import type { CSSProperties } from 'react'
import { addOnsOf, platforms } from '@/lib/content'

/**
 * The portfolio as families: each platform with the add-ons built onto it, grouped by
 * sector. No time axis, so there are no empty years. Built only from content/data.json.
 */
const SECTORS = ['Software & Technology', 'Industrial Technology', 'Healthcare IT', 'Tech-Enabled Services']

export default function PortfolioFamilies() {
  return (
    <div className="space-y-12">
      {SECTORS.map((sector) => {
        const list = platforms.filter((p) => p.sector === sector)
        if (!list.length) return null
        return (
          <section key={sector} aria-label={sector} className="grid gap-6 lg:grid-cols-12">
            <h3 className="eyebrow self-start lg:col-span-3" data-reveal>
              {sector}
            </h3>
            <ul className="grid gap-px overflow-hidden border border-marble/10 bg-marble/10 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
              {list.map((p, i) => {
                const adds = addOnsOf(p.slug)
                return (
                  <li key={p.slug} className="flex flex-col bg-midnight p-6" data-reveal style={{ '--d': i % 3 } as CSSProperties}>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">
                      Platform{p.status === 'Realized' ? ' · Realized' : ''}
                    </p>
                    <Link href={`/portfolio/${p.slug}`} className="mt-3 font-serif text-[1.9rem] leading-none underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors hover:decoration-orange focus-visible:decoration-orange">
                      {p.name}
                    </Link>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-marble/70">{p.line}</p>
                    {adds.length > 0 && (
                      <div className="mt-auto pt-5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">Add-ons</p>
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {adds.map((a) => (
                            <li key={a.slug}>
                              <Link href={`/portfolio/${a.slug}`} className="text-[0.95rem] text-marble/85 underline decoration-marble/30 underline-offset-4 transition-colors hover:decoration-orange">
                                {a.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
