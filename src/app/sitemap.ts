import type { MetadataRoute } from 'next'
import { GENERIC_PAGES, SITE_URL, caseStudies, portfolio } from '@/lib/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    ...GENERIC_PAGES.map((p) => `/${p}`),
    '/portfolio',
    '/case-studies',
    '/team',
    '/news',
    '/contact',
    ...portfolio.map((c) => `/portfolio/${c.slug}`),
    ...caseStudies.map((c) => `/case-studies/${c.slug}`),
  ]
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }))
}
