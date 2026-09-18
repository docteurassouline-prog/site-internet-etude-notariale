import type { Metadata } from "next";
import { ExpertiseDirectory } from "@/components/expertise-directory";
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
      />
      <div className="site-container page-body">
        <ExpertiseDirectory domaines={FAMILLES.map((famille) => ({
          id: famille.id, titre: famille.titre, description: famille.description,
          expertises: famille.slugs.map((slug) => {
            const fm = loadExpertise(slug).frontmatter;
            return { slug, titre: fm.title, description: fm.description };
          }),
        }))} />
      </div>
      <ContactBand />
    </main>
  );
}
