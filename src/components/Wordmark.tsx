/** TELEO wordmark: an open arc that the letterforms complete. Typeset, not an image. */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="11" fill="none" stroke="var(--color-bronze)" strokeWidth="1.2" strokeDasharray="52 18" transform="rotate(-70 13 13)" />
        <path d="M8 9.5h10M13 9.5v8" stroke="var(--color-marble)" strokeWidth="1.4" fill="none" />
      </svg>
      <span className="font-serif text-[1.45rem] leading-none tracking-[0.22em]">TELEO</span>
      <span className="sr-only">Capital</span>
    </span>
  )
}
