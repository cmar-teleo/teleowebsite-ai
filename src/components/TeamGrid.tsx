'use client'

import { useEffect, useRef, useState } from 'react'
import type { Person } from '@/lib/content'
import Arrow from './Arrow'

const GROUPS = ['Leadership', 'Investment Team', 'Operating Team']

/** Typographic team index. Selecting a person opens their bio in a native dialog. */
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
      {GROUPS.map((g) => {
        const people = team.filter((p) => p.group === g)
        return (
          <section key={g} className="border-t border-marble/10 py-16 md:py-20" aria-labelledby={`g-${g}`}>
            <div className="wrap grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h2 id={`g-${g}`} className="eyebrow" data-reveal>
                  {g}
                </h2>
                <p className="mt-4 font-mono text-[0.68rem] tracking-[0.18em] text-vein">{String(people.length).padStart(2, '0')}</p>
              </div>
              <ul className="grid gap-px overflow-hidden border border-marble/10 bg-marble/10 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
                {people.map((p, i) => (
                  <li key={p.name} className="bg-midnight" data-reveal style={{ ['--d' as string]: i % 3 }}>
                    <button
                      type="button"
                      onClick={() => setOpen(p)}
                      className="group flex h-full w-full flex-col items-start p-6 text-left transition-colors duration-500 hover:bg-obsidian focus-visible:bg-obsidian"
                      aria-haspopup="dialog"
                    >
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bronze-hi">{p.role}</span>
                      <span className="mt-8 font-serif text-[1.9rem] leading-none transition-colors group-hover:text-bronze-hi">{p.name}</span>
                      <span className="mt-6 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-vein opacity-70 transition-opacity group-hover:opacity-100">
                        Bio <Arrow />
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
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-2xl overflow-y-auto border-l border-bronze/40 bg-obsidian p-0 text-marble backdrop:bg-midnight/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="p-8 md:p-12">
            <button type="button" onClick={() => setOpen(null)} className="link-arrow" autoFocus>
              Close
            </button>
            <p className="mt-12 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bronze-hi">{open.role}</p>
            <h2 id="bio-name" className="h2 mt-4">
              {open.name}
            </h2>
            <div className="mt-8 space-y-5 text-marble/80">
              {open.bio.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
            {open.li && (
              <a href={open.li} target="_blank" rel="noopener noreferrer" className="btn mt-10">
                LinkedIn <Arrow />
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
