import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { MarkdownContent } from "@/components/markdown-content";
import { ContactAside } from "@/components/contact-band";
import { ArticleList } from "@/components/article-list";
import { markdownHeadings } from "@/lib/markdown-headings";
import { dateFr } from "@/lib/dates";
import { JsonLd, schemaArticle, schemaFilAriane } from "@/components/json-ld";
import {
  CATEGORIE_LABELS,
  CATEGORIES,
  loadAllArticles,
  loadExpertise,
  type Categorie,
} from "@/lib/content";

interface Params {
  params: Promise<{ categorie: string; slug: string }>;
}

export function generateStaticParams() {
  return loadAllArticles().map(({ frontmatter }) => ({
    categorie: frontmatter.categorie,
    slug: frontmatter.slug,
  }));
}

function estCategorieValide(categorie: string): categorie is Categorie {
  return (CATEGORIES as readonly string[]).includes(categorie);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorie, slug } = await params;
  if (!estCategorieValide(categorie)) return {};
  const article = loadAllArticles().find(
    (a) => a.frontmatter.categorie === categorie && a.frontmatter.slug === slug,
  );
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    // Description facultative (§7) : mieux vaut laisser Google composer
    // l'extrait qu'inventer une description qui n'a pas été validée.
    ...(article.frontmatter.description
      ? { description: article.frontmatter.description }
      : {}),
    alternates: { canonical: `/blog/${categorie}/${slug}` },
  };
}

/** Gabarit article : contenu MDX, expertise pilier, articles connexes (§6). */
export default async function PageArticle({ params }: Params) {
  const { categorie, slug } = await params;
  if (!estCategorieValide(categorie)) notFound();
  const articles = loadAllArticles();
  const article = articles.find(
    (a) => a.frontmatter.categorie === categorie && a.frontmatter.slug === slug,
  );
  if (!article) notFound();
  const { frontmatter: fm, body } = article;
  const pilier = loadExpertise(fm.pillar);
  const sommaire = markdownHeadings(body);
  const minutes = Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
  const connexes = articles.filter(
    (a) => a.frontmatter.categorie === categorie && a.frontmatter.slug !== slug,
  );
  return (
    <main>
      <JsonLd data={schemaArticle(fm)} />
      <JsonLd
        data={schemaFilAriane([
          { href: "/blog", label: "Publications" },
          { href: `/blog/${categorie}`, label: CATEGORIE_LABELS[categorie] },
          { label: fm.title },
        ])}
      />
      <article>
        <PageIntro
          titre={fm.title}
          rubrique={CATEGORIE_LABELS[categorie]}
          maillons={[
            { href: "/blog", label: "Publications" },
            { href: `/blog/${categorie}`, label: CATEGORIE_LABELS[categorie] },
            { label: fm.title },
          ]}
        >
          <p className="mt-6 text-sm text-slate-soft">
            <time dateTime={fm.date}>{dateFr(fm.date)}</time> · {fm.author} · Lecture : environ {minutes} min
          </p>
        </PageIntro>
        <div className="site-container page-body reading-grid">
          <div>
            <MarkdownContent contenu={body} />
            <section className="mt-12 border-t border-line pt-8">
              <p className="text-sm text-slate-soft">
                Les informations publiées sur ce site ont un caractère général
                et ne constituent pas une consultation juridique.
              </p>
              <Link href={`/blog/${categorie}`} className="text-link mt-5">
                ← Retour à la rubrique
              </Link>
            </section>
          </div>
          <div className="page-aside">
            {sommaire.length > 0 && <nav className="page-toc mb-8" aria-label="Sommaire de l'article">
              <p className="eyebrow mb-3">Dans cet article</p>
              {sommaire.map((item) => <a href={`#${item.id}`} key={item.id}>{item.titre}</a>)}
            </nav>}
            <div className="border-l border-gold pl-6">
              <p className="eyebrow">Expertise associée</p>
              <h2 className="mt-4 font-serif text-2xl">
                <Link
                  href={`/expertises/${fm.pillar}`}
                  className="underline decoration-gold underline-offset-4"
                >
                  {pilier.frontmatter.title}
                </Link>
              </h2>
            </div>
            <ContactAside sujet={pilier.frontmatter.title} />
          </div>
        </div>
      </article>
      {connexes.length > 0 && (
        <section className="site-container pb-16">
          <h2 className="section-title mb-8">Dans la même rubrique</h2>
          <ArticleList articles={connexes} titreNiveau={3} />
        </section>
      )}
    </main>
  );
}
