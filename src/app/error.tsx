"use client";

import Link from "next/link";
import { PageIntro } from "@/components/page-intro";

/**
 * Frontière d'erreur globale. Elle ne montre jamais le détail technique de
 * l'incident au visiteur — un message d'erreur peut révéler des éléments
 * d'infrastructure — et propose de reprendre là où il en était, ou de
 * joindre l'étude directement.
 */
export default function Erreur({ reset }: { reset: () => void }) {
  return (
    <main>
      <PageIntro
        titre="Une erreur est survenue"
        rubrique="Incident temporaire"
      />
      <div className="site-container page-body">
        <p className="mt-6 max-w-2xl text-slate-soft">
          La page n&apos;a pas pu être affichée. L&apos;incident est indépendant
          de votre navigation.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-block rounded-sm bg-night px-6 py-3 text-sm text-ivory transition-colors hover:bg-anthracite"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="text-sm text-night decoration-gold underline underline-offset-4 hover:text-anthracite"
          >
            Revenir à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
