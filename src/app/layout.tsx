import type { Metadata, Viewport } from 'next'
import { Cormorant, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SiteArc from '@/components/SiteArc'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL, firm, pages } from '@/lib/content'

const cormorant = Cormorant({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'TELEO Capital | Empowering businesses to perform and execute', template: '%s | TELEO Capital' },
  description: pages.home.description,
  openGraph: {
    type: 'website',
    siteName: 'TELEO Capital',
    title: 'TELEO Capital | Empowering businesses to perform and execute',
    description: pages.home.description,
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'TELEO Capital' }],
  },
  twitter: { card: 'summary_large_image' },
}
export const viewport: Viewport = { themeColor: '#07090d', colorScheme: 'dark' }

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: firm.name,
  url: SITE_URL,
  slogan: firm.tagline,
  sameAs: [firm.linkedin],
  address: [
    { '@type': 'PostalAddress', streetAddress: '1100 W Idaho St, Suite 330', addressLocality: 'Boise', addressRegion: 'ID', postalCode: '83702', addressCountry: 'US' },
    { '@type': 'PostalAddress', streetAddress: '2121 Rosecrans, Suite 3320', addressLocality: 'El Segundo', addressRegion: 'CA', postalCode: '90245', addressCountry: 'US' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="bg-midnight text-marble">
        <SmoothScroll />
        <SiteArc />
        <Nav />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  )
}
