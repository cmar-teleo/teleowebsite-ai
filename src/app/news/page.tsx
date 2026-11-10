import PageHero from '@/components/PageHero'
import NewsList from '@/components/NewsList'
import { firm, news, pages } from '@/lib/content'
import { meta } from '@/lib/meta'

const page = pages.news
export const metadata = meta(page.title, page.description, '/news', 'news')

export default function NewsPage() {
  const hero = page.sections[0]
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} ledes={hero.ledes} motif="meander" />
      <section className="py-20 md:py-28">
        <div className="wrap">
          <NewsList news={news} />
        </div>
      </section>
      <section className="border-t border-marble/10 py-16">
        <div className="wrap-narrow">
          <p className="eyebrow">About TELEO Capital</p>
          <p className="mt-6 text-marble/75">{firm.boilerplate}</p>
          <p className="mt-6 text-marble/75">
            Press contact: {firm.press.name},{' '}
            <a className="text-bronze-hi underline underline-offset-4" href={`mailto:${firm.press.email}`}>
              {firm.press.email}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
