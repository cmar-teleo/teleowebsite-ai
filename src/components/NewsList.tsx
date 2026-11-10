'use client'

import { useMemo, useState } from 'react'
import type { NewsItem } from '@/lib/content'
import Arrow from './Arrow'

export default function NewsList({ news }: { news: NewsItem[] }) {
  const cats = useMemo(() => ['All', ...Array.from(new Set(news.map((n) => n.cat)))], [news])
  const years = useMemo(() => ['All', ...Array.from(new Set(news.map((n) => n.date.split(', ').pop()!)))], [news])
  const [cat, setCat] = useState('All')
  const [year, setYear] = useState('All')
  const shown = news.filter((n) => (cat === 'All' || n.cat === cat) && (year === 'All' || n.date.endsWith(year)))

  const chip = (on: boolean) =>
    `px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] border transition-colors duration-300 ${
      on ? 'border-bronze bg-bronze text-midnight' : 'border-marble/15 text-marble/75 hover:border-marble/50 hover:text-marble'
    }`

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-vein">Filter by category</p>
          <div role="group" aria-label="Filter by category" className="mt-3 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} type="button" className={chip(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-vein">Filter by year</p>
          <div role="group" aria-label="Filter by year" className="mt-3 flex flex-wrap gap-2">
            {years.map((y) => (
              <button key={y} type="button" className={chip(year === y)} aria-pressed={year === y} onClick={() => setYear(y)}>
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-12 border-t border-marble/10" aria-live="polite">
        {shown.map((n) => (
          <li key={n.slug}>
            <a
              href={n.source}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-3 border-b border-marble/10 py-8 transition-colors duration-500 hover:border-bronze md:grid-cols-12 md:gap-8"
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein md:col-span-3">
                {n.date}
                <span className="mt-1 block text-bronze-hi">{n.cat}</span>
              </span>
              <span className="md:col-span-8">
                <span className="block font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight transition-colors group-hover:text-bronze-hi">{n.title}</span>
                <span className="mt-3 block max-w-3xl text-marble/70">{n.summary}</span>
              </span>
              <span className="hidden justify-end md:col-span-1 md:flex">
                <Arrow className="-rotate-45 text-bronze-hi transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="muted mt-10 text-center">No items match these filters.</p>}
    </div>
  )
}
