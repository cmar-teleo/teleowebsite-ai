// Paints the fresco plates in public/plates as WebP layers.   Run: npm run paint
//
// One language for every illustrated plate: dark-ground fresco. Mineral pigments on plaster
// (yellow ochre, red ochre, chalk white, vine black, a dull earth green, Egyptian blue used
// rarely), laid on in visible, uneven brush strokes over a mottled, cracked wall.
// Nothing here is a 3D model: every shape is a set of hand-jittered strokes, roughened and
// broken up by pigment filters, then rasterised with sharp.
//
// The hero is painted as SEPARATE LAYERS (wall, arc, parent temple, the column, its
// underdrawing, the new temple, floor band) so the site can move them in depth.
// Each layer is an ordinary image: to use a real painting, replace the file and keep its
// place in manifest.json.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public', 'plates')
fs.mkdirSync(out, { recursive: true })

/* ------------------------------------------------------------------ palette */
const P = {
  black: '#14110e', // vine black
  umber: '#2a221a',
  chalk: '#e8e0cc', // chalk white
  ochre: '#c9993c', // yellow ochre
  red: '#a2452a', // red ochre
  green: '#66724a', // earth green
  blue: '#31609f', // Egyptian blue
}

/* ------------------------------------------------------------------ helpers */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
let R = rng(1)
const rr = (a, b) => a + (b - a) * R()
const f = (n) => n.toFixed(1)

/** A single brush stroke through points, wobbling like a loaded brush on plaster. */
function stroke(pts, { w = 10, c = P.chalk, o = 1, j = 2, cap = 'round', hard = false } = {}) {
  if (hard) {
    const d = 'M' + pts.map((p) => `${f(p[0] + rr(-j, j))} ${f(p[1] + rr(-j, j))}`).join('L')
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-opacity="${o.toFixed(2)}" stroke-linecap="square" stroke-linejoin="miter"/>`
  }
  const q = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const len = Math.hypot(x1 - x0, y1 - y0)
    const n = Math.max(1, Math.round(len / 46))
    for (let k = 0; k < n; k++) {
      const t = k / n
      q.push([x0 + (x1 - x0) * t + rr(-j, j), y0 + (y1 - y0) * t + rr(-j, j)])
    }
  }
  q.push(pts[pts.length - 1])
  let d = `M${f(q[0][0])} ${f(q[0][1])}`
  for (let i = 1; i < q.length - 1; i++) {
    const mx = (q[i][0] + q[i + 1][0]) / 2
    const my = (q[i][1] + q[i + 1][1]) / 2
    d += `Q${f(q[i][0])} ${f(q[i][1])} ${f(mx)} ${f(my)}`
  }
  d += `L${f(q[q.length - 1][0])} ${f(q[q.length - 1][1])}`
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-opacity="${o.toFixed(2)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`
}

/** Fill a rectangle with parallel strokes (dir 'v' or 'h'), slightly overlapping and uneven. */
function wash(x, y, w, h, { c, o = 0.9, dir = 'h', bw = 18, j = 2.5, vary = 0.15 } = {}) {
  let s = ''
  if (dir === 'h') {
    const n = Math.max(1, Math.ceil(h / (bw * 0.72)))
    for (let i = 0; i < n; i++) {
      const yy = y + (h * (i + 0.5)) / n
      s += stroke([[x + rr(-4, 6), yy], [x + w + rr(-6, 4), yy + rr(-2, 2)]], { w: bw * rr(0.85, 1.15), c, o: o * rr(1 - vary, 1), j })
    }
  } else {
    const n = Math.max(1, Math.ceil(w / (bw * 0.72)))
    for (let i = 0; i < n; i++) {
      const xx = x + (w * (i + 0.5)) / n
      s += stroke([[xx, y + rr(-4, 6)], [xx + rr(-2, 2), y + h + rr(-6, 4)]], { w: bw * rr(0.85, 1.15), c, o: o * rr(1 - vary, 1), j })
    }
  }
  return s
}

/** Pigment filters: rough the edges, then let the plaster show through unevenly. */
const defs = (seed = 3) => `
<defs>
  <filter id="paint" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${seed}" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="${seed + 11}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.12" result="ga"/>
    <feComposite in="d" in2="ga" operator="in" result="p1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" seed="${seed + 23}" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 0.28" result="ba"/>
    <feComposite in="p1" in2="ba" operator="in"/>
  </filter>
  <filter id="line" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${seed + 5}" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="${seed + 9}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.2" result="ga"/>
    <feComposite in="d" in2="ga" operator="in"/>
  </filter>
  <filter id="plaster" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="4" seed="${seed + 2}" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0.20 0 0 0 0.02  0.15 0 0 0 0.02  0.10 0 0 0 0.02  0 0 0 0 1" result="tone"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${seed + 4}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.75  0 0 0 0 0.68  0 0 0 0 0.56  1.6 0 0 0 -0.98" result="speck"/>
    <feMerge><feMergeNode in="tone"/><feMergeNode in="speck"/></feMerge>
  </filter>
</defs>`

const svg = (w, h, body, seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs(seed)}${body}</svg>`

/** A crack: a jagged dark line with a pale chipped edge. */
function crack(x, y, len, ang, seed) {
  const r = rng(seed)
  let px = x
  let py = y
  let a = ang
  let d = `M${f(px)} ${f(py)}`
  for (let i = 0; i < len / 26; i++) {
    a += (r() - 0.5) * 0.9
    px += Math.cos(a) * 26
    py += Math.sin(a) * 26
    d += `L${f(px)} ${f(py)}`
  }
  return `<path d="${d}" fill="none" stroke="#9c8e73" stroke-opacity="0.28" stroke-width="3.2" transform="translate(1.5 1.5)"/><path d="${d}" fill="none" stroke="#050403" stroke-opacity="0.9" stroke-width="1.6"/>`
}

/* ------------------------------------------------------------------ subjects */
/** A fluted column painted in chalk white with ochre shade and red-ochre drawing. */
function column(cx, base, h, w) {
  const top = base - h
  const wt = w * 0.82
  let s = ''
  // body: broad vertical strokes of chalk, uneven
  const n = 5
  for (let i = 0; i < n; i++) {
    const k = (i + 0.5) / n - 0.5
    s += stroke([[cx + k * w, base - 2], [cx + k * wt, top + 4]], { w: (w / n) * 1.35, c: P.chalk, o: rr(0.78, 0.98), j: 1.6 })
  }
  // shade on the right in thin ochre wash
  s += stroke([[cx + w * 0.3, base - 4], [cx + wt * 0.3, top + 8]], { w: w * 0.22, c: P.ochre, o: 0.42, j: 2 })
  s += stroke([[cx + w * 0.42, base - 4], [cx + wt * 0.42, top + 8]], { w: w * 0.12, c: P.red, o: 0.3, j: 2 })
  // flutes drawn with the brush tip in red ochre
  for (const k of [-0.33, -0.16, 0, 0.16, 0.32]) s += stroke([[cx + k * w, base - 6], [cx + k * wt, top + 16]], { w: rr(1.6, 2.8), c: P.red, o: rr(0.45, 0.75), j: 1.2 })
  // capital: echinus and abacus
  s += stroke([[cx - wt * 0.62, top - 8], [cx + wt * 0.62, top - 8]], { w: 20, c: P.chalk, o: 0.95, j: 1.2, cap: 'butt' })
  s += stroke([[cx - wt * 0.86, top - 28], [cx + wt * 0.86, top - 28]], { w: 20, c: P.chalk, o: 0.97, j: 1.2, cap: 'butt' })
  s += stroke([[cx - wt * 0.56, top + 6], [cx + wt * 0.56, top + 6]], { w: 4, c: P.red, o: 0.8, j: 1 })
  s += stroke([[cx - wt * 0.86, top - 18], [cx + wt * 0.86, top - 18]], { w: 2.2, c: P.red, o: 0.6, j: 1 })
  return s
}

/** The same column as an underdrawing (sinopia): red ochre line only, searching and doubled. */
function sinopia(cx, base, h, w) {
  const top = base - h
  const wt = w * 0.82
  let s = ''
  for (let pass = 0; pass < 2; pass++) {
    const o = pass ? 0.5 : 0.85
    s += stroke([[cx - w / 2, base], [cx - wt / 2, top]], { w: 2.6, c: P.red, o, j: 2.4 })
    s += stroke([[cx + w / 2, base], [cx + wt / 2, top]], { w: 2.6, c: P.red, o, j: 2.4 })
    s += stroke([[cx - wt * 0.86, top - 38], [cx + wt * 0.86, top - 38], [cx + wt * 0.86, top - 18], [cx - wt * 0.86, top - 18], [cx - wt * 0.86, top - 38]], { w: 2.2, c: P.red, o, j: 2 })
    s += stroke([[cx - wt * 0.86, top - 18], [cx - wt / 2, top], [cx + wt / 2, top], [cx + wt * 0.86, top - 18]], { w: 2.2, c: P.red, o, j: 2 })
  }
  for (const k of [-0.33, -0.16, 0, 0.16, 0.32]) s += stroke([[cx + k * w, base - 6], [cx + k * wt, top + 10]], { w: 1.6, c: P.red, o: 0.55, j: 2 })
  s += stroke([[cx - w * 0.7, base], [cx + w * 0.7, base]], { w: 2, c: P.red, o: 0.6, j: 2 })
  // plumb line and measure ticks, as a painter sets out a wall
  s += stroke([[cx, base + 14], [cx, top - 60]], { w: 1.2, c: P.chalk, o: 0.35, j: 0.8 })
  for (let i = 0; i < 6; i++) s += stroke([[cx - 8, top + (h * i) / 5], [cx + 8, top + (h * i) / 5]], { w: 1.2, c: P.chalk, o: 0.35, j: 0.6 })
  return s
}

/** A Greek key painted in one colour along a band. */
function meander(x, y, len, u, c, o = 0.9, w = 5) {
  let s = ''
  for (let k = 0; k * u * 6 < len; k++) {
    const ox = x + k * u * 6
    s += stroke(
      [[ox, y + u * 4], [ox + u * 5, y + u * 4], [ox + u * 5, y], [ox + u, y], [ox + u, y + u * 2.8], [ox + u * 3.2, y + u * 2.8], [ox + u * 3.2, y + u * 1.4]],
      { w, c, o: o * rr(0.8, 1), j: 0.7, hard: true },
    )
    s += stroke([[ox + u * 5, y + u * 4], [ox + u * 6, y + u * 4]], { w, c, o, j: 0.6, cap: 'butt' })
  }
  return s
}

function steps(x0, x1, y, n = 3, hh = 22) {
  let s = ''
  for (let i = 0; i < n; i++) {
    s += wash(x0 - i * 22, y + i * hh, x1 - x0 + i * 44, hh, { c: i % 2 ? '#cfc4a8' : P.chalk, o: 0.9, bw: hh * 1.2, j: 1.4 })
    s += stroke([[x0 - i * 22, y + (i + 1) * hh], [x1 + i * 22, y + (i + 1) * hh]], { w: 2, c: P.red, o: 0.55, j: 1 })
  }
  return s
}

function pediment(x0, x1, y, apexH) {
  const mx = (x0 + x1) / 2
  let s = ''
  // tympanum laid in with ochre, row by row
  const rows = Math.floor(apexH / 15)
  for (let i = 0; i < rows; i++) {
    const t = (i + 0.5) / rows
    const half = ((x1 - x0) / 2) * (1 - t) - 12
    if (half < 10) break
    s += stroke([[mx - half, y - t * apexH], [mx + half, y - t * apexH]], { w: 17, c: P.ochre, o: rr(0.7, 0.92), j: 1.8 })
  }
  s += stroke([[x0, y], [mx, y - apexH], [x1, y]], { w: 13, c: P.chalk, o: 0.95, j: 1.6 })
  s += stroke([[x0 + 30, y - 6], [mx, y - apexH + 20], [x1 - 30, y - 6]], { w: 2.4, c: P.red, o: 0.7, j: 1.4 })
  return s
}

function entablature(x0, x1, y) {
  // y is the underside. architrave (chalk), frieze (red ochre with a chalk key), cornice (ochre)
  let s = ''
  s += wash(x0, y - 50, x1 - x0, 50, { c: P.chalk, o: 0.94, bw: 26, j: 1.6 })
  s += wash(x0, y - 104, x1 - x0, 54, { c: P.red, o: 0.92, bw: 28, j: 1.8 })
  s += meander(x0 + 14, y - 96, x1 - x0 - 28, 9.5, P.chalk, 0.9, 4.6)
  s += wash(x0 - 14, y - 124, x1 - x0 + 28, 20, { c: P.ochre, o: 0.92, bw: 20, j: 1.4 })
  s += stroke([[x0, y - 50], [x1, y - 50]], { w: 2, c: P.black, o: 0.5, j: 1 })
  return s
}

/* ------------------------------------------------------------------ the hero world */
const W = 2400
const H = 1200
const FLOOR = 934 // top of the stylobate
const COL_H = 470
const COL_W = 64
const COLS = Array.from({ length: 8 }, (_, i) => 300 + i * 150)
const GAP = 5
const SITE = 1900 // where the carved-out column comes to stand
const ARC = { cx: SITE, cy: 560, r: 430 }

const layers = {}

async function save(name, body, { crop, seed = 3, w = W, h = H, opaque = false, q = 72, scale = 1 } = {}) {
  let img = sharp(Buffer.from(svg(w, h, body, seed)))
  const box = crop ?? { left: 0, top: 0, width: w, height: h }
  if (crop) img = img.extract(crop)
  if (scale !== 1) img = sharp(await img.png().toBuffer()).resize(Math.round(box.width * scale))
  await img.webp({ quality: q, alphaQuality: 80, effort: 6 }).toFile(path.join(out, `${name}.webp`))
  layers[name] = { src: `/plates/${name}.webp`, x: box.left, y: box.top, w: box.width, h: box.height, opaque }
  const kb = Math.round(fs.statSync(path.join(out, `${name}.webp`)).size / 1024)
  console.log(name.padEnd(18), `${box.width}x${box.height}`, `${kb} KB`)
}

/* wall: dark plaster, mottled, cracked, worn, with a rare wash of Egyptian blue for sky */
R = rng(11)
{
  let b = `<rect width="${W}" height="${H}" fill="${P.black}"/><rect width="${W}" height="${H}" filter="url(#plaster)" opacity="0.9"/>`
  let sky = ''
  for (let i = 0; i < 9; i++) sky += stroke([[rr(-60, 200), 70 + i * 34], [W + 40, 60 + i * 34 + rr(-14, 14)]], { w: rr(40, 70), c: P.blue, o: rr(0.05, 0.12), j: 7 })
  b += `<g filter="url(#paint)">${sky}</g>`
  // worn patches where pale plaster shows
  let worn = ''
  for (let i = 0; i < 16; i++) {
    const x = rr(0, W)
    const y = rr(0, H)
    worn += stroke([[x, y], [x + rr(-160, 160), y + rr(-60, 60)], [x + rr(-200, 200), y + rr(-90, 90)]], { w: rr(30, 110), c: '#b8a987', o: rr(0.04, 0.1), j: 14 })
  }
  b += `<g filter="url(#paint)">${worn}</g>`
  // ground: a darker red-ochre dado below the floor line
  b += `<g filter="url(#paint)">${wash(-20, 1004, W + 40, 196, { c: '#3a1c12', o: 0.75, bw: 46, j: 5 })}${stroke([[-20, 1002], [W + 20, 1002]], { w: 5, c: P.ochre, o: 0.5, j: 2 })}</g>`
  b += crack(380, 0, 520, 1.25, 4) + crack(1500, 60, 700, 1.9, 9) + crack(2250, 300, 420, 2.4, 14) + crack(900, 1200, 380, -1.2, 21) + crack(60, 700, 300, 0.2, 30)
  await save('wall', b, { seed: 3, opaque: true, q: 56, scale: 0.67 })
}

/* the telos arc: one loaded brush of yellow ochre, twice round */
R = rng(21)
{
  const ring = (r, w, o) => {
    const pts = []
    for (let i = 0; i <= 72; i++) {
      const a = -Math.PI / 2 + (i / 72) * Math.PI * 2
      pts.push([ARC.cx + Math.cos(a) * r, ARC.cy + Math.sin(a) * r])
    }
    return stroke(pts, { w, c: P.ochre, o, j: 1.6 })
  }
  const b = `<g filter="url(#paint)">${ring(ARC.r, 15, 0.9)}${ring(ARC.r - 5, 7, 0.55)}${ring(ARC.r + 10, 2.5, 0.6)}</g>`
  const m = 40
  await save('arc', b, { seed: 5, crop: { left: ARC.cx - ARC.r - m, top: ARC.cy - ARC.r - m, width: (ARC.r + m) * 2, height: (ARC.r + m) * 2 } })
}

/* the parent temple, with one place in the colonnade left empty */
R = rng(31)
{
  let b = steps(COLS[0] - 70, COLS[7] + 70, FLOOR)
  COLS.forEach((cx, i) => {
    if (i !== GAP) b += column(cx, FLOOR, COL_H, COL_W)
  })
  const y = FLOOR - COL_H - 38
  b += entablature(COLS[0] - 62, COLS[7] + 62, y)
  b += pediment(COLS[0] - 84, COLS[7] + 84, y - 124, 150)
  // a wreath in earth green in the gable, and the name on the architrave
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2
    const cx = (COLS[0] + COLS[7]) / 2 + Math.cos(a) * 30
    const cy = y - 176 + Math.sin(a) * 30
    b += stroke([[cx, cy], [cx + Math.cos(a + 1.1) * 15, cy + Math.sin(a + 1.1) * 15]], { w: 7, c: P.green, o: 0.9, j: 0.8 })
  }
  await save('temple', `<g filter="url(#paint)">${b}</g>`, { seed: 7, q: 64, crop: { left: 150, top: 120, width: 1360, height: 900 } })
}

/* the column that leaves: painted, and as underdrawing */
const CW = 240
const CH = 640
R = rng(41)
await save('column', `<g filter="url(#paint)">${column(CW / 2, CH - 40, COL_H, COL_W)}</g>`, { seed: 9, w: CW, h: CH })
R = rng(43)
await save('column-sinopia', `<g filter="url(#line)">${sinopia(CW / 2, CH - 40, COL_H, COL_W)}</g>`, { seed: 13, w: CW, h: CH })

/* where it comes to stand: a base that waits, then a small temple painted round it */
R = rng(51)
await save('site-base', `<g filter="url(#paint)">${steps(SITE - 200, SITE + 200, FLOOR, 3)}</g>`, { seed: 15, crop: { left: SITE - 290, top: FLOOR - 20, width: 580, height: 110 } })
R = rng(53)
{
  let b = column(SITE - 130, FLOOR, COL_H, COL_W) + column(SITE + 130, FLOOR, COL_H, COL_W)
  const y = FLOOR - COL_H - 38
  b += entablature(SITE - 196, SITE + 196, y)
  b += pediment(SITE - 214, SITE + 214, y - 124, 96)
  await save('site-temple', `<g filter="url(#paint)">${b}</g>`, { seed: 17, crop: { left: SITE - 260, top: 180, width: 520, height: 780 } })
}

/* floor band: a chalk stripe carrying a red-ochre key, nearest the viewer */
R = rng(61)
{
  let b = wash(-20, 1052, W + 40, 62, { c: P.chalk, o: 0.86, bw: 34, j: 3 })
  b += meander(0, 1062, W, 10.5, P.red, 0.95, 6)
  b += stroke([[-20, 1048], [W + 20, 1048]], { w: 4, c: P.ochre, o: 0.8, j: 2 }) + stroke([[-20, 1118], [W + 20, 1118]], { w: 4, c: P.ochre, o: 0.8, j: 2 })
  await save('floor', `<g filter="url(#paint)">${b}</g>`, { seed: 19, q: 60, crop: { left: 0, top: 1030, width: W, height: 110 } })
}

/* ------------------------------------------------------------------ stills for loading and reduced motion */
async function flatten(name, names, place = {}) {
  const base = sharp(await sharp(path.join(out, 'wall.webp')).resize(W, H).png().toBuffer())
  const comps = []
  for (const n of names) {
    const l = { ...layers[n], ...(place[n] ?? {}) }
    comps.push({ input: path.join(out, `${n}.webp`), left: Math.round(l.x), top: Math.round(l.y) })
  }
  const full = await base.composite(comps).png().toBuffer()
  await sharp(full).resize(1600).webp({ quality: 70 }).toFile(path.join(out, `${name}.webp`))
  console.log(name.padEnd(18), 'still', `${Math.round(fs.statSync(path.join(out, `${name}.webp`)).size / 1024)} KB`)
}
const colHome = { x: COLS[GAP] - CW / 2, y: FLOOR - (CH - 40) }
const colSite = { x: SITE - CW / 2, y: FLOOR - (CH - 40) }
await flatten('hero-start', ['temple', 'column', 'site-base', 'floor'], { column: colHome })
await flatten('hero-end', ['arc', 'temple', 'site-base', 'site-temple', 'column', 'floor'], { column: colSite })

/* ------------------------------------------------------------------ fragments for the page heroes */
async function fragment(name, seed, paint) {
  R = rng(seed)
  const S = 900
  // an irregular broken piece of wall: dark plaster with a pale chipped rim
  const pts = []
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2
    const r = 372 + rr(-46, 40)
    pts.push([450 + Math.cos(a) * r * 1.0, 450 + Math.sin(a) * r * 1.02])
  }
  const d = 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z'
  const body = `
    <clipPath id="frag"><path d="${d}"/></clipPath>
    <path d="${d}" fill="#c9bc9c" stroke="#c9bc9c" stroke-width="16" stroke-linejoin="round" opacity="0.5" filter="url(#line)"/>
    <g clip-path="url(#frag)">
      <rect width="${S}" height="${S}" fill="#1b1612"/>
      <rect width="${S}" height="${S}" filter="url(#plaster)" opacity="0.95"/>
      <g filter="url(#paint)">${paint()}</g>
      ${crack(rr(200, 700), 60, 420, rr(1.2, 1.9), seed + 3)}
    </g>`
  R = rng(seed)
  const buf = await sharp(Buffer.from(svg(S, S, body, seed))).webp({ quality: 80, alphaQuality: 88, effort: 5 }).toBuffer()
  fs.writeFileSync(path.join(out, `${name}.webp`), buf)
  console.log(name.padEnd(18), `${S}x${S}`, `${Math.round(buf.length / 1024)} KB`)
}

await fragment('frag-columns', 101, () => {
  let b = steps(150, 750, 700, 2, 24)
  for (const cx of [270, 450, 630]) b += column(cx, 700, 400, 70)
  b += entablature(190, 710, 262)
  return b
})
await fragment('frag-arc', 111, () => {
  let b = ''
  for (const [r, w, o] of [[300, 16, 0.9], [230, 9, 0.7], [160, 6, 0.6]]) {
    const pts = []
    for (let i = 0; i <= 56; i++) {
      const a = -Math.PI / 2 + (i / 64) * Math.PI * 2
      pts.push([450 + Math.cos(a) * r, 470 + Math.sin(a) * r])
    }
    b += stroke(pts, { w, c: r === 230 ? P.red : P.ochre, o, j: 1.6 })
  }
  b += `<circle cx="450" cy="470" r="20" fill="${P.chalk}"/>`
  return b
})
await fragment('frag-meander', 121, () => {
  let b = ''
  ;[[250, P.chalk, P.red], [400, P.red, P.chalk], [550, P.ochre, P.black]].forEach(([y, band, key]) => {
    b += wash(40, y, 820, 96, { c: band, o: 0.9, bw: 34, j: 2.4 })
    b += meander(50, y + 16, 800, 16, key, 0.95, 8)
  })
  return b
})
await fragment('frag-laurel', 131, () => {
  let b = ''
  for (const side of [1, -1]) {
    const stem = []
    for (let i = 0; i <= 20; i++) {
      const a = -1.0 + (i / 20) * 2.5
      stem.push([450 + Math.cos(a) * 260 * side, 470 - Math.sin(a) * 260])
    }
    b += stroke(stem, { w: 5, c: P.ochre, o: 0.8, j: 1.4 })
    for (let i = 1; i < 20; i++) {
      const [x, y] = stem[i]
      const a = -1.0 + (i / 20) * 2.5
      const dirx = -Math.sin(a) * side
      const diry = -Math.cos(a)
      for (const s of [1, -1]) {
        const nx = Math.cos(a) * side * s
        const ny = -Math.sin(a) * s
        b += stroke([[x, y], [x + dirx * 34 + nx * 26, y + diry * 34 + ny * 26], [x + dirx * 62 + nx * 30, y + diry * 62 + ny * 30]], { w: rr(13, 18), c: P.green, o: rr(0.8, 0.96), j: 1.2 })
      }
      if (i % 3 === 0) b += `<circle cx="${f(x + dirx * 10)}" cy="${f(y + diry * 10)}" r="7" fill="${P.red}"/>`
    }
  }
  return b
})
// AI page: a column built from rows of painted marks, like an inscription
await fragment('frag-stele', 141, () => {
  let b = steps(230, 670, 720, 2, 24)
  b += wash(300, 180, 300, 540, { c: P.chalk, o: 0.9, dir: 'v', bw: 44, j: 2.2 })
  b += stroke([[280, 172], [620, 172]], { w: 24, c: P.ochre, o: 0.92, j: 1.4, cap: 'butt' })
  for (let row = 0; row < 15; row++) {
    for (let c = 0; c < 9; c++) {
      const x = 324 + c * 29
      const y = 214 + row * 33
      const kind = Math.floor(rr(0, 5))
      const col = R() < 0.14 ? P.red : P.black
      const o = { w: 3.2, c: col, o: rr(0.6, 0.9), j: 0.7 }
      if (kind === 0) b += stroke([[x, y + 18], [x + 8, y], [x + 16, y + 18]], o)
      else if (kind === 1) b += stroke([[x, y], [x + 16, y]], o) + stroke([[x + 8, y], [x + 8, y + 18]], o)
      else if (kind === 2) b += stroke([[x + 14, y], [x, y], [x + 8, y + 9], [x, y + 18], [x + 14, y + 18]], o)
      else if (kind === 3) b += stroke([[x, y], [x, y + 18]], o) + stroke([[x, y + 9], [x + 14, y + 9]], o) + stroke([[x + 14, y], [x + 14, y + 18]], o)
      else b += `<circle cx="${x + 8}" cy="${y + 9}" r="8" fill="none" stroke="${col}" stroke-width="3" stroke-opacity="0.75"/>`
    }
  }
  return b
})

/* painted meander tile for the footer rule */
R = rng(151)
{
  const b = `<rect width="480" height="56" fill="none"/><g filter="url(#paint)">${wash(-10, 6, 500, 44, { c: P.chalk, o: 0.82, bw: 26, j: 2 })}${meander(0, 13, 480, 8, P.red, 0.95, 5)}</g>`
  await sharp(Buffer.from(svg(480, 56, b, 27))).webp({ quality: 80, alphaQuality: 88 }).toFile(path.join(out, 'meander.webp'))
}

fs.writeFileSync(
  path.join(root, 'src', 'lib', 'plates.json'),
  JSON.stringify({ world: { w: W, h: H, floor: FLOOR }, home: colHome, site: colSite, arc: ARC, column: { w: CW, h: CH }, layers }, null, 2),
)
console.log('wrote src/lib/plates.json')
