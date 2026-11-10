/** The telos: a bronze arc fixed behind every page that closes into a full circle as you reach the end. */
export default function SiteArc() {
  return (
    <div
      className="site-arc pointer-events-none fixed -right-[22vmin] top-1/2 z-0 hidden h-[110vmin] w-[110vmin] -translate-y-1/2 opacity-60 md:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r="98" fill="none" stroke="var(--color-marble)" strokeOpacity="0.05" strokeWidth="0.3" />
        <circle className="arc-live" cx="100" cy="100" r="98" fill="none" stroke="var(--color-bronze)" strokeOpacity="0.55" strokeWidth="0.35" pathLength={1} />
      </svg>
    </div>
  )
}
