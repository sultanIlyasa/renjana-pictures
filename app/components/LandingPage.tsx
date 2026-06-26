"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import LightRing from "./LightRing";
import StorySections from "./StorySections";
import type { SiteLanguage } from "./content";
import type { SiteContent } from "../data/siteContent";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ content }: { content?: SiteContent }) {
  const [language, setLanguage] = useState<SiteLanguage>("id");

  useEffect(() => {
    document.documentElement.lang = language;

    let layoutFrame: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
    const delayedRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 180);

    return () => {
      window.cancelAnimationFrame(frame);
      if (layoutFrame) window.cancelAnimationFrame(layoutFrame);
      window.clearTimeout(delayedRefresh);
    };
  }, [language]);

  return (
    <main className="flex flex-1 flex-col bg-void">
      <Hero
        content={content?.hero?.[language]}
        language={language}
        onLanguageChange={setLanguage}
      />
      <LightRing content={content?.lightRing?.[language]} language={language} />
      <StorySections
        content={{
          ...content?.story?.[language],
          contactDetails: content?.contactDetails,
        }}
        language={language}
      />
    </main>
  );
}
