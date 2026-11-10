import { addOnsOf, caseStudies, platforms } from '@/lib/content'

/**
 * PORTFOLIO MAP: every platform as a row, placed at the year TELEO invested, with each
 * add-on threaded to its platform at the year it joined. Built only from facts in
 * content/data.json (year, parent, status). No performance data.
 */
const Y0 = 2019
const Y1 = 2026
const LEFT = 190
const RIGHT = 960
const ROW = 34
const TOP = 56

export default function PortfolioMap() {
  const rows = [...platforms].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
  const x = (year: number) => LEFT + ((year - Y0) / (Y1 - Y0)) * (RIGHT - LEFT)
  const H = TOP + rows.length * ROW + 30

  return (
    <figure>
      <div className="overflow-x-auto pb-2">
        <svg viewBox={`0 0 1000 ${H}`} className="h-auto w-full min-w-[720px]" role="img" aria-labelledby="pm-title pm-desc" fill="none">
          <title id="pm-title">Portfolio map</title>
          <desc id="pm-desc">
            Each platform company is a row placed at the year TELEO invested. Add-on acquisitions are threaded to their platform at the year they joined.{' '}
            {rows.map((p) => `${p.name}, ${p.year}${addOnsOf(p.slug).length ? `, with add-ons ${addOnsOf(p.slug).map((a) => `${a.name} ${a.year}`).join(', ')}` : ''}.`).join(' ')}
          </desc>
          {/* year axis */}
          {Array.from({ length: Y1 - Y0 + 1 }, (_, i) => (
            <g key={i}>
              <line x1={x(Y0 + i)} y1={TOP - 14} x2={x(Y0 + i)} y2={H - 20} stroke="var(--color-marble)" strokeOpacity="0.07" />
              <text x={x(Y0 + i)} y={TOP - 24} textAnchor="middle" fill="var(--color-vein)" fontSize="10" letterSpacing="2" fontFamily="var(--font-mono)">
                {Y0 + i}
              </text>
            </g>
          ))}
          {rows.map((p, r) => {
            const y = TOP + r * ROW + 10
            const adds = addOnsOf(p.slug).sort((a, b) => a.year - b.year)
            const exit = caseStudies.find((c) => c.slug === p.caseStudy)?.exited.split(' ').pop()
            const last = Math.max(p.year, ...adds.map((a) => a.year), exit ? Number(exit) : 0)
            const active = p.status === 'Active'
            return (
              <a key={p.slug} href={`/portfolio/${p.slug}`} className="group/row" aria-label={`${p.name}, ${p.line}`}>
                <rect x="0" y={y - ROW / 2} width="1000" height={ROW} fill="var(--color-marble)" className="opacity-0 transition-opacity duration-300 group-hover/row:opacity-[0.04] group-focus-visible/row:opacity-[0.06]" />
                <text x={LEFT - 22} y={y + 4} textAnchor="end" fill="var(--color-marble)" fontSize="13" fontFamily="var(--font-serif)" className="transition-[fill] duration-300 group-hover/row:fill-[var(--color-bronze-hi)]">
                  {p.name}
                </text>
                <line x1={x(p.year)} y1={y} x2={active ? RIGHT : x(last)} y2={y} stroke="var(--color-bronze)" strokeOpacity={active ? 0.55 : 0.3} strokeDasharray={active ? undefined : '2 5'} />
                {/* platform marker: a column capital */}
                <rect x={x(p.year) - 5} y={y - 8} width="10" height="16" fill="var(--color-midnight)" stroke="var(--color-bronze-hi)" strokeWidth="1.3" />
                {adds.map((a, k) => {
                  const ax = x(a.year) + (adds.filter((b, j) => j < k && b.year === a.year).length + (a.year === p.year ? 1 : 0)) * 14
                  return (
                    <g key={a.slug}>
                      <circle cx={ax} cy={y} r="4.5" fill="var(--color-midnight)" stroke="var(--color-marble)" strokeWidth="1.2" />
                      <text x={ax} y={y - 9} textAnchor="middle" fill="var(--color-vein)" fontSize="8" letterSpacing="1" fontFamily="var(--font-mono)" className="opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 group-focus-visible/row:opacity-100">
                        {a.name.toUpperCase()}
                      </text>
                    </g>
                  )
                })}
                {active && <circle cx={RIGHT} cy={y} r="2.2" fill="var(--color-marble)" />}
              </a>
            )
          })}
        </svg>
      </div>
      <figcaption className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-vein">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-2 border border-bronze-hi" /> Platform, at year of investment
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-marble" /> Add-on
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-bronze" /> Active
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-px w-6 border-t border-dashed border-bronze" /> Realized
        </span>
      </figcaption>
    </figure>
  )
}
