import type { SiteLanguage } from "../components/content";
import type { ArticleEntry } from "../data/articles";
import type {
  ContactDetails,
  HeroContent,
  LightRingCopy,
  LocalizedContent,
  SiteContent,
  StoryContent,
} from "../data/siteContent";
import { sanityFetch } from "./sanity";

type SanitySiteSettings = {
  hero?: LocalizedContent<HeroContent>;
  lightRing?: LocalizedContent<Partial<LightRingCopy>>;
  story?: LocalizedContent<StoryContent>;
  contactDetails?: Partial<ContactDetails>;
};

const articleProjection = `{
  "slug": slug.current,
  "image": coalesce(image.asset->url, imageUrl),
  "alt": coalesce(alt, image.alt, title),
  date,
  title,
  body,
  caption,
  cta,
  language,
  deck,
  paragraphs
}`;

const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  hero,
  lightRing,
  story,
  contactDetails
}`;

const articlesQuery = `*[_type == "article" && defined(slug.current)]
  | order(coalesce(orderRank, 9999) asc, _createdAt desc) ${articleProjection}`;

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] ${articleProjection}`;

function hasLanguage(value: unknown): value is SiteLanguage {
  return value === "id" || value === "en";
}

function cleanArticle(article: Partial<ArticleEntry>) {
  if (!article.slug || !article.title || !hasLanguage(article.language)) {
    return undefined;
  }

  return {
    slug: article.slug,
    image: typeof article.image === "string" ? article.image : "/work/flame.jpg",
    alt: article.alt ?? article.title,
    date: article.date ?? "Field Note",
    title: article.title,
    body: article.body ?? "",
    caption: article.caption ?? "",
    cta: article.cta ?? (article.language === "id" ? "Baca catatan" : "Read note"),
    language: article.language,
    deck: article.deck ?? article.body ?? "",
    paragraphs:
      Array.isArray(article.paragraphs) && article.paragraphs.length > 0
        ? article.paragraphs
        : [article.body ?? ""].filter(Boolean),
  } satisfies ArticleEntry;
}

export async function getSanityArticles() {
  const articles = await sanityFetch<Partial<ArticleEntry>[]>(articlesQuery);

  return (articles ?? [])
    .map(cleanArticle)
    .filter((article): article is ArticleEntry => Boolean(article));
}

export async function getSanityArticleBySlug(slug: string) {
  const article = await sanityFetch<Partial<ArticleEntry>>(articleBySlugQuery, {
    slug,
  });

  return article ? cleanArticle(article) : undefined;
}

export async function getSanitySiteContent() {
  const settings = await sanityFetch<SanitySiteSettings>(siteSettingsQuery);

  if (!settings) return undefined;

  return {
    hero: settings?.hero,
    lightRing: settings?.lightRing,
    story: settings?.story,
    contactDetails: settings?.contactDetails,
  } satisfies SiteContent;
}
