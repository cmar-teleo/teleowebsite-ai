import PageHero from '@/components/PageHero'
import TeamGrid from '@/components/TeamGrid'
import { pages, team } from '@/lib/content'
import { meta } from '@/lib/meta'

const page = pages.team
export const metadata = meta(page.title, page.description, '/team', 'team')

export default function TeamPage() {
  const hero = page.sections[0]
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} ledes={hero.ledes} motif="teleo" />
      <TeamGrid team={team} />
    </>
  )
}
