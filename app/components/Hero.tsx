"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroContent, HeroCopy, HeroVideo } from "../data/siteContent";
import { scrollTo } from "../lib/smoothScroll";
import { LANGUAGE_LABELS, type SiteLanguage } from "./content";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
 * Hero background: full-bleed autoplay showreel.
 * Store the final 4-minute Renjana master at public/hero/renjana-showreel.mp4.
 * The second source keeps the demo alive until that client file is present.
 */
const HERO_VIDEO = "/hero/renjana-showreel.mp4";
const HERO_FALLBACK_VIDEO = "/work/sunset.mp4";
const HERO_POSTER = "/work/sunset.jpg";

const HERO_MEDIA: HeroVideo = {
  src: HERO_VIDEO,
  fallbackSrc: HERO_FALLBACK_VIDEO,
  poster: HERO_POSTER,
  type: "video/mp4",
  fallbackType: "video/mp4",
};

const HERO_COPY: Record<SiteLanguage, HeroCopy> = {
  id: {
    aria: "Renjana Pictures - pembuka",
    creditMark: "Renjana Pictures",
    credit: "Siaran - Film - Iklan",
    videoMeta: "Showreel layar penuh / autoplay",
    headline: [
      { text: "Gambar" },
      { text: "yang" },
      { text: "membuat" },
      { text: "rasa" },
      { text: "bertahan.", accent: true },
    ],
    sub: "Rumah produksi untuk cerita yang harus terasa dulu sebelum dijelaskan.",
    primary: "Mulai proyek",
    secondary: "Lihat reel",
    cue: "Gulir",
    cueAria: "Gulir untuk menjelajah",
    languageLabel: "Pilih bahasa",
  },
  en: {
    aria: "Renjana Pictures - introduction",
    creditMark: "Renjana Pictures",
    credit: "Broadcast - Film - Advertising",
    videoMeta: "Full-screen showreel / autoplay",
    headline: [
      { text: "Stories" },
      { text: "made" },
      { text: "to" },
      { text: "stay" },
      { text: "in" },
      { text: "the" },
      { text: "frame.", accent: true },
    ],
    sub: "A production house for work that should be felt before it is explained.",
    primary: "Start a project",
    secondary: "Watch the reel",
    cue: "Scroll",
    cueAria: "Scroll to explore",
    languageLabel: "Choose language",
  },
};

export default function Hero({
  content,
  language,
  onLanguageChange,
}: {
  content?: HeroContent;
  language: SiteLanguage;
  onLanguageChange: (language: SiteLanguage) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { video, ...copyOverrides } = content ?? {};
  const customHeadline = content?.headline?.filter((word) => word.text.trim());
  const copy = {
    ...HERO_COPY[language],
    ...copyOverrides,
    headline: customHeadline && customHeadline.length >= 3
      ? customHeadline
      : HERO_COPY[language].headline,
  };
  const media = { ...HERO_MEDIA, ...video };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (reduce.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };

    syncPlayback();
    reduce.addEventListener("change", syncPlayback);
    return () => reduce.removeEventListener("change", syncPlayback);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let revertMedia: (() => void) | undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      revertMedia = () => mm.revert();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chrome = Array.from(
          root.querySelectorAll<HTMLElement>(
            ".js-credit, .js-hero-tool, .js-sub, .js-cta, .js-cue",
          ),
        );
        const scrim = root.querySelector<HTMLElement>(".js-hero-scrim");
        const wordReveal = { y: 120 };
        const setWordReveal = () => {
          root.style.setProperty("--hero-word-y", `${wordReveal.y}%`);
        };

        setWordReveal();
        gsap.set(chrome, { autoAlpha: 0, y: 24 });
        gsap.set(scrim, { opacity: 0.24 });

        /*
         * Scroll reveal hero:
         * The first viewport is only moving footage. The hero pins, then the
         * brand chrome and headline reveal as scroll progress begins.
         */
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () =>
              `+=${Math.round(
                window.innerHeight * (window.innerWidth > 820 ? 1.08 : 0.86),
              )}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(scrim, { opacity: 1, duration: 0.16 }, 0.08)
          .to(
            root.querySelectorAll(".js-credit, .js-hero-tool"),
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              stagger: 0.04,
            },
            0.16,
          )
          .to(
            wordReveal,
            {
              y: 0,
              duration: 0.42,
              onUpdate: setWordReveal,
            },
            0.22,
          )
          .to(
            root.querySelectorAll(".js-sub"),
            { autoAlpha: 1, y: 0, duration: 0.26 },
            0.5,
          )
          .to(
            root.querySelectorAll(".js-cta"),
            { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.05 },
            0.58,
          )
          .to(
            root.querySelectorAll(".js-cue"),
            { autoAlpha: 1, y: 0, duration: 0.2 },
            0.7,
          )
          .to({}, { duration: 0.18 }, 0.82);

        return () => {
          root.style.removeProperty("--hero-word-y");
        };
      });
    }, root);

    return () => {
      revertMedia?.();
      ctx.revert();
    };
  }, []);

  const handleScrollCue = () => scrollTo("#orbit-services");

  const handleAnchor =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      scrollTo(el);
    };

  return (
    <section ref={rootRef} className={styles.hero} aria-label={copy.aria}>
      <div className={styles.bg} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.bgVideo}
          poster={media.poster}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
        >
          <source src={media.src} type={media.type ?? "video/mp4"} />
          {media.fallbackSrc ? (
            <source
              src={media.fallbackSrc}
              type={media.fallbackType ?? "video/mp4"}
            />
          ) : null}
        </video>
      </div>
      <div className={`${styles.scrim} js-hero-scrim`} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <div className={styles.topline}>
          <p className={`${styles.credit} js-credit`}>
            <span className={styles.creditMark}>{copy.creditMark}</span>
            {copy.credit}
          </p>
          <div className={`${styles.heroTools} js-hero-tool`}>
            <span className={styles.videoMeta}>{copy.videoMeta}</span>
            <div className={styles.langSwitch} aria-label={copy.languageLabel}>
              {(["id", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={language === lang}
                  onClick={() => onLanguageChange(lang)}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.lower}>
            <h1 className={styles.headline}>
              {copy.headline.map((word, i) => (
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

            <p className={`${styles.sub} js-sub`}>{copy.sub}</p>

            <div className={styles.ctas}>
              <a
                href="#contact"
                onClick={handleAnchor("contact")}
                className={`${styles.btnPrimary} js-cta`}
              >
                {copy.primary}
              </a>
              <a
                href="#work"
                onClick={handleAnchor("work")}
                className={`${styles.btnGhost} js-cta`}
              >
                <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {copy.secondary}
              </a>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.cue} js-cue`}
            onClick={handleScrollCue}
            aria-label={copy.cueAria}
          >
            <span>{copy.cue}</span>
            <span className={styles.cueTrack} aria-hidden="true">
              <span className={styles.cueBeam} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
