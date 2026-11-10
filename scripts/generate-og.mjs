// Generates the Open Graph images in public/og (1200 x 630 JPEG), one per page.
// Run: npm run og   (run `npm run paint` first; the cards use the hero fresco)
// Method: the finished hero fresco as the ground, darkened on the left for the page's
// own heading, one orange rule, and the real TELEO logo file on a white plate (the logo
// is never redrawn or recoloured). Rasterised with sharp. Titles use the Georgia system serif.
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
  const lines = []
  let line = ''
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim())
      line = w
    } else line += ' ' + w
  }
  if (line.trim()) lines.push(line.trim())
  return lines.slice(0, 4)
}

function overlay({ label, title }) {
  const size = title.length > 60 ? 50 : title.length > 34 ? 62 : 84
  const lines = wrap(title, title.length > 60 ? 28 : title.length > 34 ? 22 : 16)
  const lh = size * 1.1
  const y0 = 400 - ((lines.length - 1) * lh) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0e0c0a" stop-opacity="0.96"/><stop offset="0.55" stop-color="#0e0c0a" stop-opacity="0.8"/><stop offset="1" stop-color="#0e0c0a" stop-opacity="0.05"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="70" y="50" width="206" height="118" fill="#ffffff"/>
  <rect x="70" y="${y0 - size - 58}" width="64" height="5" fill="#f96015"/>
  <text x="70" y="${y0 - size - 12}" font-family="${MONO}" font-size="19" letter-spacing="4" fill="#ede6da" fill-opacity="0.8">${esc(label.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="70" y="${y0 + i * lh}" font-family="${FONT}" font-size="${size}" fill="#ede6da">${esc(l)}</text>`).join('\n  ')}
</svg>`
}

const cards = [{ file: 'home', label: 'Operators with Capital', title: 'We acquire and build complex software and technology businesses' }]
for (const [key, p] of Object.entries(pages)) {
  if (key === 'home') continue
  const hero = p.sections[0]
  cards.push({ file: key, label: hero.eyebrow ?? 'TELEO Capital', title: hero.heading ?? p.title })
}
for (const c of data.portfolio) cards.push({ file: `portfolio-${c.slug}`, label: `Portfolio · ${c.sector}`, title: c.name })
for (const c of data.caseStudies) cards.push({ file: `case-${c.slug}`, label: `Case Study · ${c.type}`, title: c.name })

// ground: the right-hand part of the finished fresco (the temple that stands alone, inside the arc)
const ground = await sharp(path.join(root, 'public/plates/hero-end.webp')).extract({ left: 640, top: 60, width: 960, height: 504 }).resize(1200, 630).png().toBuffer()
// the brand file, scaled as-is (132 x 72 source)
const logo = await sharp(path.join(root, 'public/brand/teleologo1.png')).resize({ width: 170, kernel: 'lanczos3' }).toBuffer()

for (const c of cards) {
  await sharp(ground)
    .composite([
      { input: Buffer.from(overlay(c)), left: 0, top: 0 },
      { input: logo, left: 88, top: 63 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, `${c.file}.jpg`))
}
console.log(`wrote ${cards.length} images to public/og`)
