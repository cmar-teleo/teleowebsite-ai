/**
 * The telos: a painted ochre arc fixed behind every page (the same brush stroke as the
 * hero's, public/plates/arc.webp) that closes into a full circle as you reach the end.
 * The reveal is a mask driven by page scroll (--scroll); the paint itself never changes.
 */
export default function SiteArc() {
  return (
    <div className="site-arc pointer-events-none fixed -right-[24vmin] top-1/2 z-0 hidden h-[112vmin] w-[112vmin] -translate-y-1/2 opacity-45 md:block" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/plates/arc.webp" alt="" loading="lazy" className="arc-paint h-full w-full" />
    </div>
  )
}
