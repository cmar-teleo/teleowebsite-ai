import { firm } from '@/lib/content'
import ContactForm from './ContactForm'

export function ContactDetails() {
  return (
    <dl className="space-y-7">
      <div>
        <dt className="eyebrow">Deal Submissions</dt>
        <dd className="mt-2">
          <a className="font-serif text-2xl transition-colors hover:text-bronze-hi" href={`mailto:${firm.deals.email}`}>
            deals@teleocapital.com
          </a>
        </dd>
      </div>
      <div>
        <dt className="eyebrow">Investor Relations</dt>
        <dd className="mt-2">
          <a className="font-serif text-2xl transition-colors hover:text-bronze-hi" href={`mailto:${firm.ir.email}`}>
            investors@teleocapital.com
          </a>
        </dd>
      </div>
      <div>
        <dt className="eyebrow">Phone</dt>
        <dd className="mt-2">
          <a className="font-serif text-2xl transition-colors hover:text-bronze-hi" href={firm.phoneHref}>
            {firm.phone}
          </a>
        </dd>
      </div>
    </dl>
  )
}

export default function ContactBand() {
  return (
    <section id="get-in-touch" className="border-t border-marble/10 bg-obsidian/40 py-24 md:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            Thank you for your interest in TELEO
          </p>
          <h2 className="h2 mt-5" data-reveal="mask">
            Get in touch
          </h2>
          <p className="lede mt-6" data-reveal>
            Whether you are a corporate seller, an intermediary, or an investor, we would like to hear from you.
          </p>
          <div className="mt-10" data-reveal>
            <ContactDetails />
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <ContactForm idPrefix="band" />
        </div>
      </div>
    </section>
  )
}
