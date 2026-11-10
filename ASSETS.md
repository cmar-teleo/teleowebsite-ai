# Image and 3D asset list

Every visual on the site is original and generated in code. No stock imagery, no AI image prompts, no external textures or model files were used, so each entry below gives the **method** in place of a prompt.

Palette used throughout: midnight `#07090D`, obsidian `#10141B`, marble `#EDE6DA`, bronze `#B8864B`, electric aegean `#4FD8FF` (only on things that move or carry data).

## 3D

| Asset | Location | Method |
|---|---|---|
| Hero scene: parent colonnade | `src/components/three/HeroScene.tsx` | Three.js via React Three Fiber. Columns are a tapered `CylinderGeometry` whose radius is scalloped around the circumference to make 16 flutes, drawn as two instanced rows of nine. Capitals, entablature and stylobate are boxes; the pediment is an extruded triangle. Marble is a standard material lit by one warm key light, a cool rim light and a hemisphere light, in exponential fog. |
| Hero scene: carved-out column | same | One high-resolution fluted column on a Catmull-Rom path from its slot to its own plinth. Its marble fades to a wireframe (`WireframeGeometry`) and a point cloud of its own vertices in electric aegean, then re-solidifies. |
| Hero scene: standalone temple | same | Two companion columns scale up from the plinth, a lintel grows from the centre and a small extruded pediment sets on top, all driven by scroll progress. |
| Hero scene: telos arc | same | A `TubeGeometry` along a circle; scroll advances its draw range from a short arc to a closed circle behind the standalone temple. |
| Hero scene: Greek-key data path | same | Line segments generated from a seven-point key unit, repeated along the floor in bronze, with an electric copy revealed under the travelling column. |
| Hero scene: depth planes | same | Background: a random point field. Foreground: drifting bronze motes and a dark near-camera column the camera moves past. Camera: four keyframes per layout with cursor-reactive drift. |

## Images drawn as SVG

| Asset | Location | Method |
|---|---|---|
| Hero poster (loading) | `src/components/HeroPoster.tsx`, `state="start"` | Hand-composed SVG of the colonnade with gradient-filled columns, the short arc and the floor meander. |
| Hero still (reduced motion) | same, `state="end"` | Same composition in its finished state: arc closed, standalone temple lit, path in electric. |
| Wordmark and favicon | `src/components/Wordmark.tsx`, `src/app/icon.svg` | An open bronze arc around a T, set with the serif wordmark. |
| Site arc | `src/components/SiteArc.tsx` | A fixed SVG circle whose stroke offset follows page scroll. |
| Meander rules | `src/app/globals.css` (`.meander`) | A 24 x 20 Greek-key tile as an inline SVG background. |
| Film grain | `src/app/globals.css` (`.grain`) | SVG `feTurbulence` noise, blended at low opacity. |
| Page hero motifs: arc, columns, meander, laurel, code column | `src/components/PageHero.tsx` | Generated in JSX: concentric dashed arcs; a receding wireframe colonnade; a field of key units with one live row; laurel leaves placed along two arcs; a column assembled from rows of code glyphs. |
| Carve-out diagram | `src/components/CarveOutDiagram.tsx` | SVG scrubbed by a GSAP timeline: the division moves out of the parent, four ties release in turn and are redrawn as its own, and an arc closes around it. Qualitative only. |
| Portfolio map | `src/components/PortfolioMap.tsx` | SVG generated from `content/data.json`: one row per platform at its year of investment, add-ons threaded on at the year they joined. |
| Three Ps rings | `src/components/Extras.tsx` | Three concentric half rings with nodes. |
| TSA comparison bars | `src/components/Extras.tsx` | Two CSS bars; lengths are illustrative, labels are from the copy. |

## Portfolio visuals ("metopes")

All in `src/components/visuals/metopes.tsx`, each a 400 x 300 SVG in a shared frame with three parallax layers: faint structure, bronze subject, electric motion. Motion uses SMIL `animateMotion` / `animateTransform` and CSS keyframes. Add-ons reuse their platform's drawing with a variant that shifts the emphasised element.

| Company (add-ons) | Function | Method |
|---|---|---|
| Modersys | `Modersys` | Vials stepping along a roller conveyor; three hexagonal rings whose bonds draw in; a damped sine control curve with a travelling point. |
| NumoData | `NumoData` | Sine-generated contour lines; eight nodes and ten links; three masts emitting rings; pulses on two routes and a live reroute around a dashed, faulted link. |
| Softrax (BluLogix) | `Softrax` | Ledger rules flowing along Bezier paths into three counter-rotating dashed rings, with points orbiting each ring. |
| Sharpen (Plum Voice, Ytel, Webtext) | `Sharpen` | Five channels with different stroke patterns converging on a hub and leaving as one solid line. Each add-on highlights one channel. |
| Flatirons (Scope AR) | `Flatirons` | Aircraft in plan with wings and engines offset, dashed leaders to four page icons. The Scope AR variant adds pulsing step markers on the parts. |
| Univeris (TechRules) | `Univeris` | Scattered account nodes flowing along S-curves through a small gate into a 3 x 4 grid. |
| Industrial Defender | `IndustrialDefender` | Orthogonal pipework, tanks, valves and a controller on a grid; a scan line sweeps across; each asset is ringed by a shield outline. |
| Paxia | `Paxia` | Cabin plan with fifteen seat rows and two galleys; two carts travel the aisle and back. |
| UMT360 (Fios, Western Principles) | `Umt360` | Seven rotated blocks animate into an aligned colonnade, a pediment appears, then they disperse. |
| Rand McNally (Fleetsu, SafetyDirect) | `RandMcNally` | Curved graticule, a double-line coast, three roads, a compass rose, and vehicles on each road. |
| MileMaker | `MileMaker` | Ten cities and fifteen links; one route drawn in electric with distance dots and a travelling point; a tick-marked scale bar with no numbers. |
| Wellcove (AssuriCare) | `Wellcove` | Eleven slender columns on a plinth under an arc joining three nodes, with points travelling the arc both ways. |
| Teesnap | `Teesnap` | Topographic contours, a fairway stroke, green, flag and bunkers; five evenly spaced points move from tee to green. |

## Open Graph images

43 PNGs at 1200 x 630 in `public/og/`, one per page, portfolio company and case study.

Method: `scripts/generate-og.mjs` composes each card as SVG (radial midnight field, bronze arc, a wireframe temple, a Greek-key rule, mono eyebrow, serif title from the page's own heading) and rasterises it with sharp. Titles use the Georgia system font. Regenerate with `npm run og`.

| File pattern | Used by |
|---|---|
| `home.png` | Home |
| `firm.png`, `culture.png`, `responsibility.png`, `strategy.png`, `criteria.png`, `sellers.png`, `bankers.png`, `ai.png`, `privacy.png`, `terms.png` | The matching page |
| `portfolio.png`, `case-studies.png`, `team.png`, `news.png`, `contact.png` | The matching page |
| `portfolio-<slug>.png` (24) | Each company page |
| `case-<slug>.png` (3) | Each case study |

## Fonts

Cormorant (headings), Geist (body) and Geist Mono (labels), loaded through `next/font/google` and self-hosted in the build output. All three are open-source (SIL Open Font License).
