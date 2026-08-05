"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import type { HeroContent, HeroCopy, HeroVideo } from "../data/siteContent";
import { scrollTo } from "../lib/smoothScroll";
import { LANGUAGE_LABELS, type SiteLanguage } from "./content";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
 * Hero background: full-bleed Cloudflare Stream HLS showreel.
 * Stream stays outside the Worker asset bundle; the small local clip is only a
 * development and playback-error fallback.
 */
const HERO_FALLBACK_VIDEO = "/work/sunset.mp4";
const HERO_POSTER = "/work/sunset.jpg";
const DEFAULT_HERO_VIDEO =
  "https://media.sarikayalabs.com/renjana-showreel-flaten.mp4";
const HERO_REMOTE_VIDEO =
  process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_HLS_URL?.trim() ||
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() ||
  DEFAULT_HERO_VIDEO;
const HERO_REMOTE_IS_HLS = /\.m3u8(?:$|\?)/i.test(HERO_REMOTE_VIDEO);

const HERO_MEDIA: HeroVideo = {
  src: HERO_REMOTE_VIDEO || HERO_FALLBACK_VIDEO,
  fallbackSrc: HERO_REMOTE_VIDEO ? HERO_FALLBACK_VIDEO : undefined,
  poster: HERO_POSTER,
  type: HERO_REMOTE_IS_HLS ? "application/vnd.apple.mpegurl" : "video/mp4",
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
  const [isMuted, setIsMuted] = useState(true);
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
    let hls: Hls | undefined;
    let usingFallback = false;

    const syncPlayback = () => {
      if (reduce.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };

    const syncMutedState = () => setIsMuted(video.muted);

    const loadFallback = () => {
      if (usingFallback || !media.fallbackSrc) return;
      usingFallback = true;
      hls?.destroy();
      hls = undefined;
      video.src = media.fallbackSrc;
      video.load();
      syncPlayback();
    };

    video.muted = true;
    syncMutedState();

    if (media.type === "application/vnd.apple.mpegurl") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = media.src;
        video.load();
        syncPlayback();
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
        });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => hls?.loadSource(media.src));
        hls.on(Hls.Events.MANIFEST_PARSED, syncPlayback);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) loadFallback();
        });
      } else {
        loadFallback();
      }
    } else {
      video.src = media.src;
      video.load();
      syncPlayback();
    }

    reduce.addEventListener("change", syncPlayback);
    video.addEventListener("volumechange", syncMutedState);

    return () => {
      reduce.removeEventListener("change", syncPlayback);
      video.removeEventListener("volumechange", syncMutedState);
      hls?.destroy();
    };
  }, [media.fallbackSrc, media.src, media.type]);

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

  const handleSoundToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    try {
      await video.play();
    } catch {
      video.muted = true;
    }
    setIsMuted(video.muted);
  };

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
          preload="metadata"
        />
      </div>
      <div className={`${styles.scrim} js-hero-scrim`} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.soundToggle} js-hero-tool`}
        data-muted={isMuted ? "true" : "false"}
        onClick={handleSoundToggle}
        aria-label={
          language === "id"
            ? isMuted
              ? "Nyalakan suara showreel"
              : "Matikan suara showreel"
            : isMuted
              ? "Turn on showreel sound"
              : "Mute showreel"
        }
        title={
          language === "id"
            ? isMuted
              ? "Nyalakan suara"
              : "Matikan suara"
            : isMuted
              ? "Turn sound on"
              : "Mute"
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
          {isMuted ? (
            <path d="m17 9 4 4m0-4-4 4" />
          ) : (
            <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
          )}
        </svg>
      </button>

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
