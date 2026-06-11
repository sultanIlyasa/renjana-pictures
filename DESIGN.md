---
name: Renjana Pictures
description: Cinematic, scroll-choreographed company-profile landing — dark editorial, near-monochrome, one emerald accent.
colors:
  emerald-signal: "#259E8F"
  emerald-deep: "#1B7A6E"
  cream-light: "#FDF5D7"
  void: "#0A0E0D"
  surface: "#121614"
  surface-raised: "#1A201E"
  mist: "#8E9A95"
  hairline: "#252B29"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Geist Sans, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 7.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, Geist Sans, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
  lg: "10px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "120px"
  section: "min(18vh, 200px)"
components:
  button-primary:
    backgroundColor: "{colors.emerald-signal}"
    textColor: "{colors.void}"
    rounded: "{rounded.sm}"
    padding: "18px 36px"
  button-primary-hover:
    backgroundColor: "{colors.emerald-deep}"
    textColor: "{colors.void}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream-light}"
    rounded: "{rounded.sm}"
    padding: "18px 36px"
  button-ghost-hover:
    backgroundColor: "{colors.cream-light}"
    textColor: "{colors.void}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream-light}"
    rounded: "{rounded.md}"
    padding: "40px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.cream-light}"
    rounded: "{rounded.none}"
    padding: "16px 0"
---

# Design System: Renjana Pictures

## 1. Overview

**Creative North Star: "The Darkened Screening Room"**

You step in from a lit lobby and the room goes black. The work plays on the screen and everything else — the seats, the walls, your own hands — recedes into near-black so the image is the only thing with light in it. That is the whole system: a void-dark editorial canvas where the footage, the frame, and a single emerald signal are the only sources of brightness. Restraint is the luxury. Each section breathes for a full viewport or more; nothing competes with the work. Motion is directed, not decorative — a few beautifully orchestrated GSAP moments (a pinned hero, a scroll-scrubbed media reveal, one horizontal pan) rather than scattered micro-animation. The page should feel like an Apple keynote shot at night: cinematic, confident, expensive.

This system explicitly rejects the corporate stock-photo agency (no smiling-handshake stock, no lifeless corporate-blue, no soulless vendor energy), the generic SaaS / startup template (no purple-gradient-on-white slop, no gradient blobs, no eyebrow kickers, no identical feature-card grids, no hero-metric blocks), and anything that reads cheap or amateur. The emerald is rare and the cream is warm; the warmth lives in the brand colors and typography, never in a tinted near-white surface — there is no near-white surface here at all.

**Key Characteristics:**
- Void-dark canvas; the work is the only thing that glows.
- Near-monochrome with exactly one sharp accent (emerald).
- Generous, cinematic negative space — sections sized in viewports.
- Huge confident display type, tight tracking, sparingly used.
- Directed motion: few orchestrated scroll moments, never jittery.

## 2. Colors

A near-monochrome dark palette: a void-black room, warm cream light, and a single emerald signal that is the only saturated thing on screen.

### Primary
- **Emerald Signal** (`#259E8F` / `oklch(0.63 0.097 178)`): The one sharp accent. Reserved for the things that must be seen — primary CTA fill, active links, the scroll cue, focus states, counting-stat numerals, a single underline on a key word. Its rarity is the entire point; the moment it covers more than a sliver of the screen it stops being a signal.
- **Emerald Deep** (`#1B7A6E` / `oklch(0.52 0.085 178)`): Pressed/hover state of the signal. Never used as a resting fill on its own.

### Secondary
- **Cream Light** (`#FDF5D7` / `oklch(0.97 0.034 96)`): The warm light of the room. Primary text and headlines on the dark canvas, hairline-thin logo marks, the fill that ghost buttons invert to on hover. Its warmth is what keeps the dark from feeling clinical — this is where the brand's warmth lives, never in the background.

### Neutral
- **Void** (`#0A0E0D` / `oklch(0.17 0.008 180)`): The canvas. Near-black with the faintest teal undertone so it sits in the same world as the emerald without ever reading as "tinted." The default background of nearly every section.
- **Surface** (`#121614` / `oklch(0.22 0.010 175)`): Raised planes — cards, the contact panel, pinned overlays. One step up from the void, no more.
- **Surface Raised** (`#1A201E` / `oklch(0.27 0.010 175)`): The rare second step, for a hover or an inset within a surface. Stacking past this is forbidden.
- **Mist** (`#8E9A95` / `oklch(0.66 0.012 175)`): Muted secondary text — captions, metadata, timecodes, supporting copy. Dimmed cream-sage, still ≥4.5:1 on the void.
- **Hairline** (`#252B29` / `oklch(0.31 0.008 175)`): Borders, dividers, input underlines at rest. Whisper-thin; structure you feel more than see.

### Named Rules
**The One Signal Rule.** Emerald covers ≤10% of any viewport. It is a signal, not a paint. If a section has two emerald elements competing, one of them is wrong.

**The No Near-White Rule.** There is no light surface in this system. Backgrounds are void/surface dark; "warmth" is carried by cream type and emerald, never by a cream-tinted background. A beige/sand/parchment panel is an instant tell and is forbidden.

## 3. Typography

**Display Font:** Bricolage Grotesque (fallback: Geist Sans, sans-serif)
**Body Font:** Geist Sans (fallback: system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (fallback: ui-monospace, monospace)

**Character:** A characterful display grotesk against a clean neutral sans — contrast by personality, not by genre. Bricolage's quirky, solid cuts give headlines keynote-stage presence; Geist keeps the reading calm and modern so the display face never has to share the spotlight. Geist Mono appears only as cinematic chrome (credits, timecodes, captions), never as body.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 8vw, 7.5rem)`, line-height 0.95, tracking -0.03em): Hero and one-line section statements only. Set big, set tight, set rarely. `text-wrap: balance`.
- **Headline** (600, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.05, tracking -0.02em): Section openers and the closing contact line. `text-wrap: balance`.
- **Title** (600, `clamp(1.25rem, 2vw, 1.75rem)`, line-height 1.2): Card headings, stat labels, panel titles.
- **Body** (400, `1.0625rem` / ~17px, line-height 1.6): Marketing prose and descriptions. Capped at 65–75ch. `text-wrap: pretty`. Color is Cream Light for primary copy, Mist for supporting.
- **Label** (500, `0.75rem`, tracking 0.12em, UPPERCASE, Geist Mono): Cinematic credit/timecode chrome — "01 · DESIGNED FOR IMPACT", scroll captions, footer credit, metadata.

### Named Rules
**The Credit-Line Rule.** The uppercase mono label is film-credit chrome, not a section eyebrow. It is legitimate as a timecode, a scroll-milestone caption, or a footer credit. It is forbidden as a tracked kicker stacked above every heading — that is the SaaS scaffold this brand exists to avoid.

**The Big-and-Rare Rule.** Display type earns its 120px by being scarce. One display moment per section, maximum. If two headlines on the same screen both want to be huge, neither is.

## 4. Elevation

This is a flat, light-based system. Depth comes from luminance and scale — how dark a plane is and how much air surrounds it — not from drop shadows. On a void-black canvas a conventional drop shadow is invisible anyway; layering is tonal (void → surface → surface-raised). The one exception is light: an emerald or cream element may cast a soft diffuse *glow* to feel lit from within, which is atmosphere, not a card lift.

### Shadow Vocabulary
- **Emerald Glow** (`box-shadow: 0 0 40px -8px rgba(37,158,143,0.35)`): Optional halo under the primary CTA or an active media frame, so the accent reads as a light source. Use at most once per viewport.
- **Frame Lift** (`box-shadow: 0 24px 80px -24px rgba(0,0,0,0.7)`): Separates a pinned media element or contact panel from the void behind it. Diffuse and large, never tight.

### Named Rules
**The Lit-From-Within Rule.** Surfaces don't sit *above* the canvas, they *glow within* it. If you reach for a hard drop shadow to fake depth, the answer is more negative space or a step in tone instead.

## 5. Components

### Buttons
- **Shape:** Near-sharp, editorial (2px radius). Pills and rounded-xl are off-brand here.
- **Primary:** Emerald Signal fill, Void text, weight 600, padding 18px 36px. The single brightest interactive element on its screen.
- **Hover / Focus:** Fill shifts to Emerald Deep with a subtle 2px lift and the Emerald Glow; focus-visible adds a 2px cream outline offset 3px. ~200ms ease-out.
- **Ghost / Secondary:** Transparent with a 1px Hairline border and Cream text. On hover it inverts — fills Cream Light, text goes Void. Used for the second-tier action only.

### Cards / Containers
- **Corner Style:** 4px (`rounded.md`) — quiet, not bubbly.
- **Background:** Surface (`#121614`) on the void; never a near-white panel.
- **Shadow Strategy:** None at rest (see Elevation). Tonal step to Surface Raised on hover if interactive.
- **Border:** Optional 1px Hairline; prefer tonal separation over a drawn box.
- **Internal Padding:** 40px (`spacing` md→lg range); generous, cards breathe.
- **Note:** Cards are the lazy answer — use them only where they're truly the best affordance (the 3 service props, news items). Never nest a card in a card.

### Inputs / Fields
- **Style:** Editorial underline — transparent background, no box, a 1px Hairline bottom border only. Cream text, Mist placeholder (still ≥4.5:1).
- **Focus:** Bottom border animates to Emerald Signal (2px); label lifts to a Mist mono caption. No glow boxes.
- **Error / Disabled:** Error border is a desaturated warm red with a mono helper line; disabled drops text to Mist at reduced opacity. (Contact form is visual-only — it fakes a loading spinner then a success toast, never sends.)

### Navigation
- **Style:** Minimal top bar, transparent over the hero, Cream wordmark left, sparse mono links right. Becomes a void-tinted backdrop-blur sliver after the hero passes.
- **States:** Links are Mist at rest, Cream on hover, with a 1px emerald underline growing in from the left on the active/hover link. Mobile collapses to a full-screen void overlay menu with large display links.

### Signature Component — Scroll-Scrubbed Media Stage
The centrepiece. A full-viewport pinned `<video>` (muted, `playsinline`, `preload=auto`) whose `currentTime` is mapped to scroll progress via ScrollTrigger (`pin: true`, `scrub: 1`, `end: "+=200%"`). Mono caption labels fade in/out at scroll milestones ("DESIGNED FOR IMPACT" → "BUILT FOR SPEED" → "MADE TO CONVERT"). A canvas image-sequence path is documented as the buttery-frame alternative. Under `prefers-reduced-motion` the stage un-pins and shows a single representative frame with all captions stacked statically — never a blank or broken section.

## 6. Do's and Don'ts

### Do:
- **Do** keep the canvas void-dark (`#0A0E0D`) and let the footage be the only light in the room.
- **Do** ration the emerald — ≤10% of any viewport, signal not paint (The One Signal Rule).
- **Do** size sections in viewports; let each one breathe for a full screen or more.
- **Do** set display type big, tight (-0.03em), and rare — one display moment per section.
- **Do** orchestrate a few directed GSAP moments (pinned hero, scroll-scrubbed stage, one horizontal pan) with `power2`/`power3` easing.
- **Do** ship a clean static fallback for every animation under `prefers-reduced-motion`, and keep body/placeholder text ≥4.5:1 (WCAG AA).

### Don't:
- **Don't** introduce any near-white / cream / sand / parchment background panel — there is no light surface in this system (The No Near-White Rule).
- **Don't** use purple-gradient-on-white SaaS slop, gradient blobs, gradient text, or glassmorphism-as-default.
- **Don't** stack a tiny uppercase tracked eyebrow above every section — the mono label is film-credit chrome, not a kicker (The Credit-Line Rule).
- **Don't** build identical icon-heading-text feature-card grids, hero-metric blocks, or any AI-default landing scaffold.
- **Don't** lean on corporate stock photography, smiling-handshake imagery, or corporate-blue — this is a creative house, not a vendor.
- **Don't** fake depth with hard drop shadows on the dark canvas; use tone and negative space (The Lit-From-Within Rule).
- **Don't** scatter jittery micro-animations or autoplay chaos that buries the work; motion is directed, not ambient.
- **Don't** round corners into pills/`rounded-xl` — the system is near-sharp and editorial (2–4px).
