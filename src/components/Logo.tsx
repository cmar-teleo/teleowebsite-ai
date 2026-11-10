/**
 * The TELEO Capital mark.
 *  - default: the brand file itself (public/brand/teleologo1.png), unmodified, for light grounds (the nav bar).
 *  - white:   the same file with every pixel painted white (public/brand/teleologo1-white.png,
 *             made by scripts/make-white-logo.cjs), for the dark footer. Same shape, transparent background.
 */
export default function Logo({ height = 58, white = false }: { height?: number; white?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={white ? '/brand/teleologo1-white.png' : '/brand/teleologo1.png'}
      alt="TELEO Capital"
      width={Math.round((height * 132) / 72)}
      height={height}
      style={{ height, width: 'auto' }}
    />
  )
}
