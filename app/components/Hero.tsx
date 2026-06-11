"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo } from "../lib/smoothScroll";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
 * Hero background — cinematic still + Ken Burns drift.
 * Swap point: to use a real client showreel later, replace the <img> below with a
 * muted, playsinline, looping <video> + this still as its `poster`. Nothing else changes.
 * Asset: Unsplash photo-1610994909591-24a01013310a (dark film studio, softbox key light).
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1610994909591-24a01013310a?auto=format&fit=crop&w=2000&q=80";

// Headline carries the brand voice; `accent` marks the single emerald word.
const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: "A" },
  { text: "place" },
  { text: "to" },
  { text: "create" },
  { text: "things" },
  { text: "called" },
  { text: "masterpiece.", accent: true },
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Motion branch only. Hidden start states live here so reduced-motion,
      // no-JS, and headless renders all show a fully visible, static hero.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".js-word-inner", { yPercent: 120 });
        gsap.set([".js-credit", ".js-sub", ".js-cta", ".js-cue"], {
          autoAlpha: 0,
          y: 22,
        });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".js-credit", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
          .to(
            ".js-word-inner",
            { yPercent: 0, duration: 1.05, stagger: 0.08 },
            0.25,
          )
          .to(".js-sub", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.55")
          .to(
            ".js-cta",
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
            "-=0.6",
          )
          .to(".js-cue", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.35");

        // Scroll handoff: the hero pins and its content dissolves + recedes as you
        // scroll past it. Pinning gives the standalone hero its own scroll length, so
        // the cue and scrub are functional today; once Section 2 mounts directly after,
        // the release lands on it instead of the bare void canvas.
        gsap.to(contentRef.current, {
          opacity: 0,
          scale: 0.94,
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=45%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleScrollCue = () => scrollTo(window.innerHeight);

  // Smooth-scroll in-page anchors via Lenis (native anchor jumps are instant).
  // Keep the href as a no-JS fallback.
  const handleAnchor =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      scrollTo(el);
    };

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      aria-label="Renjana Pictures — introduction"
    >
      <div className={styles.bg} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.bgImg}
          src={HERO_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <p className={`${styles.credit} js-credit`}>
          <span className={styles.creditMark}>Renjana Pictures</span>
          Broadcast · Film · Advertising
        </p>

        <div className={styles.bottom}>
          <div className={styles.lower}>
            <h1 className={styles.headline}>
              {HEADLINE.map((word, i) => (
                <Fragment key={i}>
                  <span className={styles.word}>
                    <span
                      className={`${styles.inner} ${
                        word.accent ? styles.accent : ""
                      } js-word-inner`}
                    >
                      {word.text}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </h1>

            <p className={`${styles.sub} js-sub`}>
              A place to collect and gather ideas, passion, desire, and soul.
            </p>

            <div className={styles.ctas}>
              <a
                href="#contact"
                className={`${styles.btnPrimary} js-cta`}
              >
                Start a project
              </a>
              <a
                href="#work"
                onClick={handleAnchor("work")}
                className={`${styles.btnGhost} js-cta`}
              >
                <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch the reel
              </a>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.cue} js-cue`}
            onClick={handleScrollCue}
            aria-label="Scroll to explore"
          >
            <span>Scroll</span>
            <span className={styles.cueTrack} aria-hidden="true">
              <span className={styles.cueBeam} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
