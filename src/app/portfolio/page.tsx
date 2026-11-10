import Link from 'next/link'
import type { ReactNode } from 'react'
import PageHero from '@/components/PageHero'
import PortfolioGrid from '@/components/PortfolioGrid'
import PortfolioMap from '@/components/PortfolioMap'
import Arrow from '@/components/Arrow'
import { MetopeSvg } from '@/components/visuals/metopes'
import { company, pages, portfolio, visualSlug, visualVariant } from '@/lib/content'
import { meta } from '@/lib/meta'

const page = pages.portfolio
export const metadata = meta(page.title, page.description, '/portfolio', 'portfolio')

export default function PortfolioPage() {
  const hero = page.sections[0]
  const visuals: Record<string, ReactNode> = {}
  for (const c of portfolio) visuals[c.slug] = <MetopeSvg slug={visualSlug(c)} variant={visualVariant(c)} label={c.name} />
  const companies = portfolio.map((c) => ({ ...c, parentName: c.parent ? company(c.parent)?.name : undefined }))

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} ledes={hero.ledes} motif="columns" />

      <section className="py-20 md:py-28">
        <div className="wrap" data-reveal>
          <PortfolioMap />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <PortfolioGrid companies={companies} visuals={visuals} />
        </div>
      </section>

      <section className="pb-12">
        <div className="wrap">
          <Link href="/case-studies" className="card group flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-12" data-reveal>
            <div>
              <p className="eyebrow">Case Studies</p>
              <h2 className="h2 mt-4 max-w-2xl">A closer look at how we partner and create value</h2>
            </div>
            <span className="btn shrink-0">
              View Case Studies <Arrow />
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
