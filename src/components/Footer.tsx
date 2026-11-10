import Link from 'next/link'
import { firm } from '@/lib/content'
import Logo from './Logo'
import Arrow from './Arrow'

const DISCLAIMER =
  'This website is for informational purposes only and does not constitute an offer to sell, or a solicitation of an offer to buy, any security or investment product, nor investment, legal, or tax advice. Any such offer is made only to qualified investors through definitive offering documents. Past performance is not indicative of future results. Statements that are not historical facts may be forward-looking and are subject to risks and uncertainties.'

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-marble/10 bg-obsidian/40">
      <div className="meander opacity-90" aria-hidden="true" />
      <div className="wrap py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end" data-reveal>
          <p className="h2 max-w-3xl">
            Empowering businesses to <em>perform and execute.</em>
          </p>
          <Link href="/contact" className="btn btn--primary shrink-0">
            Get in Touch <Arrow />
          </Link>
        </div>

        <div className="rule my-14" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo height={64} white />
            <div className="mt-6">
              <a href={firm.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow">
                LinkedIn
              </a>
            </div>
          </div>
          <address className="not-italic">
            <p className="eyebrow mb-3">Boise</p>
            <a
              className="block text-marble/80 transition-colors hover:text-marble"
              href="https://maps.google.com/?q=1100+W+Idaho+St,+Suite+330,+Boise,+ID+83702"
              target="_blank"
              rel="noopener noreferrer"
            >
              1100 W Idaho St, Suite 330
              <br />
              Boise, ID 83702
            </a>
          </address>
          <address className="not-italic">
            <p className="eyebrow mb-3">Los Angeles</p>
            <a
              className="block text-marble/80 transition-colors hover:text-marble"
              href="https://maps.google.com/?q=2121+Rosecrans+Ave,+Suite+3320,+El+Segundo,+CA+90245"
              target="_blank"
              rel="noopener noreferrer"
            >
              2121 Rosecrans, Suite 3320
              <br />
              El Segundo, CA 90245
            </a>
          </address>
          <div>
            <p className="eyebrow mb-3">Careers</p>
            <ul className="space-y-2 text-marble/80">
              <li>
                <a className="transition-colors hover:text-marble" href="mailto:espanneut@teleocapital.com?subject=TELEO%20Careers">
                  Apply for positions within our team
                </a>
              </li>
              <li>
                <Link className="transition-colors hover:text-marble" href="/portfolio">
                  Careers with our portfolio companies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 max-w-5xl text-[0.8rem] leading-relaxed text-vein">{DISCLAIMER}</p>

        <div className="mt-8 flex flex-col justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein sm:flex-row">
          <p>© 2026 TELEO Capital Management, LLC</p>
          <nav aria-label="Legal and account links" className="flex flex-wrap gap-6">
            <Link className="hover:text-marble" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-marble" href="/terms">
              Terms of Use
            </Link>
            <a className="hover:text-marble" href={firm.portal} target="_blank" rel="noopener noreferrer">
              Investor Login
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
