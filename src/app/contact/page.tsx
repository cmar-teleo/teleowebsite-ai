import PageHero from '@/components/PageHero'
import ContactForm from '@/components/ContactForm'
import { ContactDetails } from '@/components/ContactBand'
import Sections from '@/components/Sections'
import { pages } from '@/lib/content'
import { meta } from '@/lib/meta'

const page = pages.contact
export const metadata = meta(page.title, page.description, '/contact', 'contact')

const OFFICES = [
  { label: 'Headquarters', city: 'Boise, Idaho', lines: ['1100 W Idaho St, Suite 330', 'Boise, ID 83702'], href: 'https://maps.google.com/?q=1100+W+Idaho+St,+Suite+330,+Boise,+ID+83702' },
  { label: 'West Coast', city: 'Los Angeles', lines: ['2121 Rosecrans, Suite 3320', 'El Segundo, CA 90245'], href: 'https://maps.google.com/?q=2121+Rosecrans+Ave,+Suite+3320,+El+Segundo,+CA+90245' },
]

export default function ContactPage() {
  const hero = page.sections[0]
  const band = page.sections.filter((s) => s.kind === 'band')
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} ledes={hero.ledes} motif="arc" />
      <section className="py-20 md:py-28">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <h2 className="h3 mb-8">Send us a message</h2>
            <ContactForm />
          </div>
          <div className="space-y-12 lg:col-span-4 lg:col-start-9" data-reveal>
            <ContactDetails />
            {OFFICES.map((o) => (
              <address key={o.label} className="border-t border-bronze/40 pt-6 not-italic">
                <p className="eyebrow">{o.label}</p>
                <p className="mt-3 font-serif text-2xl">{o.city}</p>
                <a href={o.href} target="_blank" rel="noopener noreferrer" className="mt-2 block text-marble/75 transition-colors hover:text-marble">
                  {o.lines[0]}
                  <br />
                  {o.lines[1]}
                </a>
              </address>
            ))}
          </div>
        </div>
      </section>
      <Sections sections={band} />
    </>
  )
}
