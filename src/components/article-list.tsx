import Link from "next/link";
import { CATEGORIE_LABELS, type loadAllArticles } from "@/lib/content";
import { dateFr } from "@/lib/dates";

export function ArticleList({
  articles,
  titreNiveau = 2,
  format = "liste",
}: {
  articles: ReturnType<typeof loadAllArticles>;
  titreNiveau?: 2 | 3;
  format?: "liste" | "grille";
}) {
  const Titre = titreNiveau === 2 ? "h2" : "h3";
  return (
    <ul className={`article-list ${format === "grille" ? "journal-grid" : ""}`}>
      {articles.map(({ frontmatter: fm }, index) => (
        <li key={`${fm.categorie}/${fm.slug}`}>
          <Link
            href={`/blog/${fm.categorie}/${fm.slug}`}
            className="article-item"
          >
            <div className="article-meta">
              {format === "grille" && <span className="journal-number" aria-hidden="true">0{index + 1}</span>}
              <p className="eyebrow">{CATEGORIE_LABELS[fm.categorie]}</p>
              <time
                dateTime={fm.date}
                className="mt-3 block text-sm text-slate-soft"
              >
                {dateFr(fm.date)}
              </time>
            </div>
            <div className="article-copy">
              <Titre>{fm.title}</Titre>
              {fm.description && (
                <p className="mt-3 text-base text-slate-soft">
                  {fm.description}
                </p>
              )}
              <p className="mt-3 text-sm text-slate-soft">{fm.author}</p>
            </div>
            <span className="article-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
