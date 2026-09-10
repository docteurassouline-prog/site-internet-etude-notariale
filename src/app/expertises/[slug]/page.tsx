import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, schemaFaq, schemaFilAriane } from "@/components/json-ld";
import { SEO_TITLES } from "@/config/seo";
import {
  EXPERTISE_SLUGS,
  loadExpertise,
  PLACEHOLDER,
  type ExpertiseSlug,
} from "@/lib/content";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXPERTISE_SLUGS.map((slug) => ({ slug }));
}

function estSlugValide(slug: string): slug is ExpertiseSlug {
  return (EXPERTISE_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!estSlugValide(slug)) return {};
  const { frontmatter } = loadExpertise(slug);
  return {
    // Title absolu : il porte déjà la marque et la localisation (§7).
    title: { absolute: frontmatter.seoTitle ?? SEO_TITLES[slug] },
    description: frontmatter.description,
    alternates: { canonical: `/expertises/${slug}` },
  };
}

/**
 * Gabarit unique des pages d'expertise (§8) : introduction → problématiques
 * → approche → déroulement → FAQ → expertises connexes → CTA.
 * Les contenus proviennent exclusivement des MDX (§9).
 */

import { PageIntro } from "@/components/page-intro";
import { ContactAside, ContactBand } from "@/components/contact-band";
import { MarkdownContent } from "@/components/markdown-content";
import { AccordeonFaq } from "@/components/accordeon-faq";
import { FAMILLES } from "@/config/navigation";

export default async function PageExpertise({ params }: Params) {
  const { slug } = await params;
  if (!estSlugValide(slug)) notFound();
  const { frontmatter: fm, body } = loadExpertise(slug);
  const famille = FAMILLES.find((f) =>
    (f.slugs as readonly string[]).includes(slug),
  );
  const etapes = fm.etapes ?? [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
  const sommaire = [
    { id: "enjeux", titre: "Les enjeux" },
    { id: "approche", titre: "Notre approche" },
    { id: "deroulement", titre: "Les étapes" },
    ...(fm.faq.length
      ? [{ id: "questions", titre: "Questions fréquentes" }]
      : []),
  ];
  return (
    <main>
      <JsonLd
        data={schemaFilAriane([
          { href: "/expertises", label: "Expertises" },
          { label: fm.title },
        ])}
      />
      {fm.faq.length > 0 && <JsonLd data={schemaFaq(fm.faq)} />}
      <PageIntro
        titre={fm.title}
        rubrique={famille?.titre}
        maillons={[
          { href: "/expertises", label: "Expertises" },
          { label: fm.title },
        ]}
      />
      <div className="site-container page-body reading-grid">
        <div className="reading-sections">
          <section aria-label="Présentation">
            <MarkdownContent contenu={body} />
          </section>
          <section id="enjeux">
            <p className="eyebrow mb-3">01 · Comprendre</p>
            <h2>Problématiques rencontrées</h2>
            {fm.problematiques ? (
              <ul className="space-y-4">
                {fm.problematiques.map((texte, i) => (
                  <li
                    key={i}
                    className="border-l-2 border-gold pl-5 text-slate-soft"
                  >
                    {texte}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{PLACEHOLDER}</p>
            )}
          </section>
          <section id="approche">
            <p className="eyebrow mb-3">02 · Structurer</p>
            <h2>L&apos;approche de l&apos;étude</h2>
            <p>{fm.approche ?? PLACEHOLDER}</p>
          </section>
          <section id="deroulement">
            <p className="eyebrow mb-3">03 · Accompagner</p>
            <h2>Déroulement d&apos;un dossier</h2>
            <ol className="space-y-6">
              {etapes.map((etape, i) => (
                <li key={i} className="flex gap-5">
                  <span
                    className="font-serif text-3xl text-gold-ink"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p>{etape}</p>
                </li>
              ))}
            </ol>
          </section>
          {fm.faq.length > 0 && (
            <section id="questions">
              <h2>Questions fréquentes</h2>
              <AccordeonFaq
                entrees={fm.faq.map((q, i) => ({
                  ...q,
                  id: `question-${i + 1}`,
                }))}
              />
            </section>
          )}
        </div>
        <div className="page-aside">
          <nav aria-label="Dans cette page" className="page-toc">
            <p className="eyebrow mb-3">Dans cette page</p>
            {sommaire.map((item) => (
              <a href={`#${item.id}`} key={item.id}>
                {item.titre}
              </a>
            ))}
          </nav>
          <ContactAside />
        </div>
      </div>
      <section className="border-t border-line">
        <div className="site-container page-body">
          <p className="eyebrow">Poursuivre votre lecture</p>
          <h2 className="section-title mt-3">Expertises connexes</h2>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {fm.related.map((connexe) => {
              const related = loadExpertise(connexe).frontmatter;
              return (
                <li key={connexe}>
                  <Link
                    href={`/expertises/${connexe}`}
                    className="expertise-card"
                  >
                    <h3>{related.title}</h3>
                    <p>{related.description}</p>
                    <span>
                      Découvrir <span aria-hidden="true">↗</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
