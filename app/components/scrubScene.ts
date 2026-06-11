/* =============================================================================
   Procedural scroll-scrub centrepiece - "Orbital Service Ring"
   -----------------------------------------------------------------------------
   A deterministic 2.5D canvas scene: light fragments assemble into an orbital
   ring, then rotate with depth sorting, perspective scale, floor reflections,
   and dust. ScrollTrigger calls render(progress) on every scrub tick, so forward
   and reverse scroll always land on the same visual frame.

   Swap path: a real <video> can replace the canvas by mapping currentTime to
   progress in LightRing.tsx. A PNG sequence can do the same by drawing
   frames[Math.round(progress * (frames.length - 1))] to this canvas.
============================================================================= */

export interface ScrubScene {
  render: (progress: number) => void;
  resize: () => void;
  destroy: () => void;
}

const TWO_PI = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface Dust {
  x: number;
  y: number;
  r: number;
  a: number;
  drift: number;
}

export function createScrubScene(canvas: HTMLCanvasElement): ScrubScene {
  const ctx = canvas.getContext("2d");
  const BARS = 84;
  const SPINS = 2.15;
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
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedDust();
  }

  function seedDust() {
    const count = Math.round(clamp((w * h) / 23000, 42, 160));
    dust = Array.from({ length: count }, (_, i) => ({
      x: seeded(i, 1) * w,
      y: seeded(i, 2) * h,
      r: 0.35 + seeded(i, 3) * 1.35,
      a: 0.035 + seeded(i, 4) * 0.11,
      drift: 10 + seeded(i, 5) * 30,
    }));
  }

  function drawEllipseGlow(cx: number, cy: number, rx: number, ry: number, alpha: number) {
    if (!ctx) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const glow = ctx.createRadialGradient(0, 0, rx * 0.18, 0, 0, rx);
    glow.addColorStop(0, `rgba(37,158,143,${alpha})`);
    glow.addColorStop(0.58, `rgba(37,158,143,${alpha * 0.22})`);
    glow.addColorStop(1, "rgba(37,158,143,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, TWO_PI);
    ctx.fill();
    ctx.restore();
  }

  function render(progress: number) {
    if (!ctx) return;
    const p = clamp(progress);
    last = p;

    const cx = w * 0.5;
    const cy = h * 0.55;
    const scale = Math.min(w, h);
    const radius = scale * 0.29;
    const tilt = 0.43;
    const assemble = easeOut(clamp(p / 0.34));
    const settle = easeInOut(clamp((p - 0.14) / 0.34));
    const orbit = easeOut(clamp((p - 0.05) / 0.32));
    const rot = (p * SPINS + (1 - assemble) * 0.18) * TWO_PI;

    ctx.clearRect(0, 0, w, h);

    const vignette = ctx.createRadialGradient(
      cx,
      cy * 0.9,
      scale * 0.04,
      cx,
      cy,
      scale * 0.98,
    );
    vignette.addColorStop(0, "rgba(23,31,28,0.9)");
    vignette.addColorStop(0.55, "rgba(10,14,13,0.32)");
    vignette.addColorStop(1, "rgba(10,14,13,0)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    drawEllipseGlow(cx, cy + scale * 0.02, radius * 2.1, radius * 2.1 * tilt, 0.1 * orbit);

    ctx.save();
    ctx.lineWidth = 1;
    for (let k = 1; k <= 5; k++) {
      const rr = radius * (0.44 + k * 0.28) * (0.92 + p * 0.18);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rr, rr * tilt, 0, 0, TWO_PI);
      ctx.strokeStyle = `rgba(37,158,143,${0.035 * orbit * (1 - k * 0.08)})`;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.lineWidth = Math.max(1, scale * 0.0022);
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * (1 + (1 - settle) * 0.08), radius * tilt, 0, 0, TWO_PI);
    ctx.strokeStyle = `rgba(253,245,215,${0.08 * orbit})`;
    ctx.stroke();
    ctx.restore();

    type Bar = {
      sx: number;
      sy: number;
      top: number;
      depth: number;
      bw: number;
      alpha: number;
    };
    const bars: Bar[] = [];

    for (let i = 0; i < BARS; i++) {
      const theta0 = (i / BARS) * TWO_PI;
      const s1 = seeded(i, 11);
      const s2 = seeded(i, 17);
      const s3 = seeded(i, 23);
      const birth = easeOut(clamp((p + 0.08 - s1 * 0.16) / 0.32));
      const scatter = 1 - birth;
      const angle = theta0 + rot + scatter * (s2 - 0.5) * 1.65;
      const radialScatter = 1 + scatter * (0.9 + s1 * 0.95);
      const r = radius * radialScatter;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const depth = (z + r) / (2 * r);
      const persp = 0.72 + depth * 0.58;
      const driftY = (s3 - 0.5) * scale * 0.42 * scatter;
      const sx = cx + x * persp;
      const sy = cy + z * tilt * persp + driftY;
      const wave =
        0.52 +
        0.48 *
          Math.sin(theta0 * 3 + p * TWO_PI * 2.4) *
          Math.cos(theta0 * 2.2 - p * 4.2);
      const servicePulse = 0.72 + 0.28 * Math.sin((p * 3 - i / BARS) * TWO_PI);
      const hh =
        scale *
        (0.035 + 0.19 * wave * servicePulse + 0.045 * settle) *
        (0.22 + birth * 0.78);
      const bw = Math.max(1.5, scale * (0.006 + 0.007 * birth) * persp);
      bars.push({
        sx,
        sy,
        top: sy - hh * persp * birth,
        depth,
        bw,
        alpha: birth * (0.18 + depth * 0.76),
      });
    }

    bars.sort((a, b) => a.depth - b.depth);

    for (const bar of bars) {
      if (bar.alpha <= 0.01) continue;
      const { sx, sy, top, depth, bw, alpha } = bar;
      const height = Math.max(0, sy - top);
      const grad = ctx.createLinearGradient(0, sy, 0, top);
      grad.addColorStop(0, `rgba(74,91,87,${alpha * 0.42})`);
      grad.addColorStop(0.58, `rgba(37,158,143,${alpha * 0.62})`);
      grad.addColorStop(1, `rgba(215,248,237,${alpha})`);
      ctx.fillStyle = grad;
      ctx.fillRect(sx - bw / 2, top, bw, height);

      const refl = ctx.createLinearGradient(0, sy, 0, sy + height * 0.58);
      refl.addColorStop(0, `rgba(37,158,143,${alpha * 0.16 * depth})`);
      refl.addColorStop(1, "rgba(37,158,143,0)");
      ctx.fillStyle = refl;
      ctx.fillRect(sx - bw / 2, sy, bw, height * 0.58);

      if (depth > 0.58) {
        ctx.fillStyle = `rgba(236,255,248,${(depth - 0.58) * 1.35 * alpha})`;
        ctx.fillRect(sx - bw / 2, top, bw, Math.max(1.4, bw * 0.65));
      }
    }

    const coreRadius = scale * (0.045 + p * 0.035);
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 4.4);
    core.addColorStop(0, `rgba(232,255,247,${0.52 * assemble})`);
    core.addColorStop(0.32, `rgba(37,158,143,${0.28 * assemble})`);
    core.addColorStop(1, "rgba(37,158,143,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius * 4.4, 0, TWO_PI);
    ctx.fill();

    for (const d of dust) {
      const y = (d.y + p * d.drift) % h;
      ctx.fillStyle = `rgba(253,245,215,${d.a})`;
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
