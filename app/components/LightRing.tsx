"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createScrubScene } from "./scrubScene";
import styles from "./LightRing.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SERVICES = [
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
];

export default function LightRing() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const scene = createScrubScene(canvas);
    const onResize = () => {
      scene.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.dataset.motion = "on";
        const rail = railRef.current;
        const railFill = railFillRef.current;
        const captions = gsap.utils.toArray<HTMLElement>("[data-ring-caption]");
        const services = gsap.utils.toArray<HTMLElement>("[data-ring-service]");
        let activeService = -1;

        const setActiveService = (progress: number) => {
          const index = Math.min(
            services.length - 1,
            Math.max(0, Math.floor(progress * services.length)),
          );
          if (index === activeService) return;
          activeService = index;
          services.forEach((service, i) => {
            service.dataset.active = i === index ? "true" : "false";
          });
        };

        gsap.set(captions, { autoAlpha: 0, y: 34, filter: "blur(8px)" });
        gsap.set(captions[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        gsap.set(services, { autoAlpha: 0.48, y: 10 });
        gsap.set(services[0], { autoAlpha: 1, y: 0 });
        if (rail) rail.style.opacity = "";
        if (railFill) railFill.style.transform = "scaleY(0)";
        setActiveService(0);

        /*
         * Pinned service orbit:
         * ScrollTrigger pins this full-viewport section and uses scroll progress
         * as the single source of truth for the canvas frame, progress rail, and
         * service copy. Because render(progress) is deterministic, forward and
         * reverse scrolling scrub the same frames without time-based drift.
         */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scene.render(self.progress);
              section.style.setProperty(
                "--ring-progress",
                self.progress.toFixed(4),
              );
              if (railFill) {
                railFill.style.transform = `scaleY(${self.progress.toFixed(4)})`;
              }
              setActiveService(self.progress);
            },
          },
        });

        const seg = 1 / captions.length;
        captions.forEach((cap, i) => {
          const start = i * seg;
          if (i > 0) {
            tl.fromTo(
              cap,
              { autoAlpha: 0, y: 34, filter: "blur(8px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: seg * 0.28,
                ease: "expo.out",
              },
              start + seg * 0.08,
            );
          }

          if (i < captions.length - 1) {
            tl.to(
              cap,
              {
                autoAlpha: 0,
                y: -26,
                filter: "blur(7px)",
                duration: seg * 0.2,
                ease: "power1.in",
              },
              start + seg * 0.76,
            );
          }
        });

        services.forEach((service, i) => {
          const start = i * seg;
          tl.to(
            service,
            { autoAlpha: 1, y: 0, duration: seg * 0.22, ease: "expo.out" },
            start + seg * 0.06,
          ).to(
            service,
            {
              autoAlpha: i === services.length - 1 ? 1 : 0.48,
              y: i === services.length - 1 ? 0 : -6,
              duration: seg * 0.18,
              ease: "power1.out",
            },
            start + seg * 0.74,
          );
        });

        tl.to({}, { duration: 0.001 }, 1);

        return () => {
          delete section.dataset.motion;
          section.style.removeProperty("--ring-progress");
          services.forEach((service) => {
            delete service.dataset.active;
          });
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.dataset.motion = "reduced";
        scene.render(0.58);
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
      ref={sectionRef}
      className={styles.scrub}
      aria-label="Renjana Pictures services in motion"
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <p className={styles.tag}>
        <span className={styles.tagMark} aria-hidden="true" />
        Orbital services
      </p>

      <div className={styles.captions}>
        {SERVICES.map((service) => (
          <article
            key={service.num}
            className={styles.caption}
            data-ring-caption
          >
            <span className={styles.capNum}>{service.num}</span>
            <h2 className={styles.capTxt}>{service.title}</h2>
            <p className={styles.capBody}>{service.body}</p>
          </article>
        ))}
      </div>

      <ul className={styles.serviceList} aria-label="Service progression">
        {SERVICES.map((service, i) => (
          <li
            key={service.num}
            className={styles.serviceItem}
            data-ring-service
            data-active={i === 0 ? "true" : "false"}
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
