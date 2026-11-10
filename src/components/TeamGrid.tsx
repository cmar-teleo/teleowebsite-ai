'use client'

import { useEffect, useRef, useState } from 'react'
import type { Person } from '@/lib/content'
import Arrow from './Arrow'

const GROUPS = ['Leadership', 'Investment Team', 'Operating Team']

/**
 * The team, with the firm's own photographs. Portraits are shown exactly as supplied:
 * black-and-white, uncropped, untinted, never painted over. Cards keep the site's
 * staggered reveal and lift. Selecting a person opens their profile with the bio crop.
 * Someone with no photograph on file is listed without an image; none is invented.
 */
export default function TeamGrid({ team }: { team: Person[] }) {
  const [open, setOpen] = useState<Person | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    if (open && !dlg.open) dlg.showModal()
    if (!open && dlg.open) dlg.close()
  }, [open])

  return (
    <>
      {GROUPS.map((g, gi) => {
        const people = team.filter((p) => p.group === g)
        return (
          <section key={g} className="border-t border-marble/10 py-16 md:py-20" aria-labelledby={`g-${gi}`}>
            <div className="wrap grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h2 id={`g-${gi}`} className="eyebrow" data-reveal>
                  {g}
                </h2>
                <p className="mt-4 font-mono text-[0.68rem] tracking-[0.18em] text-vein">{String(people.length).padStart(2, '0')}</p>
              </div>
              <ul className="grid grid-cols-2 gap-5 lg:col-span-9 xl:grid-cols-3">
                {people.map((p, i) => (
                  <li key={p.name} data-reveal style={{ ['--d' as string]: i % 3 }}>
                    <button type="button" onClick={() => setOpen(p)} className="card group flex h-full w-full flex-col text-left" aria-haspopup="dialog">
                      {p.photo ? (
                        <span className="block overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.photo}
                            alt={`${p.name}, ${p.role}`}
                            width={500}
                            height={460}
                            loading={gi === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="block h-auto w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </span>
                      ) : (
                        <span className="block aspect-[500/460] w-full bg-obsidian" aria-hidden="true" />
                      )}
                      <span className="flex flex-1 flex-col p-5">
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein">{p.role}</span>
                        <span className="mt-3 font-serif text-[1.7rem] leading-none">{p.name}</span>
                        <span className="mt-5 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein opacity-80 transition-opacity group-hover:opacity-100">
                          Bio <Arrow />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && setOpen(null)}
        aria-labelledby="bio-name"
        data-lenis-prevent
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-2xl overflow-y-auto border-l border-marble/20 bg-obsidian p-0 text-marble backdrop:bg-midnight/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="p-8 md:p-12">
            <button type="button" onClick={() => setOpen(null)} className="link-arrow" autoFocus>
              Close
            </button>
            <div className="mt-10 grid gap-8 sm:grid-cols-5">
              {open.bioPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={open.bioPhoto} alt={`${open.name}, ${open.role}`} width={500} height={640} className="block h-auto w-full sm:col-span-2" />
              )}
              <div className={open.bioPhoto ? 'sm:col-span-3' : 'sm:col-span-5'}>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-vein">{open.role}</p>
                <h2 id="bio-name" className="h2 mt-4">
                  {open.name}
                </h2>
                {open.li && (
                  <a href={open.li} target="_blank" rel="noopener noreferrer" className="btn mt-8">
                    LinkedIn <Arrow />
                  </a>
                )}
              </div>
            </div>
            <div className="mt-8 space-y-5 text-marble/80">
              {open.bio.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
