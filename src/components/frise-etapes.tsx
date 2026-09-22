/**
 * Frise verticale du déroulement d'un dossier.
 *
 * Composition reprise de la « Vertical How It Works Timeline » du catalogue
 * 21st.dev (rail continu, nœuds numérotés), réécrite sans dépendance : le
 * composant d'origine tire shadcn et lucide pour un résultat que trois
 * règles CSS suffisent à produire (§12, aucune dépendance sans nécessité).
 *
 * Les textes viennent tels quels du champ `etapes` des MDX (§9) : le
 * composant ne les découpe pas en titre et détail, parce qu'un quart
 * seulement des étapes suit la forme « Intitulé : précisions » et qu'un
 * découpage deviné réécrirait la phrase validée par le notaire.
 */
export interface FriseEtapesProps {
  /** Étapes dans l'ordre chronologique, issues du frontmatter. */
  etapes: readonly string[];
}

export function FriseEtapes({ etapes }: FriseEtapesProps) {
  return (
    <ol className="frise-etapes">
      {etapes.map((etape, i) => (
        <li key={i} className="frise-etape">
          <span className="frise-noeud" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="frise-texte">
            <span className="sr-only">Étape {i + 1} sur {etapes.length} : </span>
            {etape}
          </p>
        </li>
      ))}
    </ol>
  );
}
