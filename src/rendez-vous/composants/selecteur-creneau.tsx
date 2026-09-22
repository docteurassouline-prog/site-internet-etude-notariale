"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { FUSEAU, grouperParJour, heureLocale, jourLocal } from "../creneaux";
import type { Creneau } from "../types";

/**
 * Choix du créneau : calendrier du mois à gauche, heures du jour choisi à
 * droite.
 *
 * Remplace la liste qui empilait sept jours de boutons les uns sous les
 * autres : sur téléphone, il fallait faire défiler plusieurs écrans avant de
 * voir le jeudi. Composition reprise de l'« Appointment Picker Calendar » du
 * catalogue 21st.dev, sans ses dépendances (react-day-picker, date-fns) :
 * le module rendez-vous n'en ajoute aucune, et le calendrier n'a qu'à
 * afficher les jours que genererCreneaux() a déjà calculés.
 *
 * Accessibilité : tableau natif de boutons, avec le focus itinérant et les
 * flèches du sélecteur de date ARIA mais sans role="grid", dont le contrat
 * complet (gridcell, aria-selected) n'est pas rempli ; heures en boutons
 * radio natifs, groupés et navigables au clavier par le navigateur.
 */
export interface SelecteurCreneauProps {
  creneaux: readonly Creneau[];
  /** Début ISO du créneau retenu, ou null. */
  choisi: string | null;
  onChoisir: (debut: string) => void;
}

const JOURS_SEMAINE = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const JOURS_SEMAINE_LONGS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** « 2026-09-24 » dans le fuseau de l'étude, quel que soit celui du visiteur. */
function cleJour(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSEAU,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Par formatToParts : en français, l'heure seule se formate « 09 h », que
 *  Number() lirait NaN. */
function heureParis(iso: string): number {
  const partie = new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, hour: "numeric", hourCycle: "h23" })
    .formatToParts(new Date(iso))
    .find((p) => p.type === "hour");
  return Number(partie?.value);
}

/** Midi UTC : aucune conversion de fuseau ne peut faire changer de jour. */
function dateCivile(annee: number, mois: number, jour: number): Date {
  return new Date(Date.UTC(annee, mois, jour, 12));
}

function libelleMois(annee: number, mois: number): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    dateCivile(annee, mois, 1),
  );
}

export function SelecteurCreneau({ creneaux, choisi, onChoisir }: SelecteurCreneauProps) {
  const parJour = useMemo(() => {
    const table = new Map<string, readonly Creneau[]>();
    for (const { jour, creneaux: liste } of grouperParJour(creneaux)) table.set(jour, liste);
    return table;
  }, [creneaux]);
  const joursDisponibles = useMemo(() => [...parJour.keys()], [parJour]);

  const [jourChoisi, setJourChoisi] = useState<string | null>(() =>
    choisi ? cleJour(new Date(choisi)) : joursDisponibles[0] ?? null,
  );
  const [focusJour, setFocusJour] = useState<string | null>(jourChoisi);
  const [moisAffiche, setMoisAffiche] = useState(() => {
    const [a, m] = (jourChoisi ?? cleJour(new Date())).split("-").map(Number);
    return { annee: a, mois: m - 1 };
  });
  const cellules = useRef(new Map<string, HTMLButtonElement>());
  const doitFocaliser = useRef(false);

  // Les créneaux dépendent de l'interlocuteur : s'il change, le jour retenu
  // peut ne plus rien proposer.
  useEffect(() => {
    if (jourChoisi && !parJour.has(jourChoisi)) setJourChoisi(joursDisponibles[0] ?? null);
  }, [parJour, joursDisponibles, jourChoisi]);

  useEffect(() => {
    if (doitFocaliser.current && focusJour) {
      cellules.current.get(focusJour)?.focus();
      doitFocaliser.current = false;
    }
  }, [focusJour, moisAffiche]);

  const aujourdhui = cleJour(new Date());
  const premier = joursDisponibles[0];
  const dernier = joursDisponibles[joursDisponibles.length - 1];
  const moisMin = premier ? premier.slice(0, 7) : null;
  const moisMax = dernier ? dernier.slice(0, 7) : null;
  const cleMois = `${moisAffiche.annee}-${String(moisAffiche.mois + 1).padStart(2, "0")}`;

  const semaines = useMemo(() => {
    const { annee, mois } = moisAffiche;
    const nbJours = new Date(Date.UTC(annee, mois + 1, 0)).getUTCDate();
    const decalage = (dateCivile(annee, mois, 1).getUTCDay() + 6) % 7;
    const cases: (string | null)[] = Array(decalage).fill(null);
    for (let j = 1; j <= nbJours; j++) {
      cases.push(`${annee}-${String(mois + 1).padStart(2, "0")}-${String(j).padStart(2, "0")}`);
    }
    while (cases.length % 7) cases.push(null);
    const lignes: (string | null)[][] = [];
    for (let i = 0; i < cases.length; i += 7) lignes.push(cases.slice(i, i + 7));
    return lignes;
  }, [moisAffiche]);

  const joursDuMois = semaines.flat().filter((j): j is string => j !== null);
  const jourFocalisable =
    focusJour && joursDuMois.includes(focusJour)
      ? focusJour
      : joursDuMois.find((j) => parJour.has(j)) ?? joursDuMois[0];

  function changerMois(pas: number) {
    const d = new Date(Date.UTC(moisAffiche.annee, moisAffiche.mois + pas, 1));
    setMoisAffiche({ annee: d.getUTCFullYear(), mois: d.getUTCMonth() });
  }

  function choisirJour(jour: string) {
    if (!parJour.has(jour)) return;
    setJourChoisi(jour);
    setFocusJour(jour);
  }

  function naviguer(event: KeyboardEvent<HTMLButtonElement>, jour: string) {
    const [a, m, j] = jour.split("-").map(Number);
    const colonne = (dateCivile(a, m - 1, j).getUTCDay() + 6) % 7;
    const ecarts: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -colonne,
      End: 6 - colonne,
    };
    if (event.key in ecarts) {
      event.preventDefault();
      // Les flèches franchissent la fin du mois, comme dans le modèle ARIA,
      // mais jamais au-delà des mois qui portent des créneaux.
      const cible = dateCivile(a, m - 1, j + ecarts[event.key]);
      const cle = cible.toISOString().slice(0, 10);
      const mois = cle.slice(0, 7);
      if ((moisMin && mois < moisMin) || (moisMax && mois > moisMax)) return;
      if (mois !== cleMois) setMoisAffiche({ annee: cible.getUTCFullYear(), mois: cible.getUTCMonth() });
      doitFocaliser.current = true;
      setFocusJour(cle);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choisirJour(jour);
    }
  }

  if (joursDisponibles.length === 0) return null;

  const creneauxDuJour = jourChoisi ? parJour.get(jourChoisi) ?? [] : [];
  const periodes = [
    { titre: "Matin", liste: creneauxDuJour.filter((c) => heureParis(c.debut) < 13) },
    { titre: "Après-midi", liste: creneauxDuJour.filter((c) => heureParis(c.debut) >= 13) },
  ].filter((p) => p.liste.length > 0);

  return (
    <div className="mt-6 grid gap-8 rounded-sm border border-line bg-paper p-5 sm:p-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 id="titre-mois" className="font-serif text-xl text-night first-letter:uppercase" aria-live="polite">
            {libelleMois(moisAffiche.annee, moisAffiche.mois)}
          </h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => changerMois(-1)}
              disabled={!moisMin || cleMois <= moisMin}
              aria-label="Mois précédent"
              className="h-11 w-11 rounded-sm border border-line text-night transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={() => changerMois(1)}
              disabled={!moisMax || cleMois >= moisMax}
              aria-label="Mois suivant"
              className="h-11 w-11 rounded-sm border border-line text-night transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
        <table aria-labelledby="titre-mois" className="mt-4 w-full table-fixed border-collapse text-center">
          <thead>
            <tr>
              {JOURS_SEMAINE.map((j, i) => (
                <th key={j} scope="col" abbr={JOURS_SEMAINE_LONGS[i]} className="pb-2 text-xs font-normal uppercase tracking-[0.12em] text-slate-soft">
                  {j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semaines.map((semaine, s) => (
              <tr key={s}>
                {semaine.map((jour, c) => {
                  if (!jour) return <td key={c} />;
                  const disponible = parJour.has(jour);
                  const selectionne = jour === jourChoisi;
                  const nombre = parJour.get(jour)?.length ?? 0;
                  return (
                    <td key={jour} className="p-0.5">
                      <button
                        ref={(el) => {
                          if (el) cellules.current.set(jour, el);
                          else cellules.current.delete(jour);
                        }}
                        type="button"
                        tabIndex={jour === jourFocalisable ? 0 : -1}
                        aria-disabled={!disponible}
                        aria-pressed={selectionne}
                        aria-label={`${jourLocal(`${jour}T12:00:00Z`)}${disponible ? `, ${nombre} créneau${nombre > 1 ? "x" : ""}` : ", indisponible"}`}
                        onClick={() => choisirJour(jour)}
                        onKeyDown={(e) => naviguer(e, jour)}
                        onFocus={() => setFocusJour(jour)}
                        className={[
                          "relative flex aspect-square w-full items-center justify-center rounded-sm text-sm transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
                          selectionne
                            ? "bg-night text-ivory"
                            : disponible
                              ? "text-night hover:bg-ivory"
                              : "cursor-not-allowed text-slate-soft/50",
                        ].join(" ")}
                      >
                        {Number(jour.slice(8))}
                        {disponible && !selectionne ? (
                          <span aria-hidden="true" className="absolute bottom-1.5 h-1 w-1 rounded-full bg-gold" />
                        ) : null}
                        {jour === aujourdhui ? (
                          <span aria-hidden="true" className="absolute inset-1 rounded-sm border border-line" />
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-soft">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" /> Jour avec des créneaux disponibles
        </p>
      </div>

      <fieldset className="min-w-0 md:border-l md:border-line md:pl-10">
        <legend className="font-serif text-xl text-night first-letter:uppercase">
          {jourChoisi ? jourLocal(`${jourChoisi}T12:00:00Z`) : "Choisissez un jour"}
        </legend>
        <div className="mt-4 max-h-80 space-y-5 overflow-y-auto pr-1">
          {periodes.map(({ titre, liste }) => (
            <div key={titre}>
              <p className="text-xs uppercase tracking-[0.16em] text-gold-ink">{titre}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {liste.map((creneau) => {
                  const actif = choisi === creneau.debut;
                  return (
                    <label
                      key={creneau.debut}
                      className={[
                        "flex min-h-11 cursor-pointer items-center justify-center rounded-sm border px-3 text-sm transition-colors",
                        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-1",
                        actif ? "border-night bg-night text-ivory" : "border-line bg-paper text-anthracite hover:border-gold",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="creneau"
                        value={creneau.debut}
                        checked={actif}
                        onChange={() => onChoisir(creneau.debut)}
                        className="sr-only"
                      />
                      {heureLocale(creneau.debut)}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      {/* Le jour affiché n'est pas toujours celui du créneau retenu : le
          visiteur qui compare deux jours doit savoir lequel « Continuer »
          enverra. */}
      <p role="status" className="border-t border-line pt-4 text-sm text-slate-soft md:col-span-2">
        {choisi ? (
          <>
            Créneau retenu :{" "}
            <strong className="font-medium text-night">
              {jourLocal(choisi)} à {heureLocale(choisi)}
            </strong>
          </>
        ) : (
          "Aucun créneau retenu pour l'instant."
        )}
      </p>
    </div>
  );
}
