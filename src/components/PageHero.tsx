import type { ReactNode } from 'react'

export type Motif = 'arc' | 'columns' | 'meander' | 'laurel' | 'code' | 'teleo' | 'none'

/**
 * Each page hero carries one painted fresco fragment (public/plates/frag-*.webp):
 * a broken piece of dark plaster with the subject laid on in mineral pigment.
 * The fragment drifts against the page as you scroll, as the linework motifs did.
 */
const PLATE: Record<Exclude<Motif, 'none'>, { src: string; alt: string }> = {
  arc: { src: '/plates/frag-arc.webp', alt: 'Fresco fragment: concentric arcs in yellow and red ochre, not yet closed, around a chalk-white centre' },
  columns: { src: '/plates/frag-columns.webp', alt: 'Fresco fragment: three chalk-white columns under a red-ochre frieze with a Greek key' },
  meander: { src: '/plates/frag-meander.webp', alt: 'Fresco fragment: three bands of Greek key in red ochre, chalk white and yellow ochre' },
  laurel: { src: '/plates/frag-laurel.webp', alt: 'Fresco fragment: a laurel wreath in earth green with red-ochre berries' },
  teleo: { src: '/plates/frag-teleo.webp', alt: 'Fresco fragment: the TELEO T, its left stroke in Egyptian blue and its right in orange ochre, inside a painted ring' },
  code: { src: '/plates/frag-stele.webp', alt: 'Fresco fragment: a chalk-white stele covered in rows of painted marks, like an inscription' },
}

export default function PageHero({
  eyebrow,
  heading,
  ledes = [],
  motif = 'arc',
  children,
}: {
  eyebrow?: string
  heading?: string
  ledes?: string[]
  motif?: Motif
  children?: ReactNode
}) {
  const plate = motif === 'none' ? null : PLATE[motif]
  return (
    <section className="grain relative flex min-h-[78svh] items-end overflow-hidden pb-16 pt-[calc(var(--nav-h)+5rem)] md:pb-24">
      {plate && (
        <div className="pointer-events-none absolute inset-y-0 right-[-6%] hidden w-[54%] items-center justify-center [mask-image:linear-gradient(to_right,transparent,black_38%)] md:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plate.src} alt={plate.alt} width={900} height={900} className="h-auto w-[min(100%,46rem)]" data-parallax="0.35" />
        </div>
      )}
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative">
        {eyebrow && <p className="eyebrow hero-in">{eyebrow}</p>}
        <h1 className="display hero-in mt-6 max-w-[52rem]" style={{ animationDelay: '80ms' }}>
          {heading}
        </h1>
        {ledes.map((l, i) => (
          <p key={i} className={`lede hero-in max-w-2xl ${i === 0 ? 'mt-8' : 'mt-4'}`} style={{ animationDelay: `${200 + i * 90}ms` }}>
            {l}
          </p>
        ))}
        {children && (
          <div className="hero-in mt-10 flex flex-wrap gap-4" style={{ animationDelay: '380ms' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
