# PRD 01 — Company Profile Landing Page (Demo)

> **Product:** Sarikaya Labs — "Profil Perusahaan" tier
> **Type:** Single-page portfolio demo, frontend-only, dummy content
> **Build target:** an autonomous coding agent (e.g. Claude Code)

---

## 1. Purpose

This is a **showpiece** for renjana pictures they are a Broadcasting & media production company, not a client deliverable. It exists so Sultan can point a prospect at one URL and say *"this is the calibre of company-profile site I build."* It must look like an Apple keynote landing page — cinematic, scroll-choreographed, premium — while being 100% static (no backend, no CMS). Treat every animation as the selling point.

The single most important "wow" moment: **scroll-driven video / image-sequence playback**, where scrolling forward and backward scrubs a media element frame-by-frame, exactly like Apple's AirPods / iPhone product pages.

## 2. Goals & non-goals

**Goals**
- Demonstrate mastery of GSAP + ScrollTrigger scroll choreography.
- Hit a smooth 60fps on a mid-range laptop and a recent phone.
- Feel expensive: restraint, generous negative space, confident typography.
- Be fully responsive (desktop, tablet, mobile) with graceful animation fallbacks.

**Non-goals**
- No real forms submitting anywhere (contact form is visual only, fakes a success state).
- No CMS, no backend, no auth, no analytics wiring.
- No real client data — use a fictional brand (see §7).

## 3. Tech stack

- **Framework:** Next.Js and React
- **Animation:** GSAP 3 + `ScrollTrigger` (required). Optionally `ScrollSmoother` for inertia scrolling.
- **Styling:** plain CSS or Tailwind — either is fine. CSS custom properties for the palette.
- **Hosting:** Cloudflare Pages, deployed to the subdomain. Output must be a static `dist/`.
- **No paid GSAP plugins** unless freely available; if a Club GreenSock plugin is referenced, provide a free fallback (`ScrollSmoother` → native CSS `scroll-behavior` fallback).

## 4. Design direction

Aesthetic: **luxury / refined, near-monochrome with one sharp accent.** Think dark editorial, not purple-gradient-on-white SaaS slop.

- **Theme:** Use this as the main color #259E8F and #FDF5D7 as the secondary color, make it pop, niche unique and eye catching.
- **Typography:** a distinctive display face for headlines (e.g. a high-contrast serif or a characterful grotesk — NOT Inter/Roboto/Arial), paired with a clean neutral body face. Headlines huge (clamp up to ~120px on desktop), tight tracking.
- **Motion philosophy:** few, beautifully orchestrated moments. One pinned hero, a couple of pinned reveals, smooth easing (`power2`/`power3`). No jittery scattered micro-animations.
- **Spacing:** very generous. Each section breathes for a full viewport or more.

## 5. Page structure (single scroll)

Build as one long vertical scroll, sections in order:

1. **Hero (pinned).** Full-viewport. Background video OR fullscreen visual. Headline animates in word-by-word on load (staggered). A subtle "scroll" cue. On scroll-down the hero pins and the headline scales/fades as the next section enters.

2. **Scroll-scrubbed media reveal (the centrepiece, pinned).** A `<video>` (muted, `playsinline`, `preload=auto`) OR an image sequence on `<canvas>`. As the user scrolls through this pinned section, playback position is mapped to scroll progress (`ScrollTrigger` `scrub: true`). Overlay short captions that fade in/out at scroll milestones (e.g. "Designed for impact" → "Built for speed" → "Made to convert"). Provide BOTH implementation paths in code comments; default to scroll-scrubbed `<video>` (simpler), with a documented switch to image-sequence canvas for buttery frame control.

3. **Product and Servces (3 cards, staggered reveal).** Three value props (e.g. *Performance*, *Design*, *Conversion*). Each card slides + fades up on enter, staggered. Numbers or icons optional.

4. **Partners (pinned, horizontal scroll).** A row of "work / capability" panels that scroll horizontally while the section is pinned vertically (classic GSAP horizontal-scroll trick). 3–5 panels with dummy project visuals.

5. **Animated stats counter.** 3–4 metrics (e.g. "98 PageSpeed", "0.4s load", "120% avg conversion lift") that count up when scrolled into view.

6. **Partners.** One large pull-quote, fictional client, fade-in.

7. News & Articles

8. **contact.** Big closing headline + a visual-only contact form (name, email, message). On submit: fake a loading spinner then a success toast — never actually sends. Footer with fictional brand + Sarikaya Labs credit line ("Demo built by Sarikaya Labs").

## 6. Interaction & animation spec

- Hero headline: split into words/lines, `gsap.from` with `stagger` on load.
- Scrub section: `ScrollTrigger` with `pin: true`, `scrub: 1`, `end: "+=200%"`. Map `video.currentTime = progress * video.duration` inside `onUpdate`. Ensure video metadata is loaded before mapping.
- Horizontal showcase: pin the container, `gsap.to(track, { xPercent: -100 * (panels-1), scrollTrigger: { scrub: true, pin: true, end: ... }})`.
- Respect `prefers-reduced-motion`: if set, disable scrubbing/pinning, show content statically.
- All ScrollTriggers must `refresh()` on resize and clean up properly.

## 7. Mock content

Invent a fictional client brand to host the profile — e.g. **"Nordra"**, a premium audio/hardware company (gives a reason for cinematic product visuals). All copy is placeholder marketing prose. Source visuals from royalty-free assets (Unsplash/Pexels) or solid-color/gradient placeholders if none bundled. Keep a short asset manifest in the README listing what to swap.

## 8. Acceptance criteria

- [ ] Loads as a static site on Cloudflare Pages at the subdomain.
- [ ] Hero load animation plays once, smoothly, on first paint.
- [ ] Scrolling forward AND backward scrubs the centrepiece media in sync with scroll position.
- [ ] Horizontal showcase scrolls horizontally while pinned, then releases cleanly.
- [ ] Stats count up exactly once on enter.
- [ ] Fully responsive; no horizontal overflow on mobile; animations degrade gracefully.
- [ ] `prefers-reduced-motion` shows a clean static version.
- [ ] Lighthouse performance ≥ 85 on desktop.
- [ ] Contact form fakes submit + success without network calls.

## 9. Deliverables

- Code comments at each ScrollTrigger explaining the effect.

## 10. Out of scope

Backend, CMS, real form handling, multi-page routing, i18n, cookie banners, SEO beyond basic meta tags.
