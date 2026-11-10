/**
 * Static poster frame for the hero scene, drawn as SVG so it is sharp, tiny and themeable.
 * `start` is shown while the 3D scene loads; `end` (arc closed, company standing alone)
 * is the calm fallback for prefers-reduced-motion.
 */
function Column({ x, base, h, w = 26, lit = 0.5 }: { x: number; base: number; h: number; w?: number; lit?: number }) {
  const flutes = 5
  return (
    <g opacity={lit}>
      <rect x={x - w / 2} y={base - h} width={w} height={h} fill="url(#pp-marble)" />
      {Array.from({ length: flutes }, (_, i) => (
        <line key={i} x1={x - w / 2 + ((i + 1) * w) / (flutes + 1)} y1={base - h} x2={x - w / 2 + ((i + 1) * w) / (flutes + 1)} y2={base} stroke="#07090d" strokeOpacity="0.35" strokeWidth="1" />
      ))}
      <rect x={x - w * 0.72} y={base - h - 9} width={w * 1.44} height={9} fill="url(#pp-marble)" />
    </g>
  )
}

export default function HeroPoster({ state, className = '' }: { state: 'start' | 'end'; className?: string }) {
  const end = state === 'end'
  const base = 700
  const cols = Array.from({ length: 9 }, (_, i) => 330 + i * 78)
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A marble colonnade at night. One column stands apart on its own plinth, framed by a bronze arc.">
      <defs>
        <linearGradient id="pp-marble" x1="0" x2="1">
          <stop offset="0" stopColor="#6f6a61" />
          <stop offset="0.55" stopColor="#d8d0c2" />
          <stop offset="1" stopColor="#8d867a" />
        </linearGradient>
        <radialGradient id="pp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#b8864b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#b8864b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pp-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0f131a" />
          <stop offset="1" stopColor="#07090d" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="#07090d" />
      {/* arc */}
      <circle cx="1210" cy="400" r="300" fill="none" stroke="#ede6da" strokeOpacity="0.07" />
      <circle cx="1210" cy="400" r="300" fill="none" stroke="#b8864b" strokeWidth="2.5" pathLength={1} strokeDasharray={end ? '1 0' : '0.14 1'} transform="rotate(-90 1210 400)" />
      {end && <circle cx="1210" cy="430" r="330" fill="url(#pp-glow)" />}
      {/* parent temple */}
      <g opacity={end ? 0.45 : 0.9}>
        <polygon points="290,372 994,372 642,300" fill="#8d867a" opacity="0.55" />
        <rect x="296" y="372" width="692" height="34" fill="url(#pp-marble)" opacity="0.6" />
        {cols.map((x, i) => (end && i === 5 ? null : <Column key={x} x={x} base={base} h={284} lit={!end && i === 5 ? 1 : 0.55} />))}
        <rect x="280" y={base} width="724" height="12" fill="#8d867a" opacity="0.5" />
        <rect x="262" y={base + 12} width="760" height="12" fill="#6f6a61" opacity="0.4" />
      </g>
      {/* standalone */}
      {end && (
        <g>
          <polygon points="1088,318 1332,318 1210,272" fill="#d8d0c2" opacity="0.9" />
          <rect x="1094" y="318" width="232" height="26" fill="url(#pp-marble)" />
          <Column x={1130} base={760} h={400} w={34} lit={0.95} />
          <Column x={1210} base={760} h={400} w={34} lit={1} />
          <Column x={1290} base={760} h={400} w={34} lit={0.95} />
          <rect x="1080" y="760" width="260" height="12" fill="#d8d0c2" />
          <rect x="1064" y="772" width="292" height="12" fill="#8d867a" />
        </g>
      )}
      <rect y={end ? 784 : 724} width="1600" height="200" fill="url(#pp-floor)" />
      {/* meander on the floor */}
      <g stroke="#b8864b" strokeOpacity="0.5" fill="none" strokeWidth="1.5" transform="translate(0 822)">
        {Array.from({ length: 54 }, (_, i) => (
          <path key={i} d={`M${i * 30} 18h27v-16h-20v10h10v-5`} stroke={end && i > 20 && i < 46 ? '#4fd8ff' : undefined} />
        ))}
      </g>
    </svg>
  )
}
