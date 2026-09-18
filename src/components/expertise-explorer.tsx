"use client";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

type Domaine = { id: string; titre: string; description: string; expertises: { slug: string; titre: string }[] };

/** Panneaux présents dans le HTML initial. Flèches, Début et Fin suivent
 *  le modèle d'onglets verticaux et déplacent le focus avec la sélection. */
export function ExpertiseExplorer({ domaines }: { domaines: Domaine[] }) {
  const [actif, setActif] = useState(0);
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);
  function naviguer(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const cible = event.key === "ArrowDown" ? (index + 1) % domaines.length
      : event.key === "ArrowUp" ? (index + domaines.length - 1) % domaines.length
      : event.key === "Home" ? 0 : event.key === "End" ? domaines.length - 1 : null;
    if (cible === null) return;
    event.preventDefault(); setActif(cible); boutons.current[cible]?.focus();
  }
  return (
    <div className="expertise-explorer">
      <div role="tablist" aria-label="Domaines d'intervention" aria-orientation="vertical" className="expertise-tabs">
        {domaines.map((domaine, index) => <button key={domaine.id} ref={(node) => { boutons.current[index] = node; }} type="button" role="tab" id={`onglet-${domaine.id}`} aria-selected={actif === index} aria-controls={`panneau-${domaine.id}`} tabIndex={actif === index ? 0 : -1} onClick={() => setActif(index)} onKeyDown={(event) => naviguer(event, index)}>
          <span className="tab-number" aria-hidden="true">0{index + 1}</span><span>{domaine.titre}</span><span className="tab-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className="expertise-panels">
        <noscript><p className="p-6"><Link href="/expertises" className="underline">Consulter tous les domaines d&apos;intervention</Link></p></noscript>
        {domaines.map((domaine, index) => <div key={domaine.id} role="tabpanel" id={`panneau-${domaine.id}`} aria-labelledby={`onglet-${domaine.id}`} hidden={actif !== index} tabIndex={0} className="expertise-panel">
          <p className="eyebrow">Le conseil, dans le détail</p><h3>{domaine.titre}</h3><p className="expertise-panel-description">{domaine.description}</p>
          <ul>{domaine.expertises.map((e) => <li key={e.slug}><Link href={`/expertises/${e.slug}`}>{e.titre}<span aria-hidden="true">↗</span></Link></li>)}</ul>
          <Link href={`/expertises#${domaine.id}`} className="panel-cta">Explorer ce domaine <span aria-hidden="true">→</span></Link>
        </div>)}
      </div>
    </div>
  );
}
