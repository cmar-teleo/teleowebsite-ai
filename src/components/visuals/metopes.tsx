/**
 * PORTFOLIO VISUALS: the "metopes".
 * One procedural SVG relief per platform company, all in one visual language:
 *   .l-back  faint structure (grids, contours)        bronze, low opacity
 *   .l-mid   the engraved subject                     bronze linework
 *   .l-front whatever moves or carries data           electric aegean
 * Every drawing is 400 x 300. Add-ons reuse their platform's drawing with `v` (1, 2, 3)
 * shifting which element is emphasised. To replace one, swap the function in VISUALS below.
 */
import type { CSSProperties, ReactNode } from 'react'

const B = 'var(--bronze)'
const A = 'var(--aegean)'
const M = 'var(--marble)'
type V = { v: number }
const i = (n: number) => ({ '--i': n }) as CSSProperties
const t = (s: string) => ({ '--t': s }) as CSSProperties

const wave = (x0: number, x1: number, y: number, amp: (x: number) => number, len: number, step = 6) => {
  let d = ''
  for (let x = x0; x <= x1; x += step) d += `${x === x0 ? 'M' : 'L'}${x} ${(y + Math.sin(((x - x0) / len) * Math.PI * 2) * amp(x)).toFixed(1)}`
  return d
}
const Mover = ({ path, dur, begin = 0, r = 2.4, fill = A }: { path: string; dur: number; begin?: number; r?: number; fill?: string }) => (
  <circle r={r} fill={fill} className="glow">
    <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
  </circle>
)

/* ------------------------------------------------------------------ Modersys: manufacturing intelligence for life sciences */
function Modersys({ v }: V) {
  const hex = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, k) => [cx + r * Math.cos((Math.PI / 3) * k + Math.PI / 6), cy + r * Math.sin((Math.PI / 3) * k + Math.PI / 6)] as const)
  const rings = [hex(200, 118, 26), hex(245, 118, 26), hex(155, 118, 26)]
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.25" fill="none">
        <path d={wave(30, 370, 52, (x) => 12 * (1 - (x - 30) / 400), 46)} />
        <line x1="30" y1="52" x2="370" y2="52" strokeDasharray="2 6" />
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <line x1="24" y1="226" x2="376" y2="226" />
        {Array.from({ length: 18 }, (_, k) => <circle key={k} cx={32 + k * 20} cy="231" r="3.5" strokeOpacity="0.6" />)}
        <g>
          <animateTransform attributeName="transform" type="translate" from="0 0" to="48 0" dur="2.6s" repeatCount="indefinite" />
          {Array.from({ length: 9 }, (_, k) => (
            <g key={k} transform={`translate(${-18 + k * 48} 0)`}>
              <rect x="0" y="198" width="14" height="26" rx="3" />
              <rect x="3.5" y="191" width="7" height="7" />
              <line x1="0" y1="210" x2="14" y2="210" strokeOpacity="0.5" />
            </g>
          ))}
        </g>
        <path d="M200 160V186M190 186h20" />
        {rings.map((pts, r) => pts.map((p, k) => {
          const q = pts[(k + 1) % 6]
          return <line key={`${r}-${k}`} className="draw" pathLength={1} style={i(r * 3 + k)} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} strokeOpacity={r === 0 ? 1 : 0.6} />
        }))}
      </g>
      <g className="l-front">
        {rings[v % 3].map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="3" fill={A} className="pulse glow" style={i(k)} />)}
        <Mover path={wave(30, 370, 52, (x) => 12 * (1 - (x - 30) / 400), 46)} dur={7} />
        <rect x="193" y="196" width="14" height="30" fill="none" stroke={A} strokeOpacity="0.8" className="pulse" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ NumoData: AI-powered network intelligence */
function NumoData({ v }: V) {
  const n: [number, number][] = [[58, 205], [120, 122], [188, 178], [250, 92], [304, 168], [346, 108], [150, 242], [262, 232]]
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [6, 2], [2, 7], [7, 4], [1, 3]]
  const seg = (a: number, b: number) => `M${n[a][0]} ${n[a][1]}L${n[b][0]} ${n[b][1]}`
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.2" fill="none">
        {[70, 110, 150, 190, 230].map((y, k) => <path key={y} d={wave(20, 380, y, () => 10 + k * 2, 150 + k * 30)} />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {links.map(([a, b], k) => <path key={k} d={seg(a, b)} strokeOpacity={k === 2 ? 0.35 : 0.8} strokeDasharray={k === 2 ? '3 5' : undefined} />)}
        {n.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="4.5" fill="#07090d" />)}
        {[1, 5, 7].map((k) => <path key={k} d={`M${n[k][0]} ${n[k][1] - 5}v-22m-6 6l6-6l6 6`} />)}
      </g>
      <g className="l-front" fill="none">
        {[1, 5, 7].map((k, j) => <circle key={k} cx={n[k][0]} cy={n[k][1] - 27} r="30" stroke={A} className="ring" style={i(j)} />)}
        <path d={`${seg(2, 7)}L${n[4][0]} ${n[4][1]}`} stroke={A} className="flow glow" />
        <Mover path={`${seg(0, 1)}L${n[3][0]} ${n[3][1]}L${n[4][0]} ${n[4][1]}L${n[5][0]} ${n[5][1]}`} dur={6} />
        <Mover path={`${seg(0, 6)}L${n[2][0]} ${n[2][1]}L${n[7][0]} ${n[7][1]}L${n[4][0]} ${n[4][1]}`} dur={7} begin={1.5 + v} />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Softrax: revenue management and recognition */
function Softrax({ v }: V) {
  const c = [286, 150]
  const rows = [70, 96, 122, 150, 178, 204, 230]
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.22">
        {rows.map((y) => <line key={y} x1="28" y1={y} x2="150" y2={y} />)}
        {[28, 64, 100].map((x) => <line key={x} x1={x} y1="60" x2={x} y2="240" strokeOpacity="0.14" />)}
      </g>
      <g className="l-mid" fill="none" stroke={B}>
        {rows.map((y, k) => <path key={y} className="flow" d={`M34 ${y}C150 ${y} 170 ${c[1]} ${c[0] - 58} ${c[1]}`} strokeOpacity={0.35 + (k % 3) * 0.2} />)}
        <circle cx={c[0]} cy={c[1]} r="58" strokeDasharray="2 7" className="spin" style={t('60s')} />
        <circle cx={c[0]} cy={c[1]} r="42" strokeDasharray="26 8" className="spin-r" style={t('34s')} />
        <circle cx={c[0]} cy={c[1]} r="26" strokeDasharray="14 5" className="spin" style={t('18s')} />
        <circle cx={c[0]} cy={c[1]} r="4" fill={B} />
        {rows.map((y, k) => <rect key={y} x={40 + ((k * 37) % 70)} y={y - 5} width="16" height="4" fill={B} stroke="none" opacity="0.6" />)}
      </g>
      <g className="l-front">
        {[58, 42, 26].map((r, k) => (
          <Mover key={r} path={`M${c[0] + r} ${c[1]}a${r} ${r} 0 1 1 ${-2 * r} 0a${r} ${r} 0 1 1 ${2 * r} 0`} dur={(v === k + 1 ? 5 : 9) + k * 4} begin={k} />
        ))}
        <path d={`M${c[0] + 58} ${c[1]}H376`} stroke={A} className="flow glow" fill="none" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Sharpen: cloud contact center, many channels into one */
function Sharpen({ v }: V) {
  const hub = [252, 150]
  const ys = [66, 108, 150, 192, 234]
  const paths = ys.map((y) => `M28 ${y}C120 ${y} 170 ${hub[1]} ${hub[0]} ${hub[1]}`)
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.2" fill="none">
        <path d={wave(28, 150, 66, () => 7, 22, 3)} />
        <path d="M28 108h10v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8h10" />
        <path d={wave(28, 150, 192, (x) => 3 + ((x * 7) % 9), 14, 3)} />
        {Array.from({ length: 12 }, (_, k) => <rect key={k} x={30 + k * 10} y="230" width="5" height="8" rx="2" />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {paths.map((d, k) => <path key={k} d={d} strokeDasharray={['', '1 5', '8 4', '2 3', ''][k]} strokeOpacity={v && v - 1 === k ? 1 : 0.7} stroke={v && v - 1 === k ? A : B} />)}
        <circle cx={hub[0]} cy={hub[1]} r="15" />
        <circle cx={hub[0]} cy={hub[1]} r="24" strokeOpacity="0.4" strokeDasharray="3 6" className="spin" />
      </g>
      <g className="l-front" fill="none">
        <line x1={hub[0] + 15} y1={hub[1]} x2="376" y2={hub[1]} stroke={A} strokeWidth="1.5" className="glow" />
        <circle cx={hub[0]} cy={hub[1]} r="5" fill={A} className="pulse glow" />
        {paths.map((d, k) => <Mover key={k} path={d} dur={3.6 + k * 0.5} begin={k * 0.6} r={2} />)}
        <Mover path={`M${hub[0]} ${hub[1]}H376`} dur={1.8} r={2.8} />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Flatirons: aviation technical documentation (Scope AR adds in-context steps) */
function Flatirons({ v }: V) {
  const Page = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="34" height="44" />
      {[10, 18, 26, 34].map((l, k) => <line key={l} x1="6" y1={l} x2={k === 3 ? 20 : 28} y2={l} strokeOpacity="0.6" />)}
    </g>
  )
  const leaders = ['M200 70L72 52', 'M118 168L62 226', 'M282 168L338 226', 'M200 232L330 60']
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.18" fill="none">
        <line x1="200" y1="30" x2="200" y2="270" strokeDasharray="8 4 1 4" />
        <line x1="40" y1="165" x2="360" y2="165" strokeDasharray="8 4 1 4" />
        <circle cx="200" cy="165" r="110" />
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <path d="M200 52c10 14 12 34 12 60v84c0 18-5 30-12 44c-7-14-12-26-12-44v-84c0-26 2-46 12-60z" />
        <path d="M178 140L74 186v14l104-22z" />
        <path d="M222 140l104 46v14l-104-22z" />
        <path d="M184 226l-34 16v9l34-8zM216 226l34 16v9l-34-8z" />
        <rect x="122" y="150" width="11" height="24" rx="5" />
        <rect x="267" y="150" width="11" height="24" rx="5" />
        {leaders.map((d, k) => <path key={k} d={d} strokeDasharray="2 4" strokeOpacity="0.7" />)}
        <Page x={38} y={22} />
        <Page x={28} y={226} />
        <Page x={338} y={226} />
        <Page x={330} y={16} />
      </g>
      <g className="l-front" fill="none">
        {leaders.map((d, k) => <Mover key={k} path={d} dur={3.4} begin={k * 0.8} r={2} />)}
        {v > 0 &&
          [[200, 96], [128, 162], [272, 162], [200, 214]].map(([x, y], k) => (
            <g key={k}>
              <circle cx={x} cy={y} r="8" stroke={A} className="pulse glow" style={i(k * 2)} />
              <circle cx={x} cy={y} r="2" fill={A} />
            </g>
          ))}
        <path d="M200 52c10 14 12 34 12 60" stroke={A} className="draw glow" pathLength={1} />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Univeris: wealth management, orderly flows through a gate */
function Univeris({ v }: V) {
  const left: [number, number][] = [[48, 78], [86, 132], [40, 176], [98, 214], [62, 246], [112, 62], [130, 168]]
  const right: [number, number][] = Array.from({ length: 12 }, (_, k) => [286 + (k % 3) * 30, 96 + Math.floor(k / 3) * 36] as [number, number])
  const flow = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]}C${a[0] + 50} ${a[1]} 170 150 200 150S${b[0] - 50} ${b[1]} ${b[0]} ${b[1]}`
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.22" fill="none">
        {left.map((a, k) => <path key={k} d={flow(a, right[(k * 5) % 12])} />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {left.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={3 + (k % 3)} />)}
        {right.map((p, k) => <rect key={k} x={p[0] - 5} y={p[1] - 5} width="10" height="10" strokeOpacity={v && k % 3 === v - 1 ? 1 : 0.7} stroke={v && k % 3 === v - 1 ? A : B} />)}
        <path d="M176 94h48M180 100h40M184 100v104M216 100v104M178 204h44M174 210h52" />
        <path d="M176 94l24-14l24 14" />
      </g>
      <g className="l-front">
        {[0, 3, 5].map((k, j) => <Mover key={k} path={flow(left[k], right[(k * 5) % 12])} dur={5 + j} begin={j * 1.4} />)}
        <line x1="184" y1="150" x2="216" y2="150" stroke={A} className="pulse glow" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Industrial Defender: OT cybersecurity for critical infrastructure */
function IndustrialDefender() {
  const assets: [number, number][] = [[80, 96], [200, 80], [318, 110], [128, 210], [262, 206]]
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.16">
        {Array.from({ length: 9 }, (_, k) => <line key={k} x1={40 + k * 40} y1="34" x2={40 + k * 40} y2="262" />)}
        {Array.from({ length: 6 }, (_, k) => <line key={k} x1="24" y1={50 + k * 40} x2="376" y2={50 + k * 40} />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <path d="M80 114V160H200V98M200 160V206H128M200 160H318V128M262 206H200M40 210H110M146 210h36" />
        <rect x="62" y="78" width="36" height="36" />
        <circle cx="200" cy="80" r="18" />
        <path d="M300 128v-36l18-10l18 10v36z" />
        <circle cx="128" cy="210" r="16" />
        <path d="M120 210h16M128 202v16" strokeOpacity="0.6" />
        <rect x="246" y="192" width="32" height="28" />
        <path d="M252 200h20M252 206h20M252 212h12" strokeOpacity="0.6" />
        {[[140, 160], [258, 160], [200, 128]].map(([x, y], k) => <path key={k} d={`M${x - 7} ${y - 5}l14 10v-10l-14 10z`} fill="#07090d" />)}
      </g>
      <g className="l-front" fill="none">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;340 0;0 0" dur="9s" repeatCount="indefinite" />
          <line x1="30" y1="34" x2="30" y2="262" stroke={A} className="glow" />
          <rect x="6" y="34" width="24" height="228" fill={A} opacity="0.06" />
        </g>
        {assets.map(([x, y], k) => (
          <path key={k} d={`M${x - 26} ${y - 22}h52v26c0 14-12 22-26 28c-14-6-26-14-26-28z`} stroke={A} strokeOpacity="0.8" className="pulse" style={i(k * 1.3)} />
        ))}
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Paxia: airline catering and inflight retail */
function Paxia() {
  const rows = Array.from({ length: 15 }, (_, k) => 96 + k * 14)
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.18" fill="none">
        <path d="M20 150h360" strokeDasharray="8 4 1 4" />
        <path d="M150 104L112 36h22l58 68M150 196l-38 68h22l58-68" />
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <path d="M28 150c8-22 30-40 62-40h226c28 0 46 18 58 40c-12 22-30 40-58 40H90c-32 0-54-18-62-40z" />
        {rows.map((x) => (
          <g key={x} strokeOpacity="0.75">
            <rect x={x} y="118" width="8" height="8" /><rect x={x} y="129" width="8" height="8" />
            <rect x={x} y="163" width="8" height="8" /><rect x={x} y="174" width="8" height="8" />
          </g>
        ))}
        <rect x="62" y="122" width="22" height="56" />
        <path d="M62 141h22M62 159h22" strokeOpacity="0.6" />
        <rect x="312" y="122" width="22" height="56" />
        <path d="M312 141h22M312 159h22" strokeOpacity="0.6" />
      </g>
      <g className="l-front">
        {[0, 4.5].map((b) => (
          <rect key={b} x="-6" y="-4" width="12" height="8" fill={A} className="glow">
            <animateMotion path="M88 150H308H88" dur="9s" begin={`${b}s`} repeatCount="indefinite" />
          </rect>
        ))}
        {[62, 312].map((x, k) => <rect key={x} x={x} y="122" width="22" height="56" fill="none" stroke={A} className="pulse" style={i(k * 3)} />)}
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ UMT360: strategic portfolio management, many efforts in one view */
function Umt360({ v }: V) {
  const from: [number, number, number][] = [[70, 90, -38], [150, 230, 62], [60, 200, 24], [330, 80, -70], [300, 236, 40], [210, 60, 84], [352, 170, -20]]
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.18" fill="none">
        {from.map(([x, y, r], k) => <rect key={k} x={x - 7} y={y - 42} width="14" height="84" transform={`rotate(${r} ${x} ${y})`} strokeDasharray="2 5" />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {from.map(([x, y, r], k) => {
          const tx = 92 + k * 36
          return (
            <g key={k}>
              <animateTransform attributeName="transform" type="translate" values={`${x} ${y};${tx} 162;${tx} 162;${x} ${y}`} keyTimes="0;0.34;0.82;1" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0.8 0.2 1;0 0 1 1;0.6 0 0.8 0.4" />
              <rect x="-7" y="-42" width="14" height="84" stroke={v && k % 3 === v - 1 ? A : B}>
                <animateTransform attributeName="transform" type="rotate" values={`${r};0;0;${r}`} keyTimes="0;0.34;0.82;1" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0.8 0.2 1;0 0 1 1;0.6 0 0.8 0.4" />
              </rect>
            </g>
          )
        })}
        <line x1="70" y1="208" x2="330" y2="208" />
      </g>
      <g className="l-front" fill="none" stroke={A}>
        <g>
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.34;0.42;0.8;0.83" dur="11s" repeatCount="indefinite" />
          <path d="M76 114h248M70 106h260M70 106l130-34l130 34" className="glow" />
        </g>
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Rand McNally: navigation and fleet telematics */
function RandMcNally({ v }: V) {
  const roads = ['M52 214C110 180 150 196 196 150S290 96 350 84', 'M70 78C130 110 160 120 196 150S250 210 338 226', 'M196 40V150C196 190 180 220 160 262']
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.2" fill="none">
        {[-2, -1, 0, 1, 2].map((k) => <path key={k} d={`M${200 + k * 70} 30Q${200 + k * 96} 150 ${200 + k * 70} 270`} />)}
        {[70, 110, 150, 190, 230].map((y, k) => <path key={y} d={`M24 ${y}Q200 ${y + (k - 2) * 10} 376 ${y}`} />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <path d="M30 120c30-34 60-50 100-44c30 4 40-22 76-26c44-4 70 22 110 24c24 2 40 14 52 30" strokeOpacity="0.55" />
        <path d="M30 124c30-34 60-50 100-44c30 4 40-22 76-26c44-4 70 22 110 24c24 2 40 14 52 30" strokeOpacity="0.25" />
        {roads.map((d, k) => <path key={k} d={d} strokeWidth="1.4" />)}
        {[[52, 214], [350, 84], [70, 78], [338, 226], [196, 150], [196, 40], [160, 262]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k === 4 ? 5 : 3} fill="#07090d" />)}
        <g transform="translate(332 150)">
          <circle r="20" strokeOpacity="0.6" />
          <path d="M0 -26L5 -5L26 0L5 5L0 26L-5 5L-26 0L-5 -5z" />
        </g>
      </g>
      <g className="l-front" fill="none">
        {roads.map((d, k) => <Mover key={k} path={d} dur={7 + k * 2} begin={k * 1.2} />)}
        <path d={roads[v % 3]} stroke={A} className="flow glow" strokeOpacity="0.8" />
        {v === 2 && <circle cx="196" cy="150" r="22" stroke={A} className="ring" />}
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ MileMaker: truck routing and mileage */
function MileMaker() {
  const n: [number, number][] = [[46, 94], [112, 60], [96, 176], [170, 126], [150, 232], [232, 78], [240, 190], [300, 132], [346, 72], [352, 216]]
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7], [5, 8], [7, 8], [7, 9], [6, 9], [1, 5]]
  const route = [0, 2, 3, 6, 7, 8].map((k, j) => `${j ? 'L' : 'M'}${n[k][0]} ${n[k][1]}`).join('')
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.28" fill="none">
        {links.map(([a, b], k) => <line key={k} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {n.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="4" fill="#07090d" />)}
        <path d="M40 262h200" />
        {Array.from({ length: 21 }, (_, k) => <line key={k} x1={40 + k * 10} y1="262" x2={40 + k * 10} y2={k % 5 === 0 ? 252 : 257} />)}
      </g>
      <g className="l-front" fill="none">
        <path d={route} stroke={A} strokeWidth="1.6" className="draw glow" pathLength={1} />
        <path d={route} stroke={A} strokeWidth="4" strokeDasharray="0.1 12" strokeOpacity="0.55" />
        <Mover path={route} dur={8} r={3.2} />
        <circle cx={n[8][0]} cy={n[8][1]} r="12" stroke={A} className="ring" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Wellcove: long-term-care insurance administration */
function Wellcove({ v }: V) {
  const arc = 'M92 96Q200 20 308 96'
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.2" fill="none">
        {Array.from({ length: 11 }, (_, k) => <line key={k} x1={70 + k * 26} y1="150" x2={200 + (k - 5) * 14} y2="66" strokeDasharray="2 6" />)}
      </g>
      <g className="l-mid" stroke={B} fill="none">
        {Array.from({ length: 11 }, (_, k) => {
          const x = 70 + k * 26
          return (
            <g key={k} strokeOpacity={k % 2 ? 0.7 : 1}>
              <rect x={x - 4} y="156" width="8" height="78" />
              <path d={`M${x - 7} 156h14M${x - 7} 234h14M${x} 156v78`} strokeOpacity="0.5" />
            </g>
          )
        })}
        <path d="M52 240h296M44 247h312" />
        <path d={arc} />
        {[[92, 96], [200, 58], [308, 96]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="9" fill="#07090d" stroke={v && k === 2 ? A : B} />)}
        <path d="M88 96h8M92 92v8M196 58h8M304 96h8" strokeOpacity="0.7" />
      </g>
      <g className="l-front" fill="none">
        <Mover path={arc} dur={5} />
        <Mover path="M308 96Q200 20 92 96" dur={5} begin={2.5} />
        {[2, 5, 8].map((k, j) => <rect key={k} x={66 + k * 26} y="156" width="8" height="78" stroke={A} className="pulse" style={i(j * 2)} />)}
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ Teesnap: golf course management */
function Teesnap() {
  const fairway = 'M64 228C120 236 150 190 190 170S270 150 322 92'
  return (
    <>
      <g className="l-back" stroke={B} strokeOpacity="0.2" fill="none">
        <path d="M34 232c10-60 70-70 120-96s90-90 160-96c40-4 60 30 50 60c-14 44-70 50-110 80s-70 90-150 96c-44 4-76-12-70-44z" />
        <path d="M22 240c8-78 80-86 130-112s96-104 170-108c54-4 78 44 62 82c-20 50-76 56-116 86s-74 96-158 100c-56 4-96-14-88-48z" />
        <ellipse cx="300" cy="210" rx="40" ry="20" />
        <ellipse cx="90" cy="90" rx="34" ry="22" />
      </g>
      <g className="l-mid" stroke={B} fill="none">
        <path d={fairway} strokeWidth="30" strokeOpacity="0.14" strokeLinecap="round" />
        <path d={fairway} strokeDasharray="1 7" />
        <circle cx="322" cy="92" r="22" />
        <circle cx="322" cy="92" r="2" fill={B} />
        <path d="M322 92V58l16 7l-16 7" />
        <ellipse cx="232" cy="130" rx="14" ry="7" strokeDasharray="2 3" />
        <ellipse cx="150" cy="222" rx="12" ry="6" strokeDasharray="2 3" />
        <rect x="52" y="220" width="22" height="14" />
      </g>
      <g className="l-front">
        {[0, 2, 4, 6, 8].map((b) => <Mover key={b} path={fairway} dur={10} begin={b} />)}
        <circle cx="322" cy="92" r="22" fill="none" stroke={A} className="ring" />
      </g>
    </>
  )
}

export const VISUALS: Record<string, (p: V) => ReactNode> = {
  modersys: Modersys,
  numodata: NumoData,
  softrax: Softrax,
  sharpen: Sharpen,
  flatirons: Flatirons,
  univeris: Univeris,
  'industrial-defender': IndustrialDefender,
  paxia: Paxia,
  umt360: Umt360,
  'rand-mcnally': RandMcNally,
  milemaker: MileMaker,
  wellcove: Wellcove,
  teesnap: Teesnap,
}

/** Plain-language description of each drawing, used as alt text. */
export const VISUAL_ALT: Record<string, string> = {
  modersys: 'Vials advancing along a production line beneath a molecular lattice and a steadying control curve',
  numodata: 'A mesh of network nodes over contour terrain, with signal pulses rerouting around a faulted link',
  softrax: 'Ledger lines flowing into concentric rings that turn in recurring cycles',
  sharpen: 'Five different communication channels converging on a single point and leaving as one clean line',
  flatirons: 'An aircraft drawn in plan with each part tethered to a page of technical content',
  univeris: 'Scattered account nodes flowing through a central gate into an ordered grid',
  'industrial-defender': 'An industrial plant schematic swept by a scan line, each asset ringed by a shield',
  paxia: 'An aircraft cabin in plan with galley carts travelling the aisle between galleys',
  umt360: 'Scattered blocks aligning into a single ordered colonnade under one roof',
  'rand-mcnally': 'An engraved map with a compass rose and vehicles moving along live routes',
  milemaker: 'A road network with one route drawn and measured against a scale bar',
  wellcove: 'A careful row of slender columns beneath an arc connecting three parties',
  teesnap: 'A golf hole in topographic lines with evenly spaced tee times moving toward the green',
}

/** The shared frame: border, corner ticks, plinth and label. Same for every company. */
export function MetopeSvg({ slug, variant = 0, label }: { slug: string; variant?: number; label?: string }) {
  const Visual = VISUALS[slug]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={VISUAL_ALT[slug] ?? ''} fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="8.5" width="383" height="283" stroke={B} strokeOpacity="0.35" />
      <path d="M8.5 24.5v-16h16M375.5 8.5h16v16M391.5 275.5v16h-16M24.5 291.5h-16v-16" stroke={B} strokeWidth="1.6" />
      <path d="M16 280h14v-8h-8v5h4" stroke={B} strokeOpacity="0.6" />
      {label && (
        <text x="38" y="282" fill={M} fillOpacity="0.55" fontSize="7.5" letterSpacing="2" fontFamily="var(--font-mono)">
          {label.toUpperCase()}
        </text>
      )}
      {Array.from({ length: variant }, (_, k) => <rect key={k} x={376 - k * 8} y="276" width="4" height="4" fill={A} />)}
      {Visual ? <Visual v={variant} /> : null}
    </svg>
  )
}
