# Redesign — "Engineered Precision"

## Architecture
- **Content**: Supabase stays the source of truth (admin keeps working). `src/portfolio/data/adapters.ts` maps CMS rows to typed view models (`data/types.ts`); `data/content.ts` holds a typed fallback taken verbatim from the CV seed, used while loading or when the backend is unreachable. Entry point: `hooks/use-site-content.ts`.
- **Design system**: tokens in `src/styles/globals.css` (dark + light, AA-checked), primitives in `src/portfolio/components/ds/`, motion tokens in `lib/motion.ts`.
- **Admin** is lazy-loaded (`src/admin/AdminApp.tsx`) with its own antd theme and palette (`html.admin`).

## Per section
| Section | What changed | Why |
|---|---|---|
| Preloader | Inline in `index.html`: OH monogram stroke-draw + 000→100 counter, split reveal, ~1.1s, once per session, skipped for reduced motion | Paints before JS loads; no LCP/JS cost |
| Navbar | Transparent → blurred after 50px, hides on scroll down, sliding active-section underline, theme (circular View Transition) + language toggles, "Hire me"; full-screen focus-trapped mobile menu | Brief |
| Hero | Masked word reveal (60ms stagger), canvas system map (1.9 KB gz, paused off-screen, static on mobile/reduced motion), status, coordinates, CTAs, scroll cue | Signature moments 2–3 |
| About | Framed portrait (corner brackets draw in, AVIF/WebP 14–46 KB vs 1.9 MB PNG), lead/body bio, counters derived from real records only, languages, recognition, testimonials (only if CMS has any) | No invented stats |
| Stack | Interactive layered architecture diagram (hover/focus traces technologies, lit edges), grouped inventory with simple-icons logos; no progress bars | Signature moment 4 |
| Work | Featured case + filterable grid (shared-layout transitions), 6° tilt, image scale, cursor "View case →", case-study modal at `?case=id` (Back closes it) and deep-linkable `/projects/:id` | Signature moment 5 |
| Experience | Amber line draws with scroll, nodes light when reached; education + certificates cards | Signature moment 6 |
| Contact | "Let's build something solid." + magnetic CTA + live Gaza time; floating-label form (zod), loading/success/error+retry; copy-email toast; social rows | Signature moment 7 |
| Footer | Minimal: monogram, credit, secondary routes, socials, back to top | Brief |
| Other pages | Services, Gallery, Blog, 404 rebuilt on the same primitives; `/about`, `/skills`, `/experience`, `/contact` redirect to home anchors | Keep every link working |

## New dependencies
- `lenis` (~4 KB gz) — smooth scrolling; disabled under reduced motion.
- `simple-icons` (tree-shaken, ~15 icons) — real technology logos.
Removed: 7 unused `@fontsource/*` packages (fonts are now self-hosted in `public/fonts`).

## Placeholders / assets to provide
- `[PLACEHOLDER: project screenshot]` — set `thumbnail_url` (16:10, ≥1600×1000) per project in the admin.
- Project case-study text (`challenges`, `solutions`, `features`, `case_study`) — chapters appear automatically once filled.
- CV file — upload in Admin → Resume to make "Download CV" a file download (currently opens `/cv`).
- Optional: real credential URL for the CodeMap certificate.

## Known follow-ups
- Mobile Lighthouse Performance is 75 (LCP 4.0s, simulated slow 4G) because the SPA renders client-side; desktop is 99. Reaching ≥95 on mobile needs pre-rendering the hero (e.g. build-time SSG).
- `/blog/:slug` still renders the list (pre-existing); an article view needs a sanitised HTML renderer.
- Remaining lint warnings are pre-existing admin hook-dependency warnings.
