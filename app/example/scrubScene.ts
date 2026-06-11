/* =============================================================================
   Procedural scroll-scrub centrepiece
   -----------------------------------------------------------------------------
   A 3D "audio driver" — a rotating ring of equalizer bars with a glowing core,
   floor rings and dust. `render(progress)` draws a single frame for a given
   scroll progress (0..1); ScrollTrigger calls it on every scroll tick, so
   scrolling forward AND backward scrubs the scene frame-by-frame.

   WHY CANVAS (not <video>): a customer-facing demo must work offline with zero
   asset risk, and this is buttery because each frame is computed, not decoded.

   ───────────────────────────────────────────────────────────────────────────
   SWAP IN A REAL <video> (the Apple approach) — see motion.ts `setupScrub()`:
     1. In index.astro replace <canvas class="scrub__canvas"> with:
          <video class="scrub__canvas" muted playsinline preload="auto"
                 src="/media/nordra-scrub.mp4"></video>
        (a short, well-compressed clip; 6–10s, ~1080p, keyframe-dense for seeking)
     2. In motion.ts, in the scrub ScrollTrigger onUpdate, replace
          scene.render(self.progress)
        with
          if (video.duration) video.currentTime = self.progress * video.duration;
        Wait for `loadedmetadata` before mapping currentTime.

   SWAP IN A PNG IMAGE SEQUENCE (smoothest, heaviest): preload frames
     frame0001.jpg..frameNNNN.jpg into an Image[] and in render(progress) draw
     images[Math.round(progress * (frames-1))] to the canvas. Same call site.
============================================================================= */

export interface ScrubScene {
  render: (progress: number) => void;
  resize: () => void;
  destroy: () => void;
}

const TWO_PI = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// ease-out-cubic, used for the "assembly" of the ring early in the scrub
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Dust {
  x: number;
  y: number;
  r: number;
  a: number;
  drift: number;
}

export function createScrubScene(canvas: HTMLCanvasElement): ScrubScene {
  const ctx = canvas.getContext('2d');
  const BARS = 72;
  const SPINS = 1.35; // full turns across the whole scrub
  let w = 0;
  let h = 0;
  let dpr = 1;
  let dust: Dust[] = [];
  let last = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    seedDust();
  }

  function seedDust() {
    const count = Math.round(clamp((w * h) / 26000, 30, 130));
    dust = Array.from({ length: count }, (_, i) => {
      const rnd = (n: number) => {
        // deterministic pseudo-random so frames are stable across re-renders
        const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      return {
        x: rnd(1) * w,
        y: rnd(2) * h,
        r: 0.4 + rnd(3) * 1.4,
        a: 0.04 + rnd(4) * 0.12,
        drift: 8 + rnd(5) * 26,
      };
    });
  }

  function render(progress: number) {
    if (!ctx) return;
    const p = clamp(progress);
    last = p;

    const cx = w * 0.5;
    const cy = h * 0.56;
    const scale = Math.min(w, h);
    const R = scale * 0.3; // ring radius
    const tilt = 0.42; // camera pitch (ellipse squash for depth)
    const rot = p * SPINS * TWO_PI;
    const assemble = easeOut(clamp(p / 0.32)); // ring forms over the first third

    // ---- backdrop vignette ----
    ctx.clearRect(0, 0, w, h);
    const vg = ctx.createRadialGradient(cx, cy * 0.86, scale * 0.05, cx, cy, scale * 0.95);
    vg.addColorStop(0, 'rgba(28,26,34,0.85)');
    vg.addColorStop(1, 'rgba(10,10,11,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // ---- floor rings (concentric, expand subtly with progress) ----
    ctx.save();
    ctx.lineWidth = 1;
    for (let k = 1; k <= 4; k++) {
      const rr = R * (0.45 + k * 0.34) * (0.92 + p * 0.16);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rr, rr * tilt, 0, 0, TWO_PI);
      ctx.strokeStyle = `rgba(224,163,0,${0.05 * assemble})`;
      ctx.stroke();
    }
    ctx.restore();

    // ---- bars (painter's algorithm: far → near) ----
    type Bar = { sx: number; sy: number; top: number; depth: number; bw: number };
    const bars: Bar[] = [];
    for (let i = 0; i < BARS; i++) {
      const theta0 = (i / BARS) * TWO_PI;
      const angle = theta0 + rot;
      const x = Math.cos(angle) * R;
      const z = Math.sin(angle) * R;
      const depth = (z + R) / (2 * R); // 0 (back) .. 1 (front)

      // traveling-wave heights + a per-bar signature, gated by assembly
      const wave =
        0.5 +
        0.5 * Math.sin(theta0 * 3 + p * TWO_PI * 2) * Math.cos(theta0 * 2 - p * 3.2);
      const hh = (scale * 0.04 + scale * 0.2 * wave) * assemble;

      const persp = 0.8 + depth * 0.5;
      const sx = cx + x * persp;
      const sy = cy + z * tilt * persp;
      const top = sy - hh * persp;
      const bw = Math.max(1.5, scale * 0.012 * persp);
      bars.push({ sx, sy, top, depth, bw });
    }
    bars.sort((a, b) => a.depth - b.depth);

    for (const bar of bars) {
      const { sx, sy, top, depth, bw } = bar;
      // colour: back = dim slate, front+tall = amber
      const lum = 0.18 + depth * 0.55;
      const grad = ctx.createLinearGradient(0, sy, 0, top);
      grad.addColorStop(0, `rgba(120,124,140,${0.12 + depth * 0.2})`);
      grad.addColorStop(1, `rgba(${224 * lum + 60}, ${163 * lum + 50}, ${40 + depth * 30}, ${0.35 + depth * 0.5})`);
      ctx.fillStyle = grad;
      ctx.fillRect(sx - bw / 2, top, bw, sy - top);

      // mirrored reflection below the floor
      const refl = ctx.createLinearGradient(0, sy, 0, sy + (sy - top) * 0.6);
      refl.addColorStop(0, `rgba(224,163,0,${0.12 * depth})`);
      refl.addColorStop(1, 'rgba(224,163,0,0)');
      ctx.fillStyle = refl;
      ctx.fillRect(sx - bw / 2, sy, bw, (sy - top) * 0.6);

      // amber cap on the brightest front bars
      if (depth > 0.6) {
        ctx.fillStyle = `rgba(255,209,102,${(depth - 0.6) * 1.6})`;
        ctx.fillRect(sx - bw / 2, top, bw, Math.max(1.5, bw * 0.6));
      }
    }

    // ---- glowing core ----
    const coreR = scale * (0.05 + p * 0.05);
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
    core.addColorStop(0, `rgba(255,214,120,${0.5 * assemble})`);
    core.addColorStop(0.4, `rgba(224,163,0,${0.22 * assemble})`);
    core.addColorStop(1, 'rgba(224,163,0,0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 3, 0, TWO_PI);
    ctx.fill();

    // ---- foreground dust (subtle scroll parallax) ----
    for (const d of dust) {
      const y = (d.y + p * d.drift) % h;
      ctx.fillStyle = `rgba(255,240,210,${d.a})`;
      ctx.beginPath();
      ctx.arc(d.x, y, d.r, 0, TWO_PI);
      ctx.fill();
    }
  }

  resize();
  render(0);

  return {
    render,
    resize: () => {
      resize();
      render(last);
    },
    destroy: () => {
      dust = [];
    },
  };
}
