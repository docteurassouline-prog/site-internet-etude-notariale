import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ArticleList } from "@/components/article-list";
import { JsonLd, schemaFilAriane } from "@/components/json-ld";
import {
  CATEGORIE_LABELS,
  CATEGORIES,
  loadArticlesParCategorie,
  type Categorie,
} from "@/lib/content";

interface Params {
  params: Promise<{ categorie: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((categorie) => ({ categorie }));
}

function estCategorieValide(categorie: string): categorie is Categorie {
  return (CATEGORIES as readonly string[]).includes(categorie);
}

/**
 * Chapeau de catégorie — descriptif du champ couvert, sans qualification de
 * l'étude (§3). Il donne à la page un contenu propre plutôt qu'une simple
 * liste de liens.
 */
const CHAPEAUX: Record<Categorie, string> = {
  immobilier:
    "Acquisition et vente, vente en l'état futur d'achèvement, promotion, baux et fiscalité immobilière : les publications de l'étude sur le droit immobilier.",
  "patrimoine-famille":
    "Successions, donations, partages, régimes matrimoniaux et structuration du patrimoine familial : les publications de l'étude en droit patrimonial de la famille.",
  entreprise:
    "Transmission d'entreprise, baux commerciaux et articulation entre patrimoine professionnel et patrimoine privé : les publications de l'étude en droit des affaires.",
  international:
    "Successions comportant des éléments d'extranéité, expatriation, acquisitions par des non-résidents : les publications de l'étude en droit international privé.",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorie } = await params;
  if (!estCategorieValide(categorie)) return {};
  return {
    title: {
      absolute: `${CATEGORIE_LABELS[categorie]} — Blog de l'étude Thomas Lévy, Paris`,
    },
    description: CHAPEAUX[categorie],
    alternates: { canonical: `/blog/${categorie}` },
  };
}

/**
 * Page de catégorie du blog. Le segment existait dans l'URL des articles
 * (/blog/[categorie]/[slug]) sans page correspondante : /blog/immobilier
 * servait une erreur 404, et le fil d'Ariane portait un maillon mort.
 */
export default async function PageCategorie({ params }: Params) {
  const { categorie } = await params;
  if (!estCategorieValide(categorie)) notFound();
  const articles = loadArticlesParCategorie(categorie);
  const libelle = CATEGORIE_LABELS[categorie];
  return (
    <main>
      <JsonLd
        data={schemaFilAriane([
          { href: "/blog", label: "Publications" },
          { label: libelle },
        ])}
      />
      <PageIntro
        titre={libelle}
        rubrique="Publications de l'étude"
        description={CHAPEAUX[categorie]}
        maillons={[
          { href: "/blog", label: "Publications" },
          { label: libelle },
        ]}
      >
        <nav aria-label="Rubriques des publications" className="topic-nav mt-8">
          <Link href="/blog">Toutes les publications</Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/blog/${c}`}
              aria-current={c === categorie ? "page" : undefined}
            >
              {CATEGORIE_LABELS[c]}
            </Link>
          ))}
        </nav>
      </PageIntro>
      <div className="site-container page-body">
        {articles.length ? (
          <ArticleList articles={articles} />
        ) : (
          <p>
            Les publications de cette rubrique seront mises en ligne
            prochainement.
          </p>
        )}
      </div>
    </main>
  );
}
