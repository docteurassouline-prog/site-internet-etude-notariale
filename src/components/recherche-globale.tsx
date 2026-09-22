"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { EntreeRecherche } from "@/lib/recherche";

/**
 * Recherche sur tout le site, ouverte par le bouton de l'en-tête ou par
 * ⌘K / Ctrl+K.
 *
 * Inspirée de la « Command Palette » du catalogue 21st.dev, sans en reprendre
 * la dépendance `cmdk` : l'index tient en quelques dizaines d'entrées, un
 * filtre local suffit (§12). Le dialogue natif est celui du menu mobile, pour
 * le même motif : piège du focus, Échap et fond inerte sans code maison.
 * Motif ARIA « combobox » : le focus reste dans le champ, la sélection se
 * déplace par aria-activedescendant.
 */
export interface RechercheGlobaleProps {
  /** Index construit au rendu serveur par construireIndexRecherche(). */
  index: EntreeRecherche[];
}

const MAX_RESULTATS = 8;

function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Les accordéons de la FAQ sont des <details> fermés : une ancre seule
 *  mènerait à une question repliée. On attend que la page cible soit rendue,
 *  puis on la déplie. */
function deplierAncre(id: string) {
  const debut = performance.now();
  const essayer = () => {
    const cible = document.getElementById(id);
    if (cible instanceof HTMLDetailsElement) {
      cible.open = true;
      cible.scrollIntoView({ block: "start" });
      cible.querySelector("summary")?.focus();
    } else if (performance.now() - debut < 3000) {
      requestAnimationFrame(essayer);
    }
  };
  requestAnimationFrame(essayer);
}

export function RechercheGlobale({ index }: RechercheGlobaleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogue = useRef<HTMLDialogElement>(null);
  const champ = useRef<HTMLInputElement>(null);
  const [requete, setRequete] = useState("");
  const [actif, setActif] = useState(0);
  // Rendu serveur en « ⌘K », corrigé après montage : la plateforme n'est
  // connue que du navigateur.
  const [raccourciAffiche, setRaccourciAffiche] = useState("⌘K");
  const idListe = useId();

  const indexNormalise = useMemo(
    () =>
      index.map((entree) => ({
        entree,
        titre: normaliser(entree.titre),
        texte: normaliser(`${entree.titre} ${entree.extrait} ${entree.corpus}`),
      })),
    [index],
  );

  const resultats = useMemo(() => {
    const termes = normaliser(requete).split(/\s+/).filter(Boolean);
    if (termes.length === 0) {
      return index.filter((e) => e.type === "Page");
    }
    return indexNormalise
      .filter(({ texte }) => termes.every((t) => texte.includes(t)))
      .map((item) => ({
        entree: item.entree,
        score: termes.reduce((s, t) => s + (item.titre.includes(t) ? 3 : 1), 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTATS)
      .map((r) => r.entree);
  }, [requete, index, indexNormalise]);

  const ouvrir = useCallback(() => {
    setRequete("");
    setActif(0);
    dialogue.current?.showModal();
    champ.current?.focus();
  }, []);

  function aller(entree: EntreeRecherche) {
    dialogue.current?.close();
    const [chemin, ancre] = entree.href.split("#");
    if (chemin === pathname && ancre) {
      history.replaceState(null, "", entree.href);
    } else {
      router.push(entree.href);
    }
    if (ancre) deplierAncre(ancre);
  }

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setRaccourciAffiche("Ctrl K");
    function raccourci(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogue.current?.open) dialogue.current.close();
        else ouvrir();
      }
    }
    document.addEventListener("keydown", raccourci);
    return () => document.removeEventListener("keydown", raccourci);
  }, [ouvrir]);

  // Arrivée directe sur /faq#faq-2-3 depuis un lien extérieur.
  useEffect(() => {
    const ancre = window.location.hash.slice(1);
    if (ancre.startsWith("faq-")) deplierAncre(ancre);
  }, [pathname]);

  function naviguer(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (resultats.length === 0) return;
      const pas = event.key === "ArrowDown" ? 1 : -1;
      setActif((i) => (i + pas + resultats.length) % resultats.length);
    } else if (event.key === "Enter" && resultats[actif]) {
      event.preventDefault();
      aller(resultats[actif]);
    }
  }

  const idOption = (i: number) => `${idListe}-option-${i}`;

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        aria-haspopup="dialog"
        onClick={ouvrir}
      >
        <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="8.5" cy="8.5" r="6" />
          <path d="m13 13 5 5" strokeLinecap="round" />
        </svg>
        <span className="search-trigger-label">Rechercher</span>
        <kbd className="search-trigger-kbd" aria-hidden="true">{raccourciAffiche}</kbd>
      </button>
      <dialog
        ref={dialogue}
        className="search-dialog"
        aria-label="Rechercher sur le site"
        onClick={(event) => {
          if (event.target === dialogue.current) dialogue.current.close();
        }}
      >
        <div className="search-field">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="8.5" cy="8.5" r="6" />
            <path d="m13 13 5 5" strokeLinecap="round" />
          </svg>
          <input
            ref={champ}
            type="search"
            role="combobox"
            aria-label="Rechercher une expertise, une publication ou une question"
            aria-expanded={resultats.length > 0}
            aria-controls={idListe}
            aria-activedescendant={resultats[actif] ? idOption(actif) : undefined}
            aria-autocomplete="list"
            placeholder="Succession, VEFA, frais d'acquisition…"
            autoComplete="off"
            spellCheck={false}
            value={requete}
            onChange={(event) => {
              setRequete(event.target.value);
              setActif(0);
            }}
            onKeyDown={naviguer}
          />
          <button type="button" className="search-close" onClick={() => dialogue.current?.close()}>
            Fermer
          </button>
        </div>
        <p className="search-heading eyebrow" aria-hidden="true">
          {requete.trim() ? "Résultats" : "Accès rapides"}
        </p>
        <ul id={idListe} role="listbox" aria-label="Résultats" className="search-results">
          {resultats.map((entree, i) => (
            <li
              key={entree.href}
              id={idOption(i)}
              role="option"
              aria-selected={i === actif}
              className="search-result"
              onMouseMove={() => setActif(i)}
              onClick={() => aller(entree)}
            >
              <span className="search-result-type">{entree.type}</span>
              <span className="search-result-title">{entree.titre}</span>
              <span className="search-result-excerpt">{entree.extrait}</span>
            </li>
          ))}
        </ul>
        {resultats.length === 0 && (
          <p className="search-empty" role="status">
            Aucun résultat pour « {requete.trim()} ». L&apos;étude peut vous
            répondre directement :{" "}
            <Link href="/contact" onClick={() => dialogue.current?.close()}>
              nous contacter
            </Link>
            .
          </p>
        )}
        <p className="search-hint" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> parcourir</span>
          <span><kbd>↵</kbd> ouvrir</span>
          <span><kbd>Échap</kbd> fermer</span>
        </p>
      </dialog>
    </>
  );
}
