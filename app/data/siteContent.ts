import type { SiteLanguage } from "../components/content";
import type { ArticleEntry } from "./articles";

export type LocalizedContent<T> = Partial<Record<SiteLanguage, T>>;

export type HeroHeadlineWord = {
  text: string;
  accent?: boolean;
};

export type HeroCopy = {
  aria: string;
  creditMark: string;
  credit: string;
  videoMeta: string;
  headline: HeroHeadlineWord[];
  sub: string;
  primary: string;
  secondary: string;
  cue: string;
  cueAria: string;
  languageLabel: string;
};

export type HeroVideo = {
  src: string;
  fallbackSrc?: string;
  poster: string;
  type?: string;
  fallbackType?: string;
};

export type HeroContent = Partial<HeroCopy> & {
  video?: Partial<HeroVideo>;
};

export type OrbitServiceItem = {
  num: string;
  title: string;
  body: string;
};

export type LightRingCopy = {
  tag: string;
  aria: string;
  items: OrbitServiceItem[];
};

export type Service = {
  label: string;
  title: string;
  body: string;
  details: string[];
};

export type Reel = {
  youtubeId: string;
  title: string;
  label: string;
  body: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type ArticleCard = {
  slug?: string;
  image: string;
  alt: string;
  date: string;
  title: string;
  body: string;
  caption: string;
  cta: string;
};

export type Testimonial = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  caption: string;
};

export type ContactDetails = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  mapsUrl: string;
};

export type StoryCopy = {
  servicesCredit: string;
  servicesTitle: string;
  servicesLead: string;
  services: Service[];
  reelCredit: string;
  reelTitle: string;
  reelBody: string;
  reelSkip: string;
  reelPrev: string;
  reelNext: string;
  reels: Reel[];
  statsCredit: string;
  statsTitle: string;
  stats: Stat[];
  testimonialCredit: string;
  testimonialTitle: string;
  testimonials: Testimonial[];
  articleCredit: string;
  articleTitle: string;
  articlePrev: string;
  articleNext: string;
  articles: ArticleCard[];
  contactCredit: string;
  contactTitle: string;
  contactBody: string;
  contactInfoLabel: string;
  contactLinks: {
    phone: string;
    email: string;
    maps: string;
  };
  contactMapTitle: string;
  contactMapBody: string;
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    project: string;
    projectPlaceholder: string;
    submit: string;
    sending: string;
    toast: string;
  };
  footerBrand: string;
  footerCredit: string;
};

export type StoryContent = Partial<
  Omit<StoryCopy, "contactLinks" | "fields">
> & {
  contactLinks?: Partial<StoryCopy["contactLinks"]>;
  fields?: Partial<StoryCopy["fields"]>;
  contactDetails?: Partial<ContactDetails>;
};

export type SiteContent = {
  hero?: LocalizedContent<HeroContent>;
  lightRing?: LocalizedContent<Partial<LightRingCopy>>;
  story?: LocalizedContent<StoryContent>;
  contactDetails?: Partial<ContactDetails>;
  articles?: LocalizedContent<ArticleEntry[]>;
};
