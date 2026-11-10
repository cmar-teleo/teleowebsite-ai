# TELEO Capital website

Cinematic rebuild of teleocapital.com. Next.js (App Router) + TypeScript + Tailwind CSS v4, with React Three Fiber / drei for the hero scene and GSAP ScrollTrigger + Lenis for scroll choreography.

Concept: **Telos, the completed arc.** Classical Greek forms (column, temple, meander, laurel, the arc) are rendered as luminous linework and data. Scrolling finishes things: the arc closes, the carved-out column becomes its own temple.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run start      # serve ./out locally
npm run og         # regenerate Open Graph images into public/og
npm run typecheck
```

The site is a **static export** (`output: 'export'` in `next.config.mjs`). Deploy the `out/` folder to Cloudflare Pages or any static host. Build command `npm run build`, output directory `out`.

## Where things live

| Path | What it is |
|---|---|
| `content/data.json` | Firm details, 24 portfolio companies, 3 case studies, team, news, community organizations |
| `content/pages.json` | Copy for every page, as ordered sections (eyebrow, heading, ledes, items, lists, CTAs) |
| `src/lib/content.ts` | Typed access to the content, navigation structure, list of generic pages |
| `src/app/page.tsx` | Home |
| `src/app/[page]/page.tsx` | Firm, Culture, Responsibility, Strategy, Criteria, Sellers, Bankers, AI, Privacy, Terms. Each picks a hero motif and optional inserts |
| `src/app/portfolio`, `case-studies`, `team`, `news`, `contact` | The remaining pages |
| `src/components/Sections.tsx` | Renders the copy-driven sections |
| `src/components/SmoothScroll.tsx` | Lenis, scroll progress, reveals, parallax and push-ins |
| `src/app/globals.css` | Design tokens (palette, type), component styles, reduced-motion rules |

### Editing copy

All copy is in `content/`. Edit the JSON and rebuild; no component changes are needed. To add a portfolio company, add an entry to `portfolio` in `content/data.json` (add-ons set `parent` to their platform's `slug`). It appears in the grid, the portfolio map and gets a detail page automatically. Then run `npm run og` for its share image.

The copy was taken from the approved site at teleo-website.pages.dev. The home hero's three chapters come from the original repo. Em dashes were removed.

## Asset pipeline

There are no stock images, photos, textures or 3D model files. Everything visual is generated in code, so there is nothing to compress or license. The full list, with the method for each, is in [ASSETS.md](ASSETS.md).

| Asset | File | How to swap |
|---|---|---|
| Hero 3D scene | `src/components/three/HeroScene.tsx` | Edit geometry, lights or the camera keyframes (`CAM_DESKTOP`, `CAM_MOBILE`) |
| Hero poster / reduced-motion still | `src/components/HeroPoster.tsx` | Edit the SVG, or replace the component with an `<img>` |
| Hero copy and chapter timing | `src/components/HomeHero.tsx` | `CHAPTERS` and `RANGES` |
| Portfolio visuals (13) | `src/components/visuals/metopes.tsx` | Replace one function, or map a slug to a new one in `VISUALS`. To use an image instead, return an SVG `<image>` at 400 x 300 |
| Page hero motifs | `src/components/PageHero.tsx` | `Backdrop` |
| Carve-out diagram | `src/components/CarveOutDiagram.tsx` | SVG + GSAP timeline |
| Portfolio map | `src/components/PortfolioMap.tsx` | Driven by `content/data.json` |
| Open Graph images | `public/og/*.png` | Run `npm run og`, or drop in a 1200 x 630 PNG with the same file name |
| Favicon | `src/app/icon.svg` | Replace the file |
| Fonts | `src/app/layout.tsx` | Cormorant, Geist and Geist Mono via `next/font` (self-hosted at build) |

## Motion and performance

- The hero 3D bundle is code-split and requested only after first paint, when the browser is idle. An SVG poster holds the frame until the scene is ready, and the scene stops rendering when it leaves the viewport.
- On small or portrait screens the scene uses fewer particles, lower-resolution columns, no antialiasing, a capped pixel ratio and a different camera path.
- `prefers-reduced-motion`: no smooth scroll, no 3D, no pinning. The hero shows the finished still frame, the three chapters become a plain list, diagrams show their end state and portfolio visuals hold a still frame.
- Portfolio visuals animate only while on screen.

## Contact form

`src/components/ContactForm.tsx` posts to `/api/contact` and renders a Cloudflare Turnstile widget, matching the current site. That endpoint is a Cloudflare Pages Function in the existing deployment and is **not in this repo**. Copy the existing `functions/api/contact` function into this project before going live, or the form will show its error message.

## Not included

- Google Analytics. The measurement ID is kept in `content/data.json` (`firm.gaId`) but no tag is loaded.
- Individual press release pages. News items link to their original source, as most did on the source site.
- Team photographs. The source site has none.
