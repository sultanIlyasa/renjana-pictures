"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startScroll, stopScroll } from "../lib/smoothScroll";
import styles from "./WorkShowcase.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
 * Selected Work — Section 2. A browsable carousel of 16:9 cards; each previews a
 * muted clip when scrolled into view, click expands into a player with sound.
 *
 * Placeholder footage is public-domain cinematic b-roll (public/work/*.mp4), graded
 * into one world via CSS. SWAP POINT: replace the src/poster/title/cat below with the
 * studio's real films — the layout and interaction are final.
 */
type Work = {
  id: string;
  src: string;
  poster: string;
  title: string;
  cat: string;
  year: string;
  runtime: string;
};

const WORKS: Work[] = [
  { id: "ember", src: "/work/flame.mp4", poster: "/work/flame.jpg", title: "Ember & Oath", cat: "Brand Film", year: "2025", runtime: "1:00" },
  { id: "cloudburst", src: "/work/rain.mp4", poster: "/work/rain.jpg", title: "Cloudburst", cat: "TV Commercial", year: "2024", runtime: "0:30" },
  { id: "golden", src: "/work/sunset.mp4", poster: "/work/sunset.jpg", title: "Golden Hour", cat: "Tourism Spot", year: "2025", runtime: "1:30" },
  { id: "stillwater", src: "/work/water.mp4", poster: "/work/water.jpg", title: "Still Water", cat: "Product Film", year: "2024", runtime: "0:45" },
  { id: "aftertaste", src: "/work/smoke.mp4", poster: "/work/smoke.jpg", title: "Aftertaste", cat: "Fashion Reel", year: "2025", runtime: "0:30" },
];

export default function WorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogVideoRef = useRef<HTMLVideoElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 });

  const [active, setActive] = useState<Work | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanPrev(t.scrollLeft > 4);
    setCanNext(t.scrollLeft < t.scrollWidth - t.clientWidth - 4);
  }, []);

  // Autoplay previews only for in-view cards (skipped under reduced motion).
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const vids = Array.from(
      t.querySelectorAll<HTMLVideoElement>("video[data-preview]"),
    );
    vids.forEach((v) => (v.muted = true));
    updateArrows();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { root: t, threshold: 0.45 },
    );
    vids.forEach((v) => io.observe(v));

    window.addEventListener("resize", updateArrows);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  // Subtle on-enter reveal (visible by default; only the motion branch hides first).
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".js-reveal", {
          y: 42,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollByCards = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>("[data-card]");
    const gap = parseFloat(getComputedStyle(t).columnGap || "0") || 0;
    const step = (card?.offsetWidth ?? t.clientWidth * 0.5) + gap;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  // Pointer drag-to-scroll
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!t) return;
    drag.current = { down: true, startX: e.clientX, startScroll: t.scrollLeft, moved: 0 };
    t.classList.add(styles.dragging);
    t.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!t || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    t.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!t) return;
    drag.current.down = false;
    t.classList.remove(styles.dragging);
    if (t.hasPointerCapture?.(e.pointerId)) t.releasePointerCapture(e.pointerId);
  };

  const openWork = (work: Work, el: HTMLElement) => {
    if (drag.current.moved > 8) return; // it was a drag, not a click
    lastFocusedRef.current = el;
    setActive(work);
  };

  // Open the dialog + play with sound once the active work has rendered.
  useEffect(() => {
    if (!active) return;
    const d = dialogRef.current;
    const v = dialogVideoRef.current;
    if (d && !d.open) d.showModal();
    stopScroll(); // freeze the page behind the modal
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    }
  }, [active]);

  const closeDialog = () => dialogRef.current?.close();

  const onDialogClose = () => {
    dialogVideoRef.current?.pause();
    startScroll();
    setActive(null);
    lastFocusedRef.current?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.work}
      aria-labelledby="work-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <div className="js-reveal">
            <span className={styles.kicker}>Selected Work</span>
            <h2 id="work-title" className={styles.title}>
              Frames worth the stare.
            </h2>
            <p className={styles.lead}>
              A handful of recent films, spots, and reels. Drag the strip — or tap
              a frame to watch it with sound.
            </p>
          </div>

          <div className={styles.controls} aria-hidden="true">
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCards(-1)}
              disabled={!canPrev}
              aria-label="Previous work"
              tabIndex={-1}
            >
              <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCards(1)}
              disabled={!canNext}
              aria-label="Next work"
              tabIndex={-1}
            >
              <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>

        <div
          ref={trackRef}
          className={`${styles.track} js-reveal`}
          onScroll={updateArrows}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {WORKS.map((w) => (
            <button
              key={w.id}
              type="button"
              data-card
              className={styles.card}
              onClick={(e) => openWork(w, e.currentTarget)}
              aria-label={`Play ${w.title} — ${w.cat}, ${w.year}`}
            >
              <video
                className={styles.cardMedia}
                data-preview
                src={w.src}
                poster={w.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
              />
              <span className={styles.cardScrim} aria-hidden="true" />
              <span className={styles.badge}>{w.runtime}</span>
              <span className={styles.play} aria-hidden="true">
                <svg className={styles.playIcon} viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className={styles.cardMeta}>
                <span className={styles.cardCat}>
                  {w.cat} · {w.year}
                </span>
                <span className={styles.cardTitle}>{w.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={onDialogClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        aria-label={active ? `${active.title} — player` : "Work player"}
      >
        {active && (
          <div>
            <div className={styles.dialogStage}>
              <video
                ref={dialogVideoRef}
                className={styles.dialogVideo}
                src={active.src}
                poster={active.poster}
                controls
                playsInline
                preload="auto"
              />
            </div>
            <div className={styles.dialogBar}>
              <div>
                <span className={styles.dialogTitle}>{active.title}</span>
                <span className={styles.dialogCat}>
                  {active.cat} · {active.year} · {active.runtime}
                </span>
              </div>
              <button type="button" className={styles.close} onClick={closeDialog}>
                Close
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
