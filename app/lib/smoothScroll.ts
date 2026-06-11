import type Lenis from "lenis";

/*
 * A tiny singleton so any component can drive the page scroll through Lenis when
 * it's active, and fall back to native scrolling when it isn't (reduced motion /
 * no Lenis). SmoothScroll.tsx registers the instance on mount.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scroll to a y-offset (number) or an element/selector, via Lenis if present. */
export function scrollTo(
  target: number | string | HTMLElement,
  opts?: { offset?: number },
) {
  if (instance) {
    instance.scrollTo(target, { offset: opts?.offset ?? 0 });
    return;
  }
  const behavior: ScrollBehavior = prefersReduced() ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + (opts?.offset ?? 0), behavior });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior, block: "start" });
}

/** Pause/resume page scrolling (e.g. while a modal is open). No-op without Lenis. */
export function stopScroll() {
  instance?.stop();
}
export function startScroll() {
  instance?.start();
}
