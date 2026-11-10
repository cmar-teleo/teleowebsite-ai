import Link from 'next/link'
import type { CSSProperties } from 'react'
import PageHero from '@/components/PageHero'
import Arrow from '@/components/Arrow'
import { CaseFootnote } from '@/components/Extras'
import Metope from '@/components/visuals/Metope'
import { MetopeSvg } from '@/components/visuals/metopes'
import { caseStudies, pages } from '@/lib/content'
import { meta } from '@/lib/meta'

const page = pages['case-studies']
export const metadata = meta(page.title, page.description, '/case-studies', 'case-studies')
const ORDER = ['paxia', 'industrial-defender', 'umt360']

export default function CaseStudies() {
  const hero = page.sections[0]
  const list = ORDER.map((s) => caseStudies.find((c) => c.slug === s)!)
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} ledes={hero.ledes} motif="arc" />
      <section className="py-20 md:py-28">
        <ul className="wrap grid gap-8">
          {list.map((c, i) => (
            <li key={c.slug} data-reveal style={{ '--d': i } as CSSProperties}>
              <Link href={`/case-studies/${c.slug}`} className="card group grid md:grid-cols-12">
                <Metope className="border-b border-marble/10 p-6 md:col-span-5 md:border-b-0 md:border-r">
                  <MetopeSvg slug={c.slug} label={c.name} />
                </Metope>
                <div className="flex flex-col p-8 md:col-span-7 md:p-12">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-bronze-hi">
                    {c.type} · {c.invested} to {c.exited}
                  </p>
                  <h2 className="mt-4 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none">{c.name}</h2>
                  <p className="mt-2 text-vein">{c.sector}</p>
                  <p className="lede mt-6 max-w-xl">{c.card}</p>
                  <CaseFootnote className="mt-3 max-w-xl" />
                  <p className="mt-auto pt-10">
                    <span className="link-arrow">
                      Read the case study <Arrow />
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="pb-8">
        <p className="wrap muted max-w-5xl text-[0.8rem] leading-relaxed">{page.sections[1].notes?.[0]}</p>
      </section>
    </>
  )
}
