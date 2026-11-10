// Generates the Open Graph images in public/og (1200 x 630 PNG), one per page.
// Run: npm run og
// Method: each card is composed as SVG (midnight field, bronze telos arc, Greek key, serif title)
// and rasterised with sharp. Titles use the Georgia system serif, so re-run on a machine that has it
// (Windows and macOS do) or change FONT below. Output files are committed; the build does not need this script.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public', 'og')
fs.mkdirSync(out, { recursive: true })

const pages = JSON.parse(fs.readFileSync(path.join(root, 'content/pages.json'), 'utf8'))
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/data.json'), 'utf8'))
const FONT = "Georgia, 'Times New Roman', serif"
const MONO = "Consolas, 'Courier New', monospace"

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function wrap(text, max) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim())
      line = w
    } else line += ' ' + w
  }
  if (line.trim()) lines.push(line.trim())
  return lines.slice(0, 4)
}

function card({ eyebrow, title, arc = 0.72 }) {
  const size = title.length > 60 ? 54 : title.length > 34 ? 66 : 84
  const lines = wrap(title, title.length > 60 ? 34 : title.length > 34 ? 26 : 20)
  const lh = size * 1.08
  const y0 = 340 - ((lines.length - 1) * lh) / 2
  const key = Array.from({ length: 40 }, (_, i) => `<path d="M${i * 30} 18h27v-16h-20v10h10v-5" />`).join('')
  const C = 2 * Math.PI * 250
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="0.78" cy="0.5" r="0.6"><stop offset="0" stop-color="#1a1610"/><stop offset="1" stop-color="#07090d"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="930" cy="315" r="250" fill="none" stroke="#ede6da" stroke-opacity="0.08"/>
  <circle cx="930" cy="315" r="250" fill="none" stroke="#b8864b" stroke-width="3" stroke-dasharray="${C * arc} ${C}" transform="rotate(-90 930 315)"/>
  <circle cx="930" cy="65" r="6" fill="#4fd8ff"/>
  <g stroke="#ede6da" stroke-opacity="0.5" fill="none">
    ${[-60, -20, 20, 60].map((dx) => `<rect x="${930 + dx - 11}" y="225" width="22" height="170"/>`).join('')}
    <path d="M846 225h168M838 213h184M930 170l-92 43M930 170l92 43M846 395h168M834 407h192"/>
  </g>
  <g transform="translate(0 592)" stroke="#b8864b" stroke-opacity="0.55" fill="none" stroke-width="1.6">${key}</g>
  <text x="80" y="92" font-family="${FONT}" font-size="30" letter-spacing="9" fill="#ede6da">TELEO</text>
  <text x="80" y="${y0 - size - 6}" font-family="${MONO}" font-size="19" letter-spacing="5" fill="#d9a868">${esc(eyebrow.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="80" y="${y0 + i * lh}" font-family="${FONT}" font-size="${size}" fill="#ede6da">${esc(l)}</text>`).join('\n  ')}
</svg>`
}

const cards = [{ file: 'home', eyebrow: 'Operators with Capital', title: 'We acquire and build complex software and technology businesses', arc: 1 }]
for (const [key, p] of Object.entries(pages)) {
  if (key === 'home') continue
  const hero = p.sections[0]
  cards.push({ file: key, eyebrow: hero.eyebrow ?? 'TELEO Capital', title: hero.heading ?? p.title })
}
for (const c of data.portfolio) cards.push({ file: `portfolio-${c.slug}`, eyebrow: `Portfolio · ${c.sector}`, title: c.name, arc: c.status === 'Realized' ? 1 : 0.72 })
for (const c of data.caseStudies) cards.push({ file: `case-${c.slug}`, eyebrow: `Case Study · ${c.type}`, title: c.name, arc: 1 })

for (const c of cards) {
  await sharp(Buffer.from(card(c))).png({ compressionLevel: 9, palette: true, colours: 128 }).toFile(path.join(out, `${c.file}.png`))
}
console.log(`wrote ${cards.length} images to public/og`)
