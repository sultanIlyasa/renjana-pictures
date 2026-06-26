import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ALL_ARTICLES,
  getArticleBySlug,
} from "../../data/articles";
import type { ArticleEntry } from "../../data/articles";
import styles from "./ArticlePage.module.css";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const ARTICLE_COPY = {
  id: {
    back: "Kembali",
    label: "Artikel produksi",
    bodyLabel: "Cerita",
    related: "Artikel lain",
    ready: "Materi ringkas untuk pratinjau presentasi.",
  },
  en: {
    back: "Back",
    label: "Production article",
    bodyLabel: "Story",
    related: "Related articles",
    ready: "A concise draft for presentation preview.",
  },
};

export const dynamicParams = false;

function getRelatedArticleEntries(article: ArticleEntry, articles: ArticleEntry[]) {
  return articles
    .filter((item) => item.language === article.language && item.slug !== article.slug)
    .slice(0, 4);
}

export async function generateStaticParams() {
  return ALL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found | Renjana Pictures",
    };
  }

  return {
    title: `${article.title} | Renjana Pictures`,
    description: article.body,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const copy = ARTICLE_COPY[article.language];
  const relatedArticles = getRelatedArticleEntries(article, ALL_ARTICLES);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            {copy.back}
          </Link>
          <span className={styles.language}>{article.language.toUpperCase()}</span>
        </header>

        <article className={styles.article}>
          <div className={styles.hero}>
            <div>
              <span className={styles.kicker}>{copy.label}</span>
              <h1>{article.title}</h1>
              <p className={styles.deck}>{article.deck}</p>
            </div>

            <aside className={styles.meta} aria-label="Article metadata">
              <span>{article.date}</span>
              <p>{article.body}</p>
              <strong>{copy.ready}</strong>
            </aside>
          </div>

          <figure className={styles.figure}>
            <Image
              src={article.image}
              alt={article.alt}
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 900px) 100vw, 88vw"
            />
            <figcaption>{article.caption}</figcaption>
          </figure>

          <div className={styles.bodyGrid}>
            <div className={styles.bodyLabel}>{copy.bodyLabel}</div>
            <div className={styles.body}>
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeader}>
            <span className={styles.kicker}>{copy.related}</span>
            <h2 id="related-title">{copy.related}</h2>
          </div>

          <div className={styles.relatedGrid}>
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className={styles.relatedCard}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={560}
                  height={420}
                  sizes="(max-width: 760px) 92vw, 22vw"
                />
                <span>{item.date}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
