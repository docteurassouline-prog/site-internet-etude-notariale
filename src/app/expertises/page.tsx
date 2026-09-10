import type { Metadata } from "next";
import Link from "next/link";
import { loadExpertise } from "@/lib/content";
import { FAMILLES } from "@/config/navigation";
import { PageIntro } from "@/components/page-intro";
import { ContactBand } from "@/components/contact-band";

export const metadata: Metadata = {
  title: { absolute: "Nos expertises — Étude notariale Thomas Lévy, Paris 16" },
  description:
    "Domaines d'intervention de l'étude : immobilier résidentiel et professionnel, successions, donations, SCI, entreprise, opérations internationales, family office.",
  alternates: { canonical: "/expertises" },
};

export default function IndexExpertises() {
  return (
    <main>
      <PageIntro
        titre="Nos expertises"
        rubrique="Quatre domaines · Dix-huit expertises"
        description="Immobilier, patrimoine et famille, entreprise, international : trouvez le domaine qui correspond à votre projet."
      >
        <nav aria-label="Domaines d'intervention" className="topic-nav mt-8">
          {FAMILLES.map((f) => (
            <a key={f.id} href={`#${f.id}`}>
              {f.titre}
            </a>
          ))}
        </nav>
      </PageIntro>
      <div className="site-container page-body expertise-directory">
        {FAMILLES.map((famille, index) => (
          <section
            id={famille.id}
            key={famille.id}
            className="directory-section"
          >
            <div className="directory-heading">
              <p className="eyebrow">Domaine 0{index + 1}</p>
              <h2 className="section-title mt-3">{famille.titre}</h2>
              <p className="mt-5 text-base text-slate-soft">
                {famille.description}
              </p>
            </div>
            <ul className="expertise-grid">
              {famille.slugs.map((slug) => {
                const { frontmatter } = loadExpertise(slug);
                return (
                  <li key={slug}>
                    <Link
                      href={`/expertises/${slug}`}
                      className="expertise-card"
                    >
                      <h3>{frontmatter.title}</h3>
                      <p>{frontmatter.description}</p>
                      <span>
                        Découvrir cette expertise{" "}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <ContactBand />
    </main>
  );
}
