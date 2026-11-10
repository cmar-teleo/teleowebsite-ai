import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import type { Item, Section } from '@/lib/content'
import PageHero, { type Motif } from './PageHero'
import Arrow from './Arrow'
import ContactBand from './ContactBand'
import ThreePs from './ThreePs'
import AiCommittee from './AiCommittee'

const d = (n: number) => ({ '--d': n }) as CSSProperties
const external = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

export function Cta({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  const cls = `btn ${primary ? 'btn--primary' : ''}`
  const inner = (
    <>
      {label} <Arrow />
    </>
  )
  return external(href) ? (
    <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function SectionHead({ eyebrow, heading, ledes, center = false }: { eyebrow?: string; heading?: string; ledes?: string[]; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : ''}>
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2 className="h2 mt-5" data-reveal="mask">
          {heading}
        </h2>
      )}
      {ledes?.map((l, i) => (
        <p key={i} className="lede mt-6" data-reveal style={d(i + 1)}>
          {l}
        </p>
      ))}
    </div>
  )
}

function ItemCard({ item, i, compact }: { item: Item; i: number; compact: boolean }) {
  const body = (
    <div className={`flex h-full flex-col ${compact ? 'p-6' : 'p-7 md:p-8'}`}>
      {(item.num || item.kicker) && <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-bronze-hi">{item.num ?? item.kicker}</p>}
      {item.title && <h3 className={`h3 ${item.num || item.kicker ? 'mt-4' : ''}`}>{item.title}</h3>}
      {item.desc && <p className="mt-3 text-[0.97rem] leading-relaxed text-marble/75">{item.desc}</p>}
      {item.cta && (
        <p className="mt-auto pt-7">
          <span className="link-arrow">
            {item.cta} <Arrow />
          </span>
        </p>
      )}
    </div>
  )
  const primary = item.kicker === 'Primary Focus'
  return item.href ? (
    <Link href={item.href} className={`card h-full ${primary ? 'card--primary' : ''}`} data-reveal style={d(i)}>
      {body}
    </Link>
  ) : (
    <div className="card h-full" data-reveal style={d(i)}>
      {body}
    </div>
  )
}

function Body({ s }: { s: Section }) {
  const items = s.items ?? []
  const titleOnly = items.length > 0 && items.every((it) => !it.desc && !it.kicker && !it.num)
  const cols = items.length >= 4 && items.length !== 5 && items.length !== 6 ? 'sm:grid-cols-2 xl:grid-cols-4' : items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
  return (
    <>
      {s.layout === 'orbit' && <ThreePs items={items} />}
      {s.layout === 'committee' && <AiCommittee items={items} />}
      {!s.layout &&
        items.length > 0 &&
        (titleOnly ? (
          <ul className="mt-12 grid gap-px overflow-hidden border border-marble/10 bg-marble/10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-4 bg-midnight p-6" data-reveal style={d(i)}>
                <span className="font-mono text-[0.68rem] tracking-[0.2em] text-bronze-hi">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif text-xl">{it.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`mt-12 grid gap-5 ${cols}`}>
            {items.map((it, i) => (
              <ItemCard key={i} item={it} i={i} compact={items.length > 3} />
            ))}
          </div>
        ))}

      {s.lists && (
        <div className="mt-12 grid gap-px overflow-hidden border border-marble/10 bg-marble/10 sm:grid-cols-2 lg:grid-cols-4">
          {s.lists.map((l, i) => (
            <div key={l.label} className="bg-midnight p-7" data-reveal style={d(i)}>
              <h3 className="eyebrow">{l.label}</h3>
              <ul className="mt-6 space-y-3">
                {l.items.map((x) => (
                  <li key={x} className="border-b border-marble/10 pb-3 font-serif text-[1.2rem] leading-snug last:border-0">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {s.notes?.map((n, i) => (
        <p key={i} className="muted mt-8 max-w-3xl text-sm" data-reveal>
          {n}
        </p>
      ))}

      {s.ctas && (
        <div className="mt-10 flex flex-wrap gap-4" data-reveal>
          {s.ctas.map((c, i) => (
            <Cta key={c.href + c.label} href={c.href} label={c.label} primary={i === 0 && /apply|submit|start/i.test(c.label)} />
          ))}
        </div>
      )}
    </>
  )
}

/** Renders a page's copy-driven sections. `slots[i]` is injected after section i; `replace[i]` swaps a section's body. */
export default function Sections({ sections, motif = 'arc', slots = {}, heroExtra }: { sections: Section[]; motif?: Motif; slots?: Record<number, ReactNode>; heroExtra?: ReactNode }) {
  return (
    <>
      {sections.map((s, idx) => {
        let node: ReactNode = null
        const empty = !s.items && !s.ledes && !s.lists && !s.stats && !s.prose && !s.ctas && !s.notes

        if (s.kind === 'hero') {
          node = (
            <PageHero eyebrow={s.eyebrow} heading={s.heading} ledes={s.ledes} motif={motif}>
              {s.ctas?.map((c) => <Cta key={c.href} href={c.href} label={c.label} primary />)}
              {heroExtra}
            </PageHero>
          )
        } else if (s.kind === 'contact') {
          node = <ContactBand />
        } else if (s.stats) {
          node = (
            <section className="border-y border-marble/10 bg-obsidian/50">
              <dl className="wrap grid gap-10 py-14 sm:grid-cols-3">
                {s.stats.map((st, i) => (
                  <div key={st.label} data-reveal style={d(i)}>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-vein">
                      {st.pre} <span className="sr-only">{st.label}</span>
                    </dt>
                    <dd className="mt-2 font-serif text-[clamp(3rem,6vw,5rem)] leading-none text-marble">{st.value}</dd>
                    <dd className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-bronze-hi" aria-hidden="true">
                      {st.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )
        } else if (s.kind === 'band') {
          node = (
            <section className="relative overflow-hidden py-32 md:py-44">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze/60 to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bronze/20" data-parallax="0.2" />
                <div className="absolute left-1/2 top-1/2 h-[44vmin] w-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-marble/10" data-parallax="0.45" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(237,230,218,0.06),transparent_70%)]" />
              </div>
              <div className="wrap-narrow relative text-center" data-pushin>
                {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
                <h2 className="display mt-6 !text-[clamp(2.4rem,5.6vw,5rem)]">{s.heading}</h2>
                {s.ledes?.map((l, i) => (
                  <p key={i} className="lede mx-auto mt-7 max-w-2xl">
                    {l}
                  </p>
                ))}
                {s.ctas && (
                  <div className="mt-10 flex justify-center gap-4">
                    {s.ctas.map((c) => <Cta key={c.href} href={c.href} label={c.label} />)}
                  </div>
                )}
              </div>
            </section>
          )
        } else if (s.prose) {
          node = (
            <section className="wrap-narrow prose-legal py-20">
              {(() => {
                const out: ReactNode[] = []
                let list: string[] = []
                const flush = () => {
                  if (list.length) out.push(<ul key={`ul-${out.length}`}>{list.map((x, i) => <li key={i}>{x}</li>)}</ul>)
                  list = []
                }
                s.prose!.forEach((b, i) => {
                  if (b.t === 'li') return void list.push(b.text)
                  flush()
                  out.push(b.t === 'h' ? <h2 key={i}>{b.text}</h2> : <p key={i}>{b.href ? <a href={b.href}>{b.text}</a> : b.text}</p>)
                })
                flush()
                return out
              })()}
            </section>
          )
        } else if (!empty) {
          const statement = !s.items && !s.lists
          node = (
            <section className="py-24 md:py-32">
              <div className="wrap">
                {statement ? (
                  <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                      {s.eyebrow && (
                        <p className="eyebrow" data-reveal>
                          {s.eyebrow}
                        </p>
                      )}
                    </div>
                    <div className="lg:col-span-8">
                      <h2 className="h2" data-reveal="mask">
                        {s.heading}
                      </h2>
                      {s.ledes?.map((l, i) => (
                        <p key={i} className="lede mt-7 max-w-3xl" data-reveal style={d(i + 1)}>
                          {l}
                        </p>
                      ))}
                      <Body s={s} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-w-3xl">
                      <SectionHead eyebrow={s.eyebrow} heading={s.heading} ledes={s.ledes} />
                    </div>
                    <Body s={s} />
                  </>
                )}
              </div>
            </section>
          )
        }
        return (
          <div key={idx}>
            {node}
            {slots[idx]}
          </div>
        )
      })}
    </>
  )
}
