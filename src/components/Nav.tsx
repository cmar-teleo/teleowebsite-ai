'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV, firm } from '@/lib/content'
import Logo from './Logo'
import Arrow from './Arrow'

/**
 * Header: liquid glass over the dark site (translucent, blurred, a thin light edge),
 * with the white transparent TELEO logo. It slides away when you scroll down and
 * returns when you scroll up, or when anything inside it takes keyboard focus.
 */
export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setOpen(false)
    setHidden(false)
  }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > 140)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', esc)
    }
  }, [open])

  const active = (href: string, children?: readonly { href: string }[]) =>
    pathname === href || pathname.startsWith(href + '/') || !!children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'))

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={`glass fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-marble focus:px-4 focus:py-2 focus:text-midnight">
        Skip to content
      </a>
      <div className="wrap flex h-[var(--nav-h)] items-center justify-between">
        <Link href="/" aria-label="TELEO Capital, home" className="transition-opacity hover:opacity-80">
          <Logo height={50} white />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 font-mono text-[0.72rem] uppercase tracking-[0.18em] lg:flex">
          {NAV.map((n) =>
            'children' in n ? (
              <div key={n.label} className="nav-group relative">
                <Link href={n.href} className="nav-link" aria-current={active(n.href, n.children) ? 'page' : undefined}>
                  {n.label}
                </Link>
                <div className="nav-menu absolute left-1/2 top-full w-[21rem] -translate-x-1/2 pt-5">
                  <ul className="glass-panel p-2">
                    {n.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/10 focus-visible:bg-white/10">
                          <span>
                            <span className="block text-marble">{c.label}</span>
                            <span className="mt-1 block font-sans text-[0.8rem] normal-case tracking-normal text-marble/65">{c.note}</span>
                          </span>
                          <Arrow className="shrink-0 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={n.label} href={n.href} className="nav-link" aria-current={active(n.href) ? 'page' : undefined}>
                {n.label}
              </Link>
            ),
          )}
          <a href={firm.portal} className="nav-link" target="_blank" rel="noopener noreferrer">
            Investor Login
          </a>
          <Link href="/contact" className="nav-contact" aria-current={pathname === '/contact' ? 'page' : undefined}>
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-px w-6 bg-marble transition-transform duration-500 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-6 bg-marble transition-transform duration-500 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {/* progress: one orange rule that fills as the page completes */}
      <div className="relative h-px" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 bg-orange" style={{ width: 'calc(var(--scroll) * 100%)' }} />
      </div>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[var(--nav-h)] z-40 h-[calc(100dvh-var(--nav-h))] overflow-y-auto bg-midnight/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="wrap flex flex-col gap-8 pb-24 pt-10">
          {NAV.map((n) => (
            <div key={n.label}>
              <Link href={n.href} className="font-serif text-4xl">
                {n.label}
              </Link>
              {'children' in n && (
                <ul className="mt-3 flex flex-col gap-2 border-l border-marble/30 pl-4">
                  {n.children.slice(1).map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-vein">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Link href="/contact" className="font-serif text-4xl text-orange">
            Contact
          </Link>
          <a href={firm.portal} target="_blank" rel="noopener noreferrer" className="link-arrow self-start">
            Investor Login
          </a>
        </nav>
      </div>
    </header>
  )
}
