"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LightRingCopy } from "../data/siteContent";
import type { SiteLanguage } from "./content";
import { createScrubScene } from "./scrubScene";
import styles from "./LightRing.module.css";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SRC = "/brand/renjana-pictures.png";
const STATIC_SCENE_PROGRESS = 1.125 / 2.15;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SERVICES: Record<SiteLanguage, LightRingCopy> = {
  id: {
    tag: "Orbit layanan",
    aria: "Layanan Renjana Pictures dalam gerak",
    items: [
      {
        num: "01 / Siaran",
        title: "Cerita live yang tetap rapi di banyak layar.",
        body: "Liputan multi-kamera, paket siaran, film peluncuran, dan edit acara dengan ritme yang terjaga.",
      },
      {
        num: "02 / Film",
        title: "Atmosfer, tempo, dan frame yang punya daya tinggal.",
        body: "Film brand, narasi kampanye, reel produk, dan treatment visual yang matang sebelum kamera bergerak.",
      },
      {
        num: "03 / Iklan",
        title: "Karya komersial yang dibuat untuk diingat.",
        body: "TVC, potongan sosial, motion graphic, color, sound, dan master final untuk setiap kanal tayang.",
      },
    ],
  },
  en: {
    tag: "Orbital services",
    aria: "Renjana Pictures services in motion",
    items: [
      {
        num: "01 / Broadcast",
        title: "Live-ready stories for every screen.",
        body: "Multi-camera coverage, broadcast packages, launch films, and event edits built for pace and clarity.",
      },
      {
        num: "02 / Film",
        title: "Atmosphere, rhythm, and a frame that holds.",
        body: "Brand films, campaign narratives, product reels, and visual treatments shaped before the camera moves.",
      },
      {
        num: "03 / Advertising",
        title: "Commercial work made to be remembered.",
        body: "TV spots, social-first cuts, motion graphics, color, sound, and delivery masters for every channel.",
      },
    ],
  },
};

function getLightRingCopy(
  language: SiteLanguage,
  content?: Partial<LightRingCopy>,
) {
  const fallback = SERVICES[language];

  return {
    ...fallback,
    ...content,
    items: content?.items?.length ? content.items : fallback.items,
  };
}

export default function LightRing({
  content,
  language,
}: {
  content?: Partial<LightRingCopy>;
  language: SiteLanguage;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const activeServiceRef = useRef(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const copy = getLightRingCopy(language, content);
  const activeCaption =
    copy.items[Math.min(activeServiceIndex, copy.items.length - 1)] ?? copy.items[0];

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const scene = createScrubScene(canvas, { logoSrc: LOGO_SRC });
    const onResize = () => {
      scene.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const rail = railRef.current;
      const railFill = railFillRef.current;
      const services = gsap.utils.toArray<HTMLElement>("[data-ring-service]");

      const setActiveService = (progress: number) => {
        const index = Math.min(
          services.length - 1,
          Math.max(0, Math.floor(progress * services.length)),
        );
        services.forEach((service, serviceIndex) => {
          service.dataset.active = serviceIndex === index ? "true" : "false";
        });
        if (index === activeServiceRef.current) return;
        activeServiceRef.current = index;
        setActiveServiceIndex(index);
      };

      const updateScene = (progress: number) => {
        scene.render(progress);
        section.style.setProperty("--ring-progress", progress.toFixed(4));
        if (railFill) {
          railFill.style.transform = `scaleX(${progress.toFixed(4)})`;
        }
        setActiveService(progress);
      };

      if (rail) rail.style.opacity = "";
      if (railFill) railFill.style.transform = "scaleX(0)";
      setActiveService(0);

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 821px)",
        () => {
          section.dataset.motion = "on";

          /*
           * Pinned service orbit:
           * ScrollTrigger pins this full-viewport section and uses scroll progress
           * as the single source of truth for the canvas frame, progress rail, and
           * service copy. Because render(progress) is deterministic, forward and
           * reverse scrolling scrub the same frames without time-based drift.
           */
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              updateScene(self.progress);
            },
          });

          return () => {
            trigger.kill();
            delete section.dataset.motion;
            section.style.removeProperty("--ring-progress");
            services.forEach((service) => {
              delete service.dataset.active;
            });
          };
        },
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 820px)",
        () => {
          section.dataset.motion = "mobile";
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateScene(self.progress),
          });

          return () => {
            trigger.kill();
            delete section.dataset.motion;
          };
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.dataset.motion = "reduced";
        scene.render(STATIC_SCENE_PROGRESS);
        if (railRef.current) railRef.current.style.opacity = "0";
        return () => {
          delete section.dataset.motion;
          if (railRef.current) railRef.current.style.opacity = "";
        };
      });
    }, section);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      scene.destroy();
    };
  }, []);

  return (
    <section
      id="orbit-services"
      ref={sectionRef}
      className={styles.scrub}
      aria-label={copy.aria}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <p className={styles.tag}>
        <span className={styles.tagMark} aria-hidden="true" />
        {copy.tag}
      </p>

      <div className={styles.captions}>
        <article key={activeCaption.num} className={styles.caption}>
          <div className={styles.captionLead}>
            <span className={styles.capNum}>{activeCaption.num}</span>
            <h2 className={styles.capTxt}>{activeCaption.title}</h2>
          </div>
          <p className={styles.capBody}>{activeCaption.body}</p>
        </article>
      </div>

      <ul className={styles.serviceList} aria-label="Service progression">
        {copy.items.map((service, i) => (
          <li
            key={i}
            className={styles.serviceItem}
            data-ring-service
            data-active={i === activeServiceIndex ? "true" : "false"}
          >
            <span className={styles.serviceDot} aria-hidden="true" />
            <span>
              <span className={styles.serviceName}>
                {service.num.replace(/^\d+\s\/\s/, "")}
              </span>
              <span className={styles.serviceLine}>{service.title}</span>
            </span>
          </li>
        ))}
      </ul>

      <div ref={railRef} className={styles.rail} aria-hidden="true">
        <div ref={railFillRef} className={styles.railFill} />
      </div>
    </section>
  );
}
