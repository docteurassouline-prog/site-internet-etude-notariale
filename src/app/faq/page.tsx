import type { Metadata } from "next";
import { AccordeonFaq } from "@/components/accordeon-faq";
import { JsonLd, schemaFaq } from "@/components/json-ld";
import { loadFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Questions fréquentes — Étude notariale Thomas Lévy, Paris",
  },
  description:
    "Frais de notaire, achat immobilier, succession, donation, SCI, international : les réponses de l'étude aux questions les plus fréquentes de ses clients.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQ générale (§6) — les FAQ spécialisées vivent sur les pages
 * d'expertise. Contenu depuis content/faq.mdx, validé par Zod.
 */
import { PageIntro } from "@/components/page-intro";
import { ContactAside } from "@/components/contact-band";

export default function PageFaq() {
  const faq = loadFaq();
  return (
    <main>
      <JsonLd data={schemaFaq(faq.themes.flatMap((t) => t.questions))} />
      <PageIntro
        titre="Questions fréquentes"
        rubrique="Vos questions, nos repères"
        description="Retrouvez les réponses de l'étude, classées par thème. Les pages d'expertise proposent également des questions propres à chaque domaine."
      />
      <div className="site-container page-body reading-grid">
        <div className="space-y-14">
          {faq.themes.map((theme, indexTheme) => (
            <section key={theme.titre} id={`theme-${indexTheme + 1}`}>
              <h2 className="mb-6 font-serif text-3xl">{theme.titre}</h2>
              <AccordeonFaq
                entrees={theme.questions.map((q, i) => ({
                  ...q,
                  id: `faq-${indexTheme + 1}-${i + 1}`,
                }))}
              />
            </section>
          ))}
        </div>
        <div className="page-aside">
          <nav aria-label="Thèmes de la FAQ" className="page-toc">
            <p className="eyebrow mb-3">Par thème</p>
            {faq.themes.map((theme, i) => (
              <a href={`#theme-${i + 1}`} key={theme.titre}>
                {theme.titre}
              </a>
            ))}
          </nav>
          <ContactAside />
        </div>
      </div>
    </main>
  );
}
