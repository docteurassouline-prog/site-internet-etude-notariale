import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIE_LABELS, CATEGORIES, loadAllArticles } from "@/lib/content";
import { PageIntro } from "@/components/page-intro";
import { ArticleList } from "@/components/article-list";
import { ContactBand } from "@/components/contact-band";

export const metadata: Metadata = {
  title: { absolute: "Blog juridique — Étude notariale Thomas Lévy, Paris 16" },
  description:
    "Analyses et repères en droit immobilier, successions, patrimoine et entreprise, rédigés par l'étude notariale Thomas Lévy à Paris. Informations à caractère général.",
  alternates: { canonical: "/blog" },
};

export default function IndexBlog() {
  const articles = loadAllArticles();
  return (
    <main>
      <PageIntro
        titre="Les publications de l'étude"
        rubrique="Analyses & repères"
        description="Droit immobilier, patrimoine, famille, entreprise et international : les éclairages de l'étude, réunis par domaine."
      >
        <nav aria-label="Rubriques des publications" className="topic-nav mt-8">
          <Link href="/blog" aria-current="page">
            Toutes les publications
          </Link>
          {CATEGORIES.map((categorie) => (
            <Link href={`/blog/${categorie}`} key={categorie}>
              {CATEGORIE_LABELS[categorie]}
            </Link>
          ))}
        </nav>
      </PageIntro>
      <div className="site-container page-body">
        {articles.length ? (
          <ArticleList articles={articles} />
        ) : (
          <p>
            Les publications de l&apos;étude seront mises en ligne
            prochainement.
          </p>
        )}
      </div>
      <ContactBand />
    </main>
  );
}
