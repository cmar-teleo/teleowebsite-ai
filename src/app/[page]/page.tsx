import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import Sections from '@/components/Sections'
import CarveOutDiagram from '@/components/CarveOutDiagram'
import { CommunityList, TsaCompare } from '@/components/Extras'
import type { Motif } from '@/components/PageHero'
import { GENERIC_PAGES, pages } from '@/lib/content'
import { meta } from '@/lib/meta'

type Slug = (typeof GENERIC_PAGES)[number]

export const dynamicParams = false
export function generateStaticParams() {
  return GENERIC_PAGES.map((page) => ({ page }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const p = pages[page]
  if (!p) return {}
  return meta(p.title, p.description, `/${page}`, page)
}

/** Which classical motif opens each page. */
const MOTIF: Record<Slug, Motif> = {
  firm: 'arc',
  culture: 'laurel',
  responsibility: 'laurel',
  strategy: 'columns',
  criteria: 'meander',
  sellers: 'columns',
  bankers: 'meander',
  ai: 'code',
  privacy: 'none',
  terms: 'none',
}

const Diagram = ({ phases }: { phases: string[] }) => (
  <section className="pb-24 md:pb-32">
    <div className="wrap">
      <div className="border border-marble/10 bg-obsidian/40 p-6 md:p-12" data-reveal>
        <CarveOutDiagram phases={phases} />
      </div>
    </div>
  </section>
)

/** Page-specific inserts, keyed by the index of the section they follow. */
const SLOTS: Partial<Record<Slug, Record<number, ReactNode>>> = {
  firm: { 5: <CommunityList /> },
  responsibility: { 2: <CommunityList full /> },
  strategy: { 1: <Diagram phases={['Separation', 'Transition services', 'Stand-up to independent operations']} /> },
  sellers: {
    3: (
      <>
        <TsaCompare />
        <Diagram phases={['Diligence & Bid', 'Exclusivity', 'Post-Close']} />
      </>
    ),
  },
}

export default async function GenericPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const p = pages[page]
  if (!p || !GENERIC_PAGES.includes(page as Slug)) notFound()
  return <Sections sections={p.sections} motif={MOTIF[page as Slug]} slots={SLOTS[page as Slug]} />
}
