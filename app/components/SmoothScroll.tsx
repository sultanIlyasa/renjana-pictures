"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenis } from "../lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

/*
 * Global inertia smooth scroll. Lenis drives the page, GSAP's ticker drives Lenis,
 * and every Lenis scroll feeds ScrollTrigger.update so pins/scrubs stay in sync.
 * Fully disabled under prefers-reduced-motion (native scrolling, no inertia).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Children's ScrollTriggers mount before this effect; recompute against Lenis.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
