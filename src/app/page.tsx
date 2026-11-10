import Link from 'next/link'
import type { CSSProperties } from 'react'
import HomeHero from '@/components/HomeHero'
import Reel from '@/components/Reel'
import PortfolioMap from '@/components/PortfolioMap'
import Metope from '@/components/visuals/Metope'
import { MetopeSvg } from '@/components/visuals/metopes'
import Arrow from '@/components/Arrow'
import { SectionHead } from '@/components/Sections'
import { caseStudies, news, pages } from '@/lib/content'
import { meta } from '@/lib/meta'

export const metadata = {
  ...meta('Empowering businesses to perform and execute', pages.home.description, '/', 'home'),
  title: { absolute: 'TELEO Capital | Empowering businesses to perform and execute' },
}

const d = (n: number) => ({ '--d': n }) as CSSProperties
const ORDER = ['paxia', 'industrial-defender', 'umt360']

export default function Home() {
  const why = pages.home.sections[1]
  const studies = ORDER.map((s) => caseStudies.find((c) => c.slug === s)!)

  return (
    <>
      <HomeHero />

      {/* ---------------------------------------------------------------- why TELEO */}
      <section className="relative py-28 md:py-36">
        <div className="wrap">
          <div className="max-w-3xl">
            <SectionHead eyebrow={why.eyebrow} heading={why.heading} />
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {why.items!.map((it, i) => (
              <Link key={it.title} href={it.href!} className="card group flex flex-col p-7" data-reveal style={d(i)}>
                <span className="font-mono text-[0.68rem] tracking-[0.22em] text-bronze-hi">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3 mt-10">{it.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-marble/75">{it.desc}</p>
                <p className="mt-auto pt-8">
                  <span className="link-arrow">
                    {it.cta} <Arrow />
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- selected work: a tracking shot */}
      <Reel
        count={studies.length}
        header={
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="h2 mt-5">Built into category leaders</h2>
          </div>
        }
      >
        {studies.map((c) => (
          <Link key={c.slug} href={`/case-studies/${c.slug}`} className="card group grid w-full shrink-0 gap-0 md:grid-cols-2 lg:w-[min(72vw,64rem)]">
            <Metope className="border-b border-marble/10 p-6 md:border-b-0 md:border-r">
              <MetopeSvg slug={c.slug} label={c.name} />
            </Metope>
            <div className="flex flex-col p-7 md:p-9">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-bronze-hi">{c.type} · Realized</p>
              <h3 className="mt-4 font-serif text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none">{c.name}</h3>
              <p className="mt-2 text-vein">{c.sector}</p>
              <p className="mt-5 text-marble/80">{c.card}</p>
              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-marble/10 pt-5 text-sm">
                <div>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">Headquarters</dt>
                  <dd className="mt-1">{c.hq}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">Hold Period</dt>
                  <dd className="mt-1">
                    {c.invested.split(' ').pop()} – {c.exited.split(' ').pop()}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">{c.stats[1][1] === 'Majority Recap' ? 'Structure' : 'Carved From'}</dt>
                  <dd className="mt-1">{c.stats[1][1] === 'Majority Recap' ? c.stats[1][1] : c.stats[2][1]}</dd>
                </div>
              </dl>
              <p className="mt-auto pt-8">
                <span className="link-arrow">
                  Read the case study <Arrow />
                </span>
              </p>
            </div>
          </Link>
        ))}
      </Reel>

      {/* ---------------------------------------------------------------- portfolio map */}
      <section className="py-28 md:py-36">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <SectionHead eyebrow="Portfolio" heading="Where we partner" ledes={['Platforms, add-ons, and realized investments across our four sectors. Select a company for detail.']} />
            </div>
            <Link href="/portfolio" className="btn shrink-0" data-reveal>
              View full portfolio <Arrow />
            </Link>
          </div>
          <div className="mt-14" data-reveal>
            <PortfolioMap />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- news */}
      <section className="border-t border-marble/10 py-28 md:py-36">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="News" heading="Recent announcements" />
            <div className="mt-8" data-reveal>
              <Link href="/news" className="link-arrow">
                All news <Arrow />
              </Link>
            </div>
          </div>
          <ul className="lg:col-span-8">
            {news.slice(0, 3).map((n, i) => (
              <li key={n.slug} data-reveal style={d(i)}>
                <a href={n.source} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-3 border-b border-marble/10 py-7 transition-colors hover:border-bronze md:flex-row md:items-baseline md:gap-10">
                  <span className="w-44 shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein">
                    {n.date}
                    <span className="mt-1 block text-bronze-hi">{n.cat}</span>
                  </span>
                  <span className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight transition-colors group-hover:text-bronze-hi">{n.title}</span>
                  <Arrow className="ml-auto hidden shrink-0 text-bronze-hi transition-transform duration-500 group-hover:translate-x-1 md:block" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
