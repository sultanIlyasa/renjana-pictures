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
 * Fully disabled under prefers-reduced-motion and touch/small screens. Mobile
 * browsers already have tuned native momentum; adding virtual scroll there makes
 * pinned sections feel sticky while the finger has stopped moving.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOrSmall = window.matchMedia(
      "(pointer: coarse), (max-width: 820px)",
    ).matches;

    if (reduce || touchOrSmall) {
      setLenis(null);
      ScrollTrigger.refresh();
      return;
    }

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
