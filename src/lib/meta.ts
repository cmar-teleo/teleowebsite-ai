import type { Metadata } from 'next'

/** Per-page SEO + Open Graph. `og` is the file name (without .png) in public/og. */
export function meta(title: string, description: string, path: string, og: string): Metadata {
  const image = { url: `/og/${og}.png`, width: 1200, height: 630, alt: `${title} | TELEO Capital` }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: 'TELEO Capital', title: `${title} | TELEO Capital`, description, url: path, images: [image] },
    twitter: { card: 'summary_large_image', title: `${title} | TELEO Capital`, description, images: [image.url] },
  }
}
