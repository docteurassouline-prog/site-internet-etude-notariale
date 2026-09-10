import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Tarifs et émoluments du notaire — Étude Thomas Lévy, Paris",
  },
  description:
    "Comprendre le coût d'un acte notarié : émoluments réglementés, débours, droits et taxes, honoraires libres. Une information claire avant tout engagement.",
  alternates: { canonical: "/tarif" },
};

/**
 * Page Tarif (§8) : quatre sections, aucune simulation chiffrée, aucun
 * montant. Références : art. L. 444-1 et s. C. com. et arrêtés tarifaires
 * en vigueur — à vérifier avant publication.
 *
 * L'URL était /honoraires : le mot ne désigne qu'une des trois composantes
 * du coût, à côté des émoluments et des débours. Redirection 301 conservée
 * dans next.config.ts.
 */
const SECTIONS: { titre: string; contenu: string[] }[] = [
  {
    titre: "Émoluments réglementés",
    contenu: [
      "La rémunération du notaire est, pour la plupart des actes, fixée par un tarif national réglementé (articles L. 444-1 et suivants du code de commerce et arrêtés pris pour leur application). Ce tarif est identique pour tous les notaires de France : à acte égal, émolument égal, quelle que soit l'étude choisie.",
      "Les émoluments sont tantôt fixes, tantôt proportionnels à la valeur énoncée à l'acte, selon un barème dégressif par tranches. Ils rémunèrent l'analyse juridique, la rédaction, la réception de l'acte et l'accomplissement des formalités qui lui sont attachées.",
    ],
  },
  {
    titre: "Débours",
    contenu: [
      "Les débours correspondent aux sommes que l'étude avance pour le compte de son client auprès de tiers : état hypothécaire, documents d'urbanisme, extraits cadastraux, pièces d'état civil, intervention d'un géomètre ou d'un syndic, notamment. Ils sont restitués à l'euro près et détaillés dans le compte remis à l'issue du dossier.",
    ],
  },
  {
    titre: "Droits et taxes",
    contenu: [
      "La part la plus importante des sommes versées à l'occasion d'un acte — couramment dénommées « frais de notaire » — est en réalité constituée d'impôts perçus pour le compte de l'État et des collectivités : droits d'enregistrement, taxe de publicité foncière, contribution de sécurité immobilière, TVA le cas échéant. Le notaire les collecte et les reverse intégralement au Trésor public.",
    ],
  },
  {
    titre: "Honoraires libres",
    contenu: [
      "Les prestations qui ne relèvent pas du tarif réglementé — consultations juridiques, négociations, audits, ingénierie patrimoniale ou accompagnement d'opérations complexes — donnent lieu à des honoraires librement convenus. Leur montant ou leur mode de calcul est convenu par écrit avec le client avant toute intervention, conformément à l'article L. 444-1 du code de commerce.",
      "Un devis ou une convention d'honoraires est remis sur demande. Un rendez-vous permet d'examiner votre situation et de préciser le coût prévisible de l'opération envisagée.",
    ],
  },
];

import { PageIntro } from "@/components/page-intro";
import { ContactAside } from "@/components/contact-band";

export default function PageTarif() {
  return (
    <main>
      <PageIntro
        titre="Comprendre le tarif notarial"
        rubrique="Une information avant tout engagement"
        description="Émoluments réglementés, débours, droits et taxes, honoraires libres : retrouvez les quatre composantes présentées par l'étude."
      />
      <div className="site-container page-body reading-grid">
        <div className="reading-sections">
          {SECTIONS.map((section, i) => (
            <section id={`tarif-${i + 1}`} key={section.titre}>
              <p className="eyebrow mb-3">0{i + 1}</p>
              <h2>{section.titre}</h2>
              {section.contenu.map((paragraphe, index) => (
                <p key={index}>{paragraphe}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="page-aside">
          <nav aria-label="Composantes du tarif" className="page-toc">
            <p className="eyebrow mb-3">Dans cette page</p>
            {SECTIONS.map((s, i) => (
              <a href={`#tarif-${i + 1}`} key={s.titre}>
                {s.titre}
              </a>
            ))}
          </nav>
          <ContactAside />
        </div>
      </div>
    </main>
  );
}
