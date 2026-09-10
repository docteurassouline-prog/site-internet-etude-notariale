import Link from "next/link";
import { CATEGORIE_LABELS, type loadAllArticles } from "@/lib/content";
import { dateFr } from "@/lib/dates";

export function ArticleList({
  articles,
  titreNiveau = 2,
}: {
  articles: ReturnType<typeof loadAllArticles>;
  titreNiveau?: 2 | 3;
}) {
  const Titre = titreNiveau === 2 ? "h2" : "h3";
  return (
    <ul className="article-list">
      {articles.map(({ frontmatter: fm }) => (
        <li key={`${fm.categorie}/${fm.slug}`}>
          <Link
            href={`/blog/${fm.categorie}/${fm.slug}`}
            className="article-item"
          >
            <div>
              <p className="eyebrow">{CATEGORIE_LABELS[fm.categorie]}</p>
              <time
                dateTime={fm.date}
                className="mt-3 block text-sm text-slate-soft"
              >
                {dateFr(fm.date)}
              </time>
            </div>
            <div>
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
