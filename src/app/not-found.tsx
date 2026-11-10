import Link from 'next/link'
import Arrow from '@/components/Arrow'

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-[var(--nav-h)]">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="display mt-6 max-w-[14ch]">This page was not brought to completion</h1>
        <Link href="/" className="btn mt-10">
          Return home <Arrow />
        </Link>
      </div>
    </section>
  )
}
