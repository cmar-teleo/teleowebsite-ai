import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import Arrow from '@/components/Arrow'
import { CaseFootnote } from '@/components/Extras'
import Metope from '@/components/visuals/Metope'
import { MetopeSvg } from '@/components/visuals/metopes'
import { caseStudies } from '@/lib/content'
import { meta } from '@/lib/meta'

export const dynamicParams = false
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = caseStudies.find((x) => x.slug === slug)
  if (!c) return {}
  return meta(`${c.name} Case Study`, c.card, `/case-studies/${c.slug}`, `case-${c.slug}`)
}

const DISCLAIMER =
  "Past performance is not indicative of future results. This case study is provided for illustrative purposes only and does not represent all investments made by TELEO Capital; it may not be representative of the firm's overall portfolio or results, and a complete list of investments is available upon request. There can be no assurance that future investments will achieve comparable results or be profitable. Nothing herein constitutes an offer to sell or a solicitation of an offer to buy any security."

const d = (n: number) => ({ '--d': n }) as CSSProperties

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-marble/10 py-16 md:py-20">
      <div className="wrap grid gap-8 lg:grid-cols-12">
        <h2 className="eyebrow self-start lg:col-span-3" data-reveal>
          {label}
        </h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}

function Pairs({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2">
      {items.map(([k, v], i) => (
        <div key={k} className="border-t border-bronze/40 pt-5" data-reveal style={d(i % 2)}>
          <dt className="font-serif text-2xl">{k}</dt>
          <dd className="mt-3 text-marble/75">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = caseStudies.find((x) => x.slug === slug)
  if (!c) notFound()

  return (
    <article>
      <section className="grain relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+3.5rem)] md:pb-24">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">
            <Link href="/case-studies" className="hover:text-marble">
              Case Studies
            </Link>
            <span className="mx-3 text-bronze">/</span>
            <span aria-current="page">{c.name}</span>
          </nav>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow" data-reveal>
                {c.type}
              </p>
              <h1 className="display mt-6" data-reveal="mask">
                {c.name}
              </h1>
              <p className="mt-4 text-lg text-vein" data-reveal>
                {c.sector} · {c.hq}
              </p>
              <p className="lede mt-7 max-w-xl" data-reveal>
                {c.card}
              </p>
              <CaseFootnote className="mt-4 max-w-xl" />
            </div>
            <div className="lg:col-span-6" data-pushin>
              <Metope className="border border-marble/10 bg-obsidian/50 p-5 md:p-8">
                <MetopeSvg slug={c.slug} label={c.name} />
              </Metope>
            </div>
          </div>
          <dl className="mt-14 grid gap-px overflow-hidden border border-marble/10 bg-marble/10 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {c.stats.map(([k, v]) => (
              <div key={k} className="bg-midnight p-6">
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-vein">{k}</dt>
                <dd className="mt-2 font-serif text-xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Row label="Overview">
        <p className="font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.3]" data-reveal>
          {c.fact}
        </p>
      </Row>

      <Row label="Transaction Highlights">
        <p className="lede max-w-3xl" data-reveal>
          {c.highlight}
        </p>
        <div className="mt-12">
          <Pairs items={c.merits} />
        </div>
      </Row>

      <Row label="Value Creation">
        <ol className="mb-12 grid gap-px overflow-hidden border border-marble/10 bg-marble/10 md:grid-cols-3">
          {(['people', 'product', 'process'] as const).map((k, i) => (
            <li key={k} className="bg-midnight p-7" data-reveal style={d(i)}>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-bronze-hi">
                {String(i + 1).padStart(2, '0')} · {k}
              </p>
              <p className="mt-4 text-marble/80">{c.ps[k]}</p>
            </li>
          ))}
        </ol>
        <Pairs items={c.value} />
      </Row>

      <Row label="Outcomes">
        <p className="font-serif text-[clamp(1.4rem,2.1vw,1.9rem)] leading-[1.35]" data-reveal>
          {c.outcome}
        </p>
        <div className="mt-12">
          <Pairs items={c.results} />
        </div>
        <CaseFootnote className="mt-8" />
      </Row>

      <section className="border-t border-marble/10 py-12">
        <div className="wrap">
          <Link href="/case-studies" className="btn">
            All case studies <Arrow />
          </Link>
          <p className="muted mt-10 max-w-5xl text-[0.8rem] leading-relaxed">{DISCLAIMER}</p>
        </div>
      </section>
    </article>
  )
}
