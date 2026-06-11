/* =============================================================================
   Motion orchestration — GSAP + ScrollTrigger + Lenis
   One well-rehearsed entrance + a few pinned scroll moments. All gated behind
   `prefers-reduced-motion`; a clean static version is shown otherwise.
============================================================================= */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createScrubScene, type ScrubScene } from './scrubScene';

gsap.registerPlugin(ScrollTrigger);

function initMotion(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.scrub__canvas');
  const scene: ScrubScene | null = canvas ? createScrubScene(canvas) : null;

  // Canvas stays crisp on resize whatever the motion preference.
  if (scene) window.addEventListener('resize', () => scene.resize());

  // The fake contact form works regardless of motion settings.
  setupContactForm();

  const mm = gsap.matchMedia();

  /* ----------------------------------------------------------------------- *
   * FULL MOTION
   * ----------------------------------------------------------------------- */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // ---- Lenis smooth (inertia) scroll, driven by GSAP's ticker ----
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // smooth anchor scrolling for the top-bar nav
    const navClick = (e: Event) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };
    document.addEventListener('click', navClick);

    const ease = 'expo.out';

    // ---- Hero entrance (plays once, on first paint) ----
    const words = gsap.utils.toArray<HTMLElement>('.hero__headline .word > span');
    gsap
      .timeline({ defaults: { ease } })
      .fromTo('.hero__kicker', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
      .fromTo(words, { yPercent: 116 }, { yPercent: 0, duration: 1.05, stagger: 0.07 }, 0.16)
      .fromTo('.hero__sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.55')
      .fromTo(
        '.hero__cta-row > *',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
        '-=0.6',
      )
      .fromTo('.hero__cue', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3');

    // hero drifts + fades as the next section arrives
    gsap.to('.hero__inner', {
      yPercent: -14,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    setupScrub(scene);
    setupShowcase();
    setupReveals();
    setupStats();

    if ('fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      document.removeEventListener('click', navClick);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  });

  /* ----------------------------------------------------------------------- *
   * REDUCED MOTION — static, legible, no pinning / scrubbing
   * ----------------------------------------------------------------------- */
  mm.add('(prefers-reduced-motion: reduce)', () => {
    scene?.render(0.42); // a single, composed frame
    document.querySelector('.scrub__caption')?.classList.add('is-static');
    document.querySelector('.showcase')?.classList.add('showcase--static');
    document.querySelectorAll<HTMLElement>('.stat__num .val').forEach((el) => {
      const target = parseFloat(el.dataset.count || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = target.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    });
  });
}

/* The pinned scroll-scrub centrepiece. Scrolling maps to scene progress. */
function setupScrub(scene: ScrubScene | null): void {
  const section = document.querySelector<HTMLElement>('.scrub');
  if (!section) return;
  const railFill = document.querySelector<HTMLElement>('.scrub__rail-fill');
  const captions = gsap.utils.toArray<HTMLElement>('.scrub__caption');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // SWAP-IN POINT (see scrubScene.ts header): for a real <video>, replace
        // the next line with: if (video.duration) video.currentTime = self.progress * video.duration;
        scene?.render(self.progress);
        if (railFill) railFill.style.height = (self.progress * 100).toFixed(2) + '%';
      },
    },
  });

  // crossfade captions across the pinned scroll (each owns a 1/N slice)
  const seg = 1 / captions.length;
  captions.forEach((cap, i) => {
    const start = i * seg;
    tl.fromTo(
      cap,
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: seg * 0.28, ease: 'expo.out' },
      start + seg * 0.08,
    ).to(cap, { opacity: 0, y: -26, duration: seg * 0.24, ease: 'power1.in' }, start + seg * 0.74);
  });
  // anchor the timeline length to the full scroll
  tl.to({}, { duration: 0.001 }, 1);
}

/* Classic GSAP horizontal pin-scroll: pin the section, translate the track. */
function setupShowcase(): void {
  const section = document.querySelector<HTMLElement>('.showcase');
  const track = document.querySelector<HTMLElement>('.showcase__track');
  if (!section || !track) return;
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* Generic on-enter reveals (single elements + staggered containers). */
function setupReveals(): void {
  gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 42 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-animate-stagger]').forEach((el) => {
    gsap.fromTo(
      Array.from(el.children) as HTMLElement[],
      { opacity: 0, y: 42 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      },
    );
  });
}

/* Count-up metrics, once, on enter. */
function setupStats(): void {
  gsap.utils.toArray<HTMLElement>('.stat__num .val').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = obj.v.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      },
    });
  });
}

/* Visual-only contact form: fake spinner → success toast, never sends. */
function setupContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('.form');
  const toast = document.querySelector<HTMLElement>('.toast');
  if (!form) return;
  const btn = form.querySelector<HTMLButtonElement>('.form__submit');
  if (!btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.dataset.busy === '1') return;
    btn.dataset.busy = '1';
    const original = btn.querySelector('.form__submit-label')?.textContent || 'Send message';

    btn.innerHTML = '<span class="form__spinner" aria-hidden="true"></span> Sending';
    window.setTimeout(() => {
      btn.innerHTML = '<span class="form__submit-label">Message sent</span>';
      form.reset();
      if (toast) {
        toast.classList.add('is-visible');
        window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
      }
      window.setTimeout(() => {
        btn.innerHTML = `<span class="form__submit-label">${original}</span>`;
        btn.dataset.busy = '0';
      }, 2400);
    }, 1100);
  });
}

// Deferred module scripts run after the DOM is parsed.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion);
} else {
  initMotion();
}
