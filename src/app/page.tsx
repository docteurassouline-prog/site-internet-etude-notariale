import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaRendezVous } from "@/components/cta-rdv";
import { ContactBand } from "@/components/contact-band";
import { ArticleList } from "@/components/article-list";
import { JsonLd, schemaNotary } from "@/components/json-ld";
import { FAMILLES } from "@/config/navigation";
import { etude } from "@/config/etude";
import { loadAllArticles, loadExpertise } from "@/lib/content";
import { cheminPublic } from "@/lib/chemins";

export const metadata: Metadata = {
  description:
    "Étude notariale à Paris 16ᵉ. Immobilier, successions, structuration patrimoniale, entreprise et clientèle internationale. Consultations sur rendez-vous.",
  alternates: { canonical: "/" },
};

// Les descriptions et la méthode sont reprises des textes existants.
// Le portrait remplace les vidéos d'illustration générées en ouverture.
const METHODE = [
  {
    titre: "Comprendre",
    texte:
      "Chaque dossier commence par vos objectifs. Avant toute règle de droit, l'étude identifie les intérêts en présence, les contraintes et les marges de manœuvre.",
  },
  {
    titre: "Structurer",
    texte:
      "L'opération est ensuite construite : choix des techniques juridiques, articulation civile et fiscale, calendrier. La meilleure architecture est souvent la plus simple.",
  },
  {
    titre: "Sécuriser",
    texte:
      "Les actes traduisent cette analyse. Chaque clause a une raison d'être ; les formalités et la publicité foncière sont conduites jusqu'à leur complet accomplissement.",
  },
] as const;
export default function Accueil() {
  const articles = loadAllArticles().slice(0, 3);
  const paiement = process.env.NEXT_PUBLIC_PAIEMENT_URL;
  return (
    <main>
      <JsonLd data={schemaNotary()} />
      <section className="home-hero" aria-labelledby="titre-accueil">
        <div className="site-container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow">Étude notariale · Paris XVI</p>
              <h1 id="titre-accueil">
                Le conseil notarial,
                <br />
                <em>au cœur de vos projets.</em>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-ivory/80">
                Immobilier, patrimoine, famille et entreprise. Thomas Lévy et
                son étude vous accompagnent à Paris, en France et à
                l&apos;international.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <CtaRendezVous surFondSombre />
                <Link
                  href="/expertises"
                  className="button border border-ivory/50 text-ivory hover:bg-white/10"
                >
                  Nos expertises <span aria-hidden="true">↓</span>
                </Link>
              </div>
              <p className="mt-10 text-xs tracking-wide text-ivory/65">
                Français · English · Deutsch
              </p>
            </div>
            <figure className="hero-portrait">
              <Image
                src={cheminPublic("/images/portrait.jpg")}
                alt="Maître Thomas Lévy, notaire à Paris"
                fill
                priority
                sizes="(min-width: 1024px) 540px, 100vw"
              />
              <figcaption className="hero-caption">
                <span className="block font-serif text-2xl">
                  Maître Thomas Lévy
                </span>
                <span className="mt-1 block text-xs tracking-wide text-ivory/75">
                  Notaire à Paris
                </span>
              </figcaption>
            </figure>
          </div>
          <div className="home-facts">
            <p>
              <strong>Depuis 2005</strong>Notaire
            </p>
            <p>
              <strong>18 expertises</strong>Quatre domaines d&apos;intervention
            </p>
            <p>
              <strong>Trois langues</strong>Français, anglais, allemand
            </p>
            <p>
              <strong>
                Paris 16<sup>e</sup>
              </strong>
              11 boulevard Flandrin
            </p>
          </div>
        </div>
      </section>

      <section
        className="site-container home-section"
        aria-labelledby="domaines-title"
      >
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">Nos domaines d&apos;intervention</p>
            <h2 id="domaines-title" className="section-title mt-4">
              Une vision d&apos;ensemble.
              <br />
              Un conseil adapté.
            </h2>
          </div>
          <p className="self-end text-lg text-slate-soft">
            Retrouvez les enjeux, la méthode de l&apos;étude et les étapes
            d&apos;accompagnement propres à votre projet.
          </p>
        </div>
        {FAMILLES.map((famille, index) => (
          <div className="expertise-row" key={famille.id}>
            <span className="expertise-row-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3>
                <Link href={`/expertises#${famille.id}`}>{famille.titre}</Link>
              </h3>
              <p>{famille.description}</p>
            </div>
            <div className="expertise-row-links">
              {famille.slugs.slice(0, 3).map((slug) => (
                <Link key={slug} href={`/expertises/${slug}`}>
                  {loadExpertise(slug).frontmatter.title}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
              <Link href={`/expertises#${famille.id}`} className="font-medium">
                Explorer ce domaine <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="border-y border-line bg-white">
        <div className="site-container home-section">
          <div className="grid gap-8 md:grid-cols-[1fr,1.25fr]">
            <div>
              <p className="eyebrow">L&apos;esprit de l&apos;étude</p>
              <h2 className="section-title mt-4">
                Comprendre avant
                <br />
                de rédiger.
              </h2>
              <Link href="/etude" className="text-link mt-6">
                Rencontrer l&apos;étude <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="font-serif text-2xl leading-relaxed text-night sm:text-3xl">
              Nous considérons que le rôle du notaire ne se réduit pas à la
              rédaction d&apos;actes : il consiste à comprendre une opération, à
              en anticiper les difficultés et à construire une architecture
              juridique solide.
            </p>
          </div>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {METHODE.map((etape, index) => (
              <li key={etape.titre} className="border-t border-line pt-6">
                <span className="eyebrow">0{index + 1}</span>
                <h3 className="mt-3 font-serif text-3xl">{etape.titre}</h3>
                <p className="mt-4 text-base text-slate-soft">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-container home-section">
        <div className="grid gap-10 md:grid-cols-[1fr,1fr]">
          <div>
            <p className="eyebrow">Une dimension internationale</p>
            <h2 className="section-title mt-4">
              Un point d&apos;ancrage
              <br />à Paris.
            </h2>
          </div>
          <div>
            <p className="text-lg text-slate-soft">
              Successions transfrontalières, non-résidents, expatriés,
              investisseurs étrangers et family offices. L&apos;étude reçoit en
              français, en anglais et en allemand.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-7">
              <Link href="/international" className="text-link">
                Votre projet international ↗
              </Link>
              <Link
                href="/international#english"
                lang="en"
                className="text-link"
              >
                English
              </Link>
              <Link
                href="/international#deutsch"
                lang="de"
                className="text-link"
              >
                Deutsch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="border-t border-line">
          <div className="site-container home-section">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Publications</p>
                <h2 className="section-title mt-3">
                  Les éclairages de l&apos;étude
                </h2>
              </div>
              <Link href="/blog" className="text-link">
                Toutes les publications ↗
              </Link>
            </div>
            <ArticleList articles={articles} titreNiveau={3} />
          </div>
        </section>
      )}

      <section className="site-container pb-16">
        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <div>
            <h2 className="font-serif text-2xl">Votre dossier</h2>
            <a
              href={etude.liens.dataRoom}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-3"
            >
              Espace documentaire ↗
              <span className="sr-only"> (nouvelle fenêtre)</span>
            </a>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Vos questions</h2>
            <Link href="/faq" className="text-link mt-3">
              Consulter la FAQ ↗
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Les démarches</h2>
            <Link href="/contact" className="text-link mt-3">
              Demander une copie d&apos;acte ↗
            </Link>
            {paiement && (
              <a href={paiement} className="text-link">
                Paiement en ligne ↗
              </a>
            )}
          </div>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
