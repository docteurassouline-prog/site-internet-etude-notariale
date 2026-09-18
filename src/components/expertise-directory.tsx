"use client";

import Link from "next/link";
import { useState } from "react";

type Domaine = {
  id: string;
  titre: string;
  description: string;
  expertises: { slug: string; titre: string; description: string }[];
};

function normaliser(texte: string) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

/** Recherche locale : aucun terme saisi n'est envoyé à un service tiers. */
export function ExpertiseDirectory({ domaines }: { domaines: Domaine[] }) {
  const [recherche, setRecherche] = useState("");
  const mots = normaliser(recherche).trim().split(/\s+/).filter(Boolean);
  const resultats = domaines.map((domaine) => ({
    ...domaine,
    expertises: domaine.expertises.filter((expertise) => {
      const texte = normaliser(`${domaine.titre} ${expertise.titre} ${expertise.description}`);
      return mots.every((mot) => texte.includes(mot));
    }),
  }));
  const nombre = resultats.reduce((total, domaine) => total + domaine.expertises.length, 0);

  return (
    <>
      <nav aria-label="Domaines d'intervention" className="topic-nav mb-10">
        {domaines.map((domaine) => <a key={domaine.id} href={`#${domaine.id}`} onClick={() => setRecherche("")}>{domaine.titre}</a>)}
      </nav>
      <div className="directory-search">
        <div>
          <label htmlFor="recherche-expertises" className="eyebrow">Quel est votre projet ?</label>
          <p className="mt-2 text-sm text-slate-soft">Recherchez un sujet parmi nos 18 expertises</p>
        </div>
        <div>
          <div className="directory-search-field">
            <input id="recherche-expertises" type="search" value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Succession, immobilier, SCI…" aria-controls="liste-expertises" />
            {recherche && <button type="button" onClick={() => setRecherche("")}>Effacer</button>}
          </div>
          <p className="mt-2 text-sm text-slate-soft" role="status">{nombre} expertise{nombre > 1 ? "s" : ""}{mots.length ? " trouvée" : " disponible"}{nombre > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div id="liste-expertises" className="expertise-directory">
        {resultats.map((domaine, index) => (
          <section id={domaine.id} key={domaine.id} className="directory-section" hidden={domaine.expertises.length === 0}>
            <div className="directory-heading">
              <p className="eyebrow">Domaine 0{index + 1}</p>
              <h2 className="section-title mt-3">{domaine.titre}</h2>
              <p className="mt-5 text-base text-slate-soft">{domaine.description}</p>
            </div>
            <ul className="expertise-grid">
              {domaine.expertises.map((expertise) => <li key={expertise.slug}>
                <Link href={`/expertises/${expertise.slug}`} className="expertise-card">
                  <h3>{expertise.titre}</h3><p>{expertise.description}</p>
                  <span>Découvrir cette expertise <span aria-hidden="true">↗</span></span>
                </Link>
              </li>)}
            </ul>
          </section>
        ))}
        {nombre === 0 && <div className="directory-empty">
          <h2 className="font-serif text-3xl">Précisons votre recherche</h2>
          <p className="mt-3">Essayez un mot plus général, ou contactez l&apos;étude pour être orienté.</p>
          <button type="button" className="text-link mt-5" onClick={() => setRecherche("")}>Afficher toutes les expertises</button>
          <Link href="/contact" className="text-link ml-6 mt-5">Contacter l&apos;étude ↗</Link>
        </div>}
      </div>
    </>
  );
}
