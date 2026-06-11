@AGENTS.md

# Design Context

This project has committed strategic and visual design docs. Read them before building or changing any UI.

- **`PRODUCT.md`** — strategic (who/what/why). Register: `brand`. A single-page, static company-profile landing for **Renjana Pictures** (a broadcasting & media production company), built by **Sarikaya Labs** as a cinematic, Apple-keynote-style showpiece. Personality: refined · understated · premium. The page itself must read as a sample of the studio's craft.
- **`DESIGN.md`** — visual system (how it looks), Stitch format. North star: **"The Darkened Screening Room"** — void-black canvas (`#0A0E0D`), one rationed emerald accent (`#259E8F`, ≤10% of any viewport), warm cream type (`#FDF5D7`). Display: Bricolage Grotesque (huge, tight, rare); body: Geist Sans; labels: Geist Mono (film-credit chrome, never a section eyebrow). Flat/light-based elevation, directed GSAP motion with reduced-motion fallbacks, WCAG AA.
- **`.impeccable/design.json`** — machine-readable sidecar (tonal ramps, motion/shadow tokens, drop-in component snippets) for the impeccable live panel.

Non-negotiables from the Don'ts: no near-white/cream/sand surfaces, no SaaS-slop gradients or gradient text, no per-section uppercase eyebrows, no corporate stock imagery, no pill/rounded-xl corners (system is near-sharp, 2–4px).
