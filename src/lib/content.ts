import data from '../../content/data.json'
import pagesJson from '../../content/pages.json'

/* ------------------------------------------------------------------ types */
export type Item = { num?: string; kicker?: string; title?: string; desc?: string; href?: string; cta?: string }
export type Section = {
  kind: 'hero' | 'band' | 'section' | 'contact'
  eyebrow?: string
  heading?: string
  ledes?: string[]
  items?: Item[]
  lists?: { label: string; items: string[] }[]
  stats?: { pre: string; value: string; label: string }[]
  ctas?: { label: string; href: string }[]
  notes?: string[]
  prose?: { t: 'h' | 'p' | 'li'; text: string; href?: string }[]
}
export type Page = { title: string; description: string; sections: Section[] }

export type Company = {
  slug: string
  name: string
  sector: string
  type: 'Platform' | 'Add-on'
  status: 'Active' | 'Realized'
  year: number
  line: string
  summary: string
  txn: string
  date: string
  from: string
  caseStudy: string | null
  parent?: string
}
export type CaseStudy = {
  slug: string
  name: string
  sector: string
  type: string
  hq: string
  invested: string
  exited: string
  card: string
  fact: string
  stats: [string, string][]
  highlight: string
  merits: [string, string][]
  value: [string, string][]
  outcome: string
  results: [string, string][]
  ps: { people: string; product: string; process: string }
}
export type Person = { group: string; name: string; role: string; li?: string; bio: string[]; photo?: string; bioPhoto?: string }
export type NewsItem = { date: string; slug: string; cat: string; title: string; summary: string; source?: string; external?: boolean }
export type Org = { name: string; url: string; desc: string }

/* ------------------------------------------------------------------ data */
export const firm = data.firm
export const portfolio = data.portfolio as Company[]
export const caseStudies = data.caseStudies as unknown as CaseStudy[]
export const team = data.team as Person[]
export const news = data.news as NewsItem[]
export const community = data.community as Org[]
export const pages = pagesJson as unknown as Record<string, Page>

export const SITE_URL = 'https://teleocapital.com'
export const TURNSTILE_SITEKEY = '0x4AAAAAAFxWKPU-La6QU3Ni'

export const company = (slug: string) => portfolio.find((c) => c.slug === slug)
export const platforms = portfolio.filter((c) => c.type === 'Platform')
export const addOnsOf = (slug: string) => portfolio.filter((c) => c.parent === slug)
/** The slug whose visual a company uses: its own for platforms, its platform's for add-ons. */
export const visualSlug = (c: Company) => c.parent ?? c.slug
/** Add-ons render a variation (1, 2, 3…) of the platform visual. */
export const visualVariant = (c: Company) => (c.parent ? addOnsOf(c.parent).findIndex((a) => a.slug === c.slug) + 1 : 0)

/* ------------------------------------------------------------------ navigation */
export const NAV = [
  {
    label: 'Firm',
    href: '/firm',
    children: [
      { label: 'The Firm', href: '/firm', note: 'The meaning behind the name' },
      { label: 'Culture', href: '/culture', note: 'We take pride in our people' },
      { label: 'Responsibility', href: '/responsibility', note: 'Responsible investing, rooted in community' },
    ],
  },
  {
    label: 'Approach',
    href: '/strategy',
    children: [
      { label: 'Strategy', href: '/strategy', note: 'Built for complexity' },
      { label: 'Investment Criteria', href: '/criteria', note: 'What fits our thesis' },
      { label: 'For Corporate Sellers', href: '/sellers', note: 'A trusted home for your non-core division' },
      { label: 'For Investment Bankers', href: '/bankers', note: 'What to send us' },
      { label: 'Artificial Intelligence', href: '/ai', note: 'AI across the stack' },
    ],
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    children: [
      { label: 'Portfolio', href: '/portfolio', note: 'Where we partner' },
      { label: 'Case Studies', href: '/case-studies', note: 'Select investments' },
    ],
  },
  { label: 'Team', href: '/team' },
  { label: 'News', href: '/news' },
] as const

/** Generic, copy-driven pages rendered by app/[page]. */
export const GENERIC_PAGES = ['firm', 'culture', 'responsibility', 'strategy', 'criteria', 'sellers', 'bankers', 'ai', 'privacy', 'terms'] as const
