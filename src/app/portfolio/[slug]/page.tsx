import Link from 'next/link'
import { notFound } from 'next/navigation'
import Arrow from '@/components/Arrow'
import Metope from '@/components/visuals/Metope'
import { MetopeSvg } from '@/components/visuals/metopes'
import { addOnsOf, company, portfolio, visualSlug, visualVariant } from '@/lib/content'
import { meta } from '@/lib/meta'

export const dynamicParams = false
export function generateStaticParams() {
  return portfolio.map((c) => ({ slug: c.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = company(slug)
  if (!c) return {}
  return meta(c.name, c.line, `/portfolio/${c.slug}`, `portfolio-${c.slug}`)
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = company(slug)
  if (!c) notFound()
  const parent = c.parent ? company(c.parent) : undefined
  const addOns = addOnsOf(c.slug)
  const idx = portfolio.findIndex((x) => x.slug === c.slug)
  const next = portfolio[(idx + 1) % portfolio.length]
  const prev = portfolio[(idx - 1 + portfolio.length) % portfolio.length]

  const facts: [string, string][] = [
    ['Sector', c.sector],
    ['Type', c.type],
    ['Status', c.status],
    ['Transaction', c.txn],
    ['Date', c.date],
    ['Acquired from', c.from],
  ]

  return (
    <article>
      <section className="grain relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+3.5rem)] md:pb-24">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">
            <Link href="/portfolio" className="hover:text-marble">
              Portfolio
            </Link>
            <span className="mx-3 text-bronze">/</span>
            <span aria-current="page">{c.name}</span>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow" data-reveal>
                {c.type} · {c.status}
              </p>
              <h1 className="display mt-6" data-reveal="mask">
                {c.name}
              </h1>
              <p className="lede mt-7" data-reveal>
                {c.line}
              </p>
            </div>
            <div className="lg:col-span-7" data-pushin>
              <Metope className="border border-marble/10 bg-obsidian/50 p-5 md:p-8">
                <MetopeSvg slug={visualSlug(c)} variant={visualVariant(c)} label={c.name} />
              </Metope>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-marble/10 py-20 md:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Overview
            </p>
            <p className="mt-6 font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.3]" data-reveal>
              {c.summary}
            </p>

            {(parent || addOns.length > 0) && (
              <div className="mt-14" data-reveal>
                <p className="eyebrow">{parent ? 'Platform' : 'Add-on acquisitions'}</p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {(parent ? [parent] : addOns).map((o) => (
                    <li key={o.slug}>
                      <Link href={`/portfolio/${o.slug}`} className="card group block p-6">
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">
                          {o.type} · {o.year}
                        </span>
                        <span className="mt-2 block font-serif text-2xl transition-colors group-hover:text-bronze-hi">{o.name}</span>
                        <span className="mt-2 block text-sm text-marble/70">{o.line}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.caseStudy && (
              <div className="mt-12" data-reveal>
                <Link href={`/case-studies/${c.caseStudy}`} className="btn">
                  Read the case study <Arrow />
                </Link>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Investment details">
            <dl className="border-t border-bronze/50" data-reveal>
              {facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-marble/10 py-4">
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">{k}</dt>
                  <dd className="text-right font-serif text-xl">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <nav aria-label="More companies" className="border-t border-marble/10">
        <div className="wrap grid sm:grid-cols-2">
          <Link href={`/portfolio/${prev.slug}`} className="group py-10 sm:border-r sm:border-marble/10 sm:pr-8">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">Previous</span>
            <span className="mt-2 block font-serif text-3xl transition-colors group-hover:text-bronze-hi">{prev.name}</span>
          </Link>
          <Link href={`/portfolio/${next.slug}`} className="group py-10 sm:pl-8 sm:text-right">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">Next</span>
            <span className="mt-2 block font-serif text-3xl transition-colors group-hover:text-bronze-hi">{next.name}</span>
          </Link>
        </div>
      </nav>
    </article>
  )
}
