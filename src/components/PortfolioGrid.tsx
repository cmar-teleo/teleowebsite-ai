'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import type { Company } from '@/lib/content'
import Metope from './visuals/Metope'

type Card = Company & { parentName?: string }

const FILTERS = ['All', 'Platforms', 'Add-ons', 'Active', 'Realized'] as const

/** Filterable portfolio index. Visuals are rendered on the server and passed in by slug. */
export default function PortfolioGrid({ companies, visuals }: { companies: Card[]; visuals: Record<string, ReactNode> }) {
  const sectors = useMemo(() => ['All sectors', ...Array.from(new Set(companies.map((c) => c.sector)))], [companies])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [sector, setSector] = useState('All sectors')

  const shown = companies.filter((c) => {
    if (sector !== 'All sectors' && c.sector !== sector) return false
    if (filter === 'Platforms') return c.type === 'Platform'
    if (filter === 'Add-ons') return c.type === 'Add-on'
    if (filter === 'Active' || filter === 'Realized') return c.status === filter
    return true
  })

  const chip = (on: boolean) =>
    `px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] border transition-colors duration-300 ${
      on ? 'border-bronze bg-bronze text-midnight' : 'border-marble/15 text-marble/75 hover:border-marble/50 hover:text-marble'
    }`

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by type or status" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} type="button" className={chip(filter === f)} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filter by sector" className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button key={s} type="button" className={chip(sector === s)} aria-pressed={sector === s} onClick={() => setSector(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'company' : 'companies'}
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => (
          <li key={c.slug}>
            <Link href={`/portfolio/${c.slug}`} className="card group flex h-full flex-col">
              <Metope className="border-b border-marble/10 p-4">{visuals[c.slug]}</Metope>
              <div className="flex flex-1 flex-col p-6">
                <p className="flex flex-wrap gap-x-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">
                  <span className="text-bronze-hi">{c.type}</span>
                  <span>{c.status}</span>
                  <span>{c.year}</span>
                </p>
                <h2 className="mt-3 font-serif text-[1.9rem] leading-none transition-colors duration-300 group-hover:text-bronze-hi">{c.name}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-marble/75">{c.line}</p>
                <p className="mt-auto pt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">
                  {c.parentName ? `Add-on to ${c.parentName}` : c.sector}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="muted mt-10">No companies match these filters.</p>}
    </div>
  )
}
