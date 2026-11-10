/**
 * The TELEO Capital mark. This is the brand file itself (public/brand/teleologo1.png),
 * shown unmodified and always on a light ground. Do not redraw, recolour or invert it.
 */
export default function Logo({ height = 58 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/teleologo1.png" alt="TELEO Capital" width={Math.round((height * 132) / 72)} height={height} style={{ height, width: 'auto' }} />
  )
}
