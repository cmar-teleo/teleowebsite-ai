import type { CSSProperties } from 'react'
import { team, type Item } from '@/lib/content'

/**
 * The AI Committee as a hierarchy: the Head of AI leads, with his background shown in
 * full; the committee members sit beneath him. Names and roles come from the page copy,
 * photographs and biography from the team records.
 */
export default function AiCommittee({ items }: { items: Item[] }) {
  const people = items.map((it) => ({ role: it.kicker ?? '', person: team.find((p) => p.name === it.title), name: it.title ?? '' }))
  const [lead, ...members] = people

  return (
    <div className="mt-12">
      {/* the lead */}
      <article className="card grid gap-0 md:grid-cols-12" data-reveal>
        {lead.person?.bioPhoto && (
          <div className="md:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.person.bioPhoto} alt={`${lead.name}, ${lead.role}`} width={500} height={640} loading="lazy" className="block h-full w-full object-cover" />
          </div>
        )}
        <div className="p-7 md:col-span-8 md:p-10">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-orange">{lead.role}</p>
          <h3 className="mt-3 font-serif text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none">{lead.name}</h3>
          <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-marble/80">
            {lead.person?.bio.map((b, i) => <p key={i}>{b}</p>)}
          </div>
          {lead.person?.li && (
            <p className="mt-6">
              <a href={lead.person.li} target="_blank" rel="noopener noreferrer" className="link-arrow">
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </article>

      {/* the line of report */}
      <div className="mx-auto h-10 w-px bg-marble/25" aria-hidden="true" />
      <div className="mx-auto hidden h-px w-2/3 bg-marble/25 sm:block" aria-hidden="true" />

      {/* the committee */}
      <ul className="grid gap-5 sm:grid-cols-3">
        {members.map((m, i) => (
          <li key={m.name} className="flex flex-col" data-reveal style={{ '--d': i } as CSSProperties}>
            <div className="mx-auto hidden h-6 w-px bg-marble/25 sm:block" aria-hidden="true" />
            <div className="card flex flex-1 items-center gap-4 p-4">
              {m.person?.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.person.photo} alt={`${m.name}, ${m.role}`} width={500} height={460} loading="lazy" className="block h-auto w-24 shrink-0" />
              )}
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">{m.role}</p>
                <p className="mt-2 font-serif text-[1.5rem] leading-tight">{m.name}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
