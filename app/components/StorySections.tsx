"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StorySections.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SERVICES = [
  {
    label: "Broadcast",
    title: "The signal stays clear when the room gets loud.",
    body: "Live events, launches, interview rooms, multi-camera coverage, and broadcast-ready edits built around timing, redundancy, and clean delivery.",
    details: ["Multi-camera units", "Event films", "Live packages"],
  },
  {
    label: "Film",
    title: "Images with enough atmosphere to hold attention.",
    body: "Brand films, campaign narratives, product reels, and visual treatments shaped from concept through shoot day with a director's eye.",
    details: ["Treatment", "Production", "Direction"],
  },
  {
    label: "Advertising",
    title: "Commercial cuts designed for memory, not noise.",
    body: "TV spots, social-first cutdowns, motion graphics, sound, color, and delivery masters for campaigns that need to move fast.",
    details: ["TVC", "Social cutdowns", "Post production"],
  },
];

const PANELS = [
  {
    title: "Ember & Oath",
    label: "Brand film",
    src: "/work/flame.mp4",
    poster: "/work/flame.jpg",
    body: "A campaign world built around heat, texture, and ritual.",
  },
  {
    title: "Cloudburst",
    label: "Television spot",
    src: "/work/rain.mp4",
    poster: "/work/rain.jpg",
    body: "A weather-driven product story with a controlled studio rhythm.",
  },
  {
    title: "Golden Hour",
    label: "Tourism film",
    src: "/work/sunset.mp4",
    poster: "/work/sunset.jpg",
    body: "Location, light, and an edit that lets the place breathe.",
  },
  {
    title: "Still Water",
    label: "Product reel",
    src: "/work/water.mp4",
    poster: "/work/water.jpg",
    body: "Macro movement and quiet pacing for an object-led launch.",
  },
  {
    title: "Aftertaste",
    label: "Fashion reel",
    src: "/work/smoke.mp4",
    poster: "/work/smoke.jpg",
    body: "A slow-burn visual language for a campaign with edge.",
  },
];

const STATS = [
  { value: 48, suffix: "h", label: "first editorial direction" },
  { value: 12, suffix: "+", label: "delivery formats per campaign" },
  { value: 4, suffix: "K", label: "broadcast-ready mastering" },
  { value: 30, suffix: "s", label: "hero spot cutdowns" },
];

const ARTICLES = [
  {
    date: "Field Note 01",
    title: "Why the first frame decides the rest of the edit.",
    body: "A short look at how Renjana blocks attention before the timeline ever opens.",
  },
  {
    date: "Field Note 02",
    title: "Making live coverage feel composed.",
    body: "Broadcast work is choreography: camera, comms, redundancy, and a calm final signal.",
  },
  {
    date: "Field Note 03",
    title: "The quiet advantage of campaign cutdowns.",
    body: "A good master film already knows how it will become six sharper versions.",
  },
];

export default function StorySections() {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-service-card]", {
          y: 54,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-service-grid]",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from("[data-soft-reveal]", {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-soft-reveal-root]",
            start: "top 78%",
            once: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const obj = { value: 0 };

          gsap.to(obj, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 72%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = `${Math.round(obj.value)}${suffix}`;
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((el) => {
          el.textContent = `${el.dataset.target ?? "0"}${el.dataset.suffix ?? ""}`;
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === "sending") return;
    setFormState("sending");
    window.setTimeout(() => setFormState("sent"), 900);
    window.setTimeout(() => setFormState("idle"), 3800);
    event.currentTarget.reset();
  };

  return (
    <div ref={rootRef}>
      <section id="services" className={styles.services} aria-labelledby="services-title">
        <div className={styles.inner}>
          <div className={styles.serviceIntro}>
            <span className={styles.credit}>Production house, not vendor deck</span>
            <h2 id="services-title" className={styles.sectionTitle}>
              Three disciplines, one directed signal.
            </h2>
            <p className={styles.lead}>
              Renjana moves from idea to shoot to final master without losing the
              emotional thread. The work can be broadcast, cinematic, or commercial;
              the standard stays the same.
            </p>
          </div>

          <div className={styles.serviceGrid} data-service-grid>
            {SERVICES.map((service, index) => (
              <article
                key={service.label}
                className={styles.serviceCard}
                data-service-card
              >
                <span className={styles.serviceIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className={styles.serviceLabel}>{service.label}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
                <ul>
                  {service.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="work"
        className={styles.horizontal}
        aria-labelledby="work-title"
      >
        <div className={styles.horizontalHeader}>
          <div>
            <span className={styles.credit}>Reel strip</span>
            <h2 id="work-title" className={styles.horizontalTitle}>
              Proof moves sideways.
            </h2>
            <p>
              Five production moods in a browsable strip. Swipe or trackpad
              sideways when you want the reel; keep scrolling when you do not.
            </p>
          </div>
          <a href="#stats" className={styles.skipReel}>
            Skip reel
          </a>
        </div>

        <div className={styles.panelTrack} aria-label="Production reel panels">
          {PANELS.map((panel) => (
            <article key={panel.title} className={styles.panel}>
              <video
                className={styles.panelMedia}
                src={panel.src}
                poster={panel.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-hidden="true"
              />
              <span className={styles.panelScrim} aria-hidden="true" />
              <div className={styles.panelCopy}>
                <span>{panel.label}</span>
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={statsRef}
        id="stats"
        className={styles.stats}
        aria-labelledby="stats-title"
      >
        <div className={styles.inner}>
          <div className={styles.statsHeader}>
            <span className={styles.credit}>Operational calm</span>
            <h2 id="stats-title" className={styles.sectionTitle}>
              The craft is atmospheric. The delivery is exact.
            </h2>
          </div>

          <div className={styles.statGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span
                  data-stat-value
                  data-target={stat.value}
                  data-suffix={stat.suffix}
                  className={styles.statValue}
                >
                  0{stat.suffix}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.quote}
        aria-labelledby="quote-title"
        data-soft-reveal-root
      >
        <div className={styles.inner}>
          <blockquote data-soft-reveal>
            <p id="quote-title">
              Renjana made the room feel quiet. Every frame had intent, every cut
              had a reason, and the final film felt larger than the brief.
            </p>
            <footer>
              <span>Arunika Studio</span>
              Fictional campaign partner
            </footer>
          </blockquote>
        </div>
      </section>

      <section className={styles.news} aria-labelledby="news-title">
        <div className={styles.inner}>
          <div className={styles.newsHeader}>
            <span className={styles.credit}>Notes from the floor</span>
            <h2 id="news-title" className={styles.sectionTitle}>
              Articles that read like production memory.
            </h2>
          </div>

          <div className={styles.articleGrid}>
            {ARTICLES.map((article) => (
              <article key={article.title} className={styles.article}>
                <span>{article.date}</span>
                <h3>{article.title}</h3>
                <p>{article.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <span className={styles.credit}>Next project</span>
            <h2 id="contact-title">Bring the brief into the dark room.</h2>
            <p>
              Tell Renjana what needs to be made, where it will be seen, and what
              the audience should feel when the signal lands.
            </p>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              <span>Name</span>
              <input name="name" type="text" placeholder="Your name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" placeholder="you@studio.com" required />
            </label>
            <label>
              <span>Project</span>
              <textarea
                name="message"
                rows={4}
                placeholder="Broadcast, film, advertising, or something stranger."
                required
              />
            </label>
            <button type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Sending" : "Send the brief"}
            </button>
            <p className={styles.toast} data-visible={formState === "sent"}>
              Message staged. This demo form does not send anywhere.
            </p>
          </form>
        </div>

        <footer className={styles.footer}>
          <span>Renjana Pictures</span>
          <span>Demo built by Sarikaya Labs</span>
        </footer>
      </section>
    </div>
  );
}
