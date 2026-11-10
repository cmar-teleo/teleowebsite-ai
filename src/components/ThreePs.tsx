import type { Item } from '@/lib/content'

/**
 * Value creation as an orbit: People, Product and Process each sit on their own ring
 * around a single centre, as on the earlier site, drawn in this site's line and type.
 * On small screens the rings sit above a plain numbered list.
 */
const PLACE = [
  // ring radius (of 200), angle in degrees, where the caption sits on large screens
  { r: 190, a: 208, box: 'lg:left-0 lg:top-[6%] lg:text-right', align: 'lg:items-end' },
  { r: 132, a: 338, box: 'lg:right-0 lg:top-[20%]', align: '' },
  { r: 74, a: 118, box: 'lg:left-[2%] lg:bottom-[2%] lg:text-right', align: 'lg:items-end' },
]

export default function ThreePs({ items }: { items: Item[] }) {
  const pts = PLACE.map((p) => ({ x: 200 + Math.cos((p.a * Math.PI) / 180) * p.r, y: 200 + Math.sin((p.a * Math.PI) / 180) * p.r }))
  return (
    <div className="relative mx-auto mt-14 max-w-5xl lg:min-h-[34rem]" data-reveal>
      <div className="mx-auto w-full max-w-[22rem] lg:absolute lg:left-1/2 lg:top-1/2 lg:max-w-[27rem] lg:-translate-x-1/2 lg:-translate-y-1/2" role="img" aria-label="The three Ps of a TELEO deal: People, Product, and Process, on concentric rings.">
        <svg viewBox="0 0 400 400" fill="none" className="h-auto w-full overflow-visible">
          <circle cx="200" cy="200" r="190" stroke="var(--color-marble)" strokeOpacity="0.22" />
          <circle cx="200" cy="200" r="132" stroke="var(--color-marble)" strokeOpacity="0.32" strokeDasharray="2 7" className="orbit-spin" />
          <circle cx="200" cy="200" r="74" stroke="var(--color-marble)" strokeOpacity="0.45" />
          <circle cx="200" cy="200" r="7" fill="var(--color-orange)" />
          <circle cx="200" cy="200" r="20" stroke="var(--color-orange)" strokeOpacity="0.5" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="16" fill="var(--color-midnight)" stroke="var(--color-marble)" strokeOpacity="0.7" />
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fill="var(--color-marble)" fontSize="12" fontFamily="var(--font-mono)">
                {items[i]?.num}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ol className="mt-10 grid gap-8 sm:grid-cols-3 lg:mt-0 lg:block">
        {items.slice(0, 3).map((it, i) => (
          <li key={it.title} className={`flex flex-col lg:absolute lg:w-[17rem] ${PLACE[i].box} ${PLACE[i].align}`}>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-vein">{it.num}</p>
            <h3 className="mt-2 font-serif text-[2rem] leading-none">{it.title}</h3>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-marble/75">{it.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
