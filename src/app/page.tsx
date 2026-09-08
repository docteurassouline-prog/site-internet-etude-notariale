import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaRendezVous } from "@/components/cta-rdv";
import { HeroVideo } from "@/components/hero-video";
import { JsonLd, schemaNotary } from "@/components/json-ld";
import { LienCapitale } from "@/components/lien-capitale";
import { etude } from "@/config/etude";
import { cheminPublic } from "@/lib/chemins";
import {
  CATEGORIE_LABELS,
  EXPERTISE_SLUGS,
  loadAllArticles,
  loadExpertise,
  type Categorie,
  type ExpertiseSlug,
} from "@/lib/content";

export const metadata: Metadata = {
  description:
    "Étude notariale à Paris 16ᵉ. Immobilier, successions, structuration patrimoniale, entreprise et clientèle internationale. Consultations sur rendez-vous.",
  alternates: { canonical: "/" },
};

/**
 * Refonte du 3 septembre 2026 — décision du notaire, après la levée des
 * gabarits imposés. Deux références ont été données, et sont transposées
 * ici sans rien en copier :
 *  - l'écriture d'un site de banque privée pour la composition : héros
 *    plein écran à texte centré, repères chiffrés en grande serif, renvois
 *    en petites capitales espacées (LienCapitale), sections aérées ;
 *  - la structure d'un site d'étude notariale de place pour deux blocs qui
 *    manquaient au nôtre : les pôles d'expertise présentés comme de grandes
 *    entrées éditoriales avant la grille, et un bloc « démarches à
 *    distance » qui rassemble les services accessibles sans rendez-vous.
 * Le fond éditorial — les phrases, les engagements, la méthode — est
 * inchangé : validé, il ne se réécrit pas au gré d'une refonte visuelle.
 */

/**
 * Pôles d'expertise : les quatre familles de /expertises et du blog, avec
 * trois portes d'entrée chacune. Une ligne descriptive dit ce que l'étude
 * fait, jamais ce qu'elle vaut (§3).
 */
const POLES: readonly {
  categorie: Categorie;
  texte: string;
  slugs: readonly [ExpertiseSlug, ExpertiseSlug, ExpertiseSlug];
}[] = [
  {
    categorie: "immobilier",
    texte:
      "Acquisitions et ventes, VEFA, promotion, marchands de biens, fiscalité immobilière : du logement à l'opération d'ensemble.",
    slugs: ["immobilier-residentiel", "vefa", "promotion-immobiliere"],
  },
  {
    categorie: "patrimoine-famille",
    texte:
      "Successions, donations, partages, séparations et structuration patrimoniale, pensés dans la durée d'une famille.",
    slugs: ["successions", "donations", "structuration-patrimoniale"],
  },
  {
    categorie: "entreprise",
    texte:
      "Transmission d'entreprise, baux commerciaux, sociétés civiles : l'immobilier et le patrimoine du dirigeant, en coordination avec ses conseils.",
    slugs: ["transmission-entreprise", "baux-commerciaux", "sci"],
  },
  {
    categorie: "international",
    texte: `Successions transfrontalières, non-résidents, expatriés, investisseurs étrangers et family offices — en ${etude.langues.join(", ")}.`,
    slugs: ["successions-internationales", "investisseurs-etrangers", "family-office"],
  },
];

/**
 * Sélection de 8 expertises pour la grille. Tuple figé : il sert de clé au
 * type de ACCROCHES_ACCUEIL, ce qui rend une accroche manquante détectable
 * à la compilation plutôt qu'à l'affichage.
 */
const EXPERTISES_ACCUEIL = [
  "immobilier-residentiel",
  "vefa",
  "promotion-immobiliere",
  "sci",
  "successions-internationales",
  "structuration-patrimoniale",
  "transmission-entreprise",
  "family-office",
] as const satisfies readonly ExpertiseSlug[];

/**
 * Accroche par expertise : une phrase descriptive de quinze mots au plus.
 * Elle dit ce que l'étude fait, jamais ce qu'elle vaut — la compétence se
 * montre par la précision technique (§3).
 */
const ACCROCHES_ACCUEIL: Record<(typeof EXPERTISES_ACCUEIL)[number], string> = {
  "immobilier-residentiel":
    "Chaque acquisition vérifiée sous tous ses angles avant la signature.",
  vefa: "Du contrat de réservation à la livraison, un acte sécurisé à chaque étape.",
  "promotion-immobiliere":
    "Montage, commercialisation et livraison coordonnés avec le promoteur.",
  sci: "La structure, la fiscalité et la transmission anticipées dès la constitution.",
  "successions-internationales":
    "Plusieurs juridictions, un seul interlocuteur pour coordonner l'ensemble.",
  "structuration-patrimoniale":
    "L'architecture civile et fiscale conçue pour durer au-delà d'une opération.",
  "transmission-entreprise":
    "Cession, donation, pacte Dutreil : chaque levier articulé dans un calendrier.",
  "family-office":
    "Un notaire intégré à l'équipe de conseil patrimonial du client.",
};

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

/**
 * Engagements : formulations descriptives — ce que l'étude fait — et non
 * performatives. « Les coûts sont détaillés », jamais « nous garantissons » (§3).
 */
const ENGAGEMENTS: readonly {
  titre: string;
  texte: string;
  lien?: { href: string; label: string };
}[] = [
  {
    titre: "Transparence",
    texte:
      "Les coûts d'une opération — émoluments, taxes, débours, honoraires — sont détaillés avant tout engagement. Aucune surprise à la signature.",
    lien: { href: "/tarif", label: "Comprendre le tarif notarial" },
  },
  {
    titre: "Réactivité",
    texte:
      "Un interlocuteur identifié, un calendrier établi dès l'ouverture du dossier, des points d'étape sans avoir à les demander.",
  },
  {
    titre: "Rigueur",
    texte:
      "Chaque dossier fait l'objet d'une revue civile, fiscale et foncière systématique avant toute signature.",
  },
  {
    titre: "Confidentialité",
    texte:
      "Le secret professionnel est absolu. Aucune information relative à un dossier ne circule sans l'accord exprès du client.",
  },
];

/**
 * Paiement en ligne — interrupteur du §12. Tant qu'aucun prestataire n'est
 * retenu et qu'aucun circuit d'encaissement n'est validé par le comptable
 * taxateur (arbitrage n° 3 du §13), la variable reste vide et l'entrée
 * n'existe pas. Le périmètre est fixé par le §13 : sommes dues à l'étude
 * au titre de sa rémunération et de ses remboursements, rien d'autre.
 */
const PAIEMENT_URL = process.env.NEXT_PUBLIC_PAIEMENT_URL;

/**
 * Démarches accessibles sans rendez-vous. Structure reprise d'un site
 * d'étude de place (« gérez vos démarches à distance ») ; les textes
 * décrivent un service, jamais une promesse. La copie d'acte passe par le
 * formulaire de contact : aucun envoi de pièce ne transite par le site.
 */
const DEMARCHES: readonly {
  titre: string;
  texte: string;
  action: string;
  href: string;
  externe?: boolean;
}[] = [
  {
    titre: "Espace documentaire sécurisé",
    texte:
      "Le dépôt et l'échange de pièces avec l'étude passent par l'espace sécurisé d'un prestataire externe, jamais par ce site.",
    action: "Accéder à l'espace documentaire",
    href: etude.liens.dataRoom,
    externe: true,
  },
  {
    titre: "Tarif",
    texte:
      "Émoluments réglementés, débours, droits et taxes, honoraires libres : de quoi se compose le coût d'une opération.",
    action: "Consulter le tarif",
    href: "/tarif",
  },
  {
    titre: "Copie d'acte",
    texte:
      "La demande de copie d'un acte reçu par l'étude se fait par le formulaire de contact, en indiquant l'acte concerné.",
    action: "Faire une demande",
    href: "/contact",
  },
  ...(PAIEMENT_URL
    ? [
        {
          titre: "Paiement en ligne",
          texte:
            "Règlement des sommes dues à l'étude au titre de ses émoluments, honoraires et débours.",
          action: "Procéder au paiement",
          href: PAIEMENT_URL,
          externe: true,
        },
      ]
    : []),
];

/**
 * Repères — la preuve arrive tôt, juste après le héros. Transposition d'une
 * mécanique observée sur les sites de banque d'affaires et d'étude : le
 * visiteur obtient une réponse à « pourquoi est-ce crédible » avant
 * d'entrer dans le catalogue des expertises.
 *
 * Aucun chiffre n'est produit pour l'occasion. Les quatre reprennent des
 * faits déjà publiés ou dérivés du code :
 *   — l'année de nomination figure sur /etude (« arrêté du 27 décembre 2005 ») ;
 *   — le nombre de domaines est dérivé de EXPERTISE_SLUGS, il ne peut donc
 *     pas diverger de l'arborescence réelle ;
 *   — les langues viennent de etude.ts, source unique du NAP ;
 *   — l'implantation vient de la même source.
 * Formulations descriptives, sans comparaison ni superlatif (§3).
 */
const REPERES: readonly { valeur: string; libelle: string }[] = [
  { valeur: "2005", libelle: "Notaire depuis" },
  {
    valeur: String(EXPERTISE_SLUGS.length),
    libelle: "Domaines d'intervention",
  },
  {
    valeur: String(etude.langues.length),
    libelle: "Langues de travail",
  },
  { valeur: "Paris 16ᵉ", libelle: "Implantation" },
];

/**
 * Ouverture de section — filet doré puis intitulé en petites capitales.
 *
 * Unification du 7 septembre 2026 : c'est le seul motif d'ouverture de
 * l'accueil, identique dans les onze sections. Le filet manquait alors que
 * le nom du composant l'annonçait ; il est ici rendu, à la même longueur et
 * au même écart partout. L'intitulé passe de 0,72 à 0,78 rem et gagne une
 * graisse moyenne : à 11,5 px en capitales espacées, il n'était pas lu.
 */
function Intitule({
  children,
  surFondSombre = false,
}: {
  children: string;
  surFondSombre?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className={`h-px w-8 ${surFondSombre ? "bg-gold" : "bg-gold-ink/70"}`}
      />
      <p
        className={`text-[0.78rem] font-medium uppercase tracking-[0.24em] ${
          surFondSombre ? "text-gold" : "text-gold-ink"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

/**
 * Échelle typographique de l'accueil — une seule, appliquée partout.
 *
 * Le reproche du 7 septembre 2026 — « trop fade, pas assez lisible » — tenait
 * moins aux couleurs qu'aux tailles : le corps des blocs était à 0,875 rem en
 * slate-soft, soit du texte secondaire employé comme texte principal. Les
 * descriptions repassent en anthracite à 1 rem ; slate-soft est désormais
 * réservé à ce qui est réellement secondaire (dates, légendes).
 */
const TITRE_SECTION =
  "font-serif font-normal leading-[1.12] tracking-tight";
const TAILLE_TITRE_SECTION = "clamp(2.05rem, 3.4vw, 3rem)";
/** Titre de bloc à l'intérieur d'une section (h3). */
const TITRE_BLOC = "font-serif text-[1.55rem] leading-snug";
/** Corps d'un bloc, fond clair. */
const CORPS_BLOC = "text-[1rem] leading-[1.7] text-anthracite";
/** Corps d'un bloc, fond nuit. */
const CORPS_BLOC_SOMBRE = "text-[1rem] leading-[1.7] text-ivory/80";
/** Chapeau de section, sous le titre. */
const CHAPEAU = "text-[1.075rem] leading-relaxed";
/** Rythme vertical commun à toutes les sections. */
const RYTHME = "px-6 py-24 lg:py-32";

export default function Accueil() {
  const poles = POLES.map((pole) => ({
    ...pole,
    expertises: pole.slugs.map((slug) => ({
      slug,
      titre: loadExpertise(slug).frontmatter.title,
    })),
  }));
  const expertises = EXPERTISES_ACCUEIL.map((slug) => ({
    slug,
    frontmatter: loadExpertise(slug).frontmatter,
  }));
  const derniersArticles = loadAllArticles().slice(0, 3);

  return (
    <main>
      <JsonLd data={schemaNotary()} />

      {/* Héros plein écran, texte centré. La photographie de la salle de
          réunion est rendue d'abord ; les deux séquences vidéo s'y fondent
          ensuite (voir hero-video.tsx pour ce qu'elles sont et quand elles
          ne sont pas chargées). Le voile night est plus dense qu'avant :
          le texte est centré sur l'image et non plus calé dans un angle
          sombre, il doit rester lisible sur n'importe quel plan. */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-night">
        <HeroVideo />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(16,28,44,0.55) 0%, rgba(16,28,44,0.42) 45%, rgba(16,28,44,0.78) 100%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-grid flex-col items-center px-6 pb-24 pt-32 text-center">
          {/* Ivoire et non or : centré sur l'image, le surtitre passe sur le
              ciel clair du plan aérien, où l'or ne tient pas le contraste. */}
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-ivory/90">
            Étude notariale — Paris 16ᵉ
          </p>
          <div aria-hidden="true" className="mt-7 h-px w-12 bg-gold" />
          <h1
            className="mt-9 max-w-4xl text-balance font-serif font-normal leading-[1.08] tracking-tight text-ivory"
            style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)" }}
          >
            Le conseil notarial pour les opérations immobilières et
            patrimoniales complexes
          </h1>
          <p className="mt-8 max-w-xl text-[1.15rem] leading-relaxed text-ivory/90">
            À Paris et à l&apos;international, l&apos;étude accompagne
            particuliers, investisseurs, entreprises et family offices.
          </p>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <CtaRendezVous surFondSombre />
            <Link
              href="/expertises"
              className="inline-block rounded-sm border border-ivory/80 px-8 py-4 text-[0.84rem] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-ivory hover:text-night"
            >
              Nos expertises
            </Link>
          </div>
        </div>
      </section>

      {/* Repères — bande sombre, valeurs en grande serif, libellés en
          capitales dorées : les chiffres se lisent de loin, comme sur les
          sites de gestion privée dont la composition s'inspire. */}
      <section className="bg-night text-ivory">
        <div className="mx-auto w-full max-w-grid px-6 py-16 lg:py-20">
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {REPERES.map((repere) => (
              <div
                key={repere.libelle}
                className="border-l border-gold/40 pl-6"
              >
                <dd className="font-serif text-5xl font-normal leading-none tracking-tight text-ivory lg:text-6xl">
                  {repere.valeur}
                </dd>
                <dt className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.24em] text-gold">
                  {repere.libelle}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Le notaire : visage, nom et vision du métier à la première
          personne — un officier public identifié plutôt qu'anonyme. */}
      <section className="bg-ivory">
        <div className={`mx-auto grid w-full max-w-grid gap-14 lg:grid-cols-[3fr,2fr] ${RYTHME}`}>
          <div className="flex flex-col justify-center">
            <Intitule>Nous connaître</Intitule>
            <h2
              className={`mt-6 text-night ${TITRE_SECTION}`}
              style={{ fontSize: TAILLE_TITRE_SECTION }}
            >
              {etude.denominationComplete}
            </h2>
            {/* Présentation ramassée en une seule phrase (8 septembre 2026,
                décision du notaire) : les trois paragraphes et le bloc au
                filet doré disaient la même chose trois fois et diluaient
                l'accroche. Rien n'est écrit de neuf — la phrase est la
                condensation des formulations déjà validées, et conserve les
                termes sur lesquels la page est référencée : notaire à
                Paris 16, droit immobilier, SCI, successions internationales,
                donations, transmission d'entreprise, family offices. */}
            <p className="mt-8 max-w-prose text-[1.2rem] leading-[1.65] text-anthracite">
              Notaire à Paris 16, l&apos;étude construit l&apos;architecture
              juridique des opérations immobilières et patrimoniales :
              acquisitions complexes, montages en SCI, successions
              internationales, donations et transmissions d&apos;entreprise,
              pour une clientèle privée, des investisseurs et des family
              offices.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <CtaRendezVous />
              <LienCapitale href="/etude">En savoir plus sur l&rsquo;étude</LienCapitale>
            </div>
          </div>
          {/* Portrait en arche, bords fondus (8 septembre 2026). Le cadre
              rectangulaire net posait une vignette d'identité au milieu d'une
              page composée en aplats ; l'arche et le fondu radial le font
              naître du fond ivoire, comme une photographie encadrée par une
              menuiserie haussmannienne. Le masque est doublé du préfixe
              -webkit- : Safari ne lit pas encore mask-image sans lui.
              La légende d'adresse qui vivait ici est remontée dans
              l'en-tête, sous le nom de l'étude — elle y est visible sur
              toutes les pages plutôt que sur ce seul bloc. */}
          <div className="flex flex-col items-center lg:items-end">
            <div
              className="w-full max-w-sm overflow-hidden rounded-t-[12rem]"
              style={{
                WebkitMaskImage:
                  "radial-gradient(118% 94% at 50% 6%, #000 52%, rgba(0,0,0,0.55) 79%, transparent 100%)",
                maskImage:
                  "radial-gradient(118% 94% at 50% 6%, #000 52%, rgba(0,0,0,0.55) 79%, transparent 100%)",
              }}
            >
              <Image
                src={cheminPublic("/images/portrait.jpg")}
                alt={`${etude.nomNotaire}, notaire à Paris`}
                width={480}
                height={721}
                sizes="(min-width: 1024px) 24rem, 100vw"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pôles — quatre grandes entrées éditoriales avant la grille : le
          visiteur se situe d'abord dans une famille, puis dans une
          expertise. Le titre de chaque pôle est un lien vers l'index, les
          trois expertises en dessous ouvrent directement leur page. */}
      <section className="bg-paper">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule>Notre pratique</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-night ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            Quatre pôles, une même exigence de conseil
          </h2>
          <ul className="mt-14 grid gap-px border-t border-line md:grid-cols-2 lg:grid-cols-4 lg:border-t-0">
            {poles.map((pole) => (
              <li
                key={pole.categorie}
                className="border-b border-line py-10 lg:border-b-0 lg:border-t lg:pr-8"
              >
                <h3 className={`text-night ${TITRE_BLOC}`}>
                  <Link
                    href="/expertises"
                    className="no-underline hover:text-anthracite"
                  >
                    {CATEGORIE_LABELS[pole.categorie]}
                  </Link>
                </h3>
                <p className={`mt-4 ${CORPS_BLOC}`}>{pole.texte}</p>
                <ul className="mt-6 space-y-2.5">
                  {pole.expertises.map((expertise) => (
                    <li key={expertise.slug}>
                      <Link
                        href={`/expertises/${expertise.slug}`}
                        className="text-[0.975rem] text-night underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-ink"
                      >
                        {expertise.titre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <LienCapitale href="/expertises">Toutes nos expertises</LienCapitale>
          </div>
        </div>
      </section>

      {/* Grille de huit expertises — chaque entrée porte une accroche
          descriptive : une liste de titres nus ne dit rien de la pratique. */}
      <section className="bg-ivory">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule>Domaines d&rsquo;intervention</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-night ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            Ce que recouvre chaque domaine
          </h2>
          <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {expertises.map(({ slug, frontmatter }) => (
              <li key={slug} className="bg-ivory">
                <Link
                  href={`/expertises/${slug}`}
                  className="group block h-full border-t-2 border-transparent px-6 py-9 no-underline transition-colors hover:border-gold hover:bg-paper"
                >
                  <span className={`block text-night ${TITRE_BLOC}`}>
                    {frontmatter.title}
                  </span>
                  <span className={`mt-3 block ${CORPS_BLOC}`}>
                    {ACCROCHES_ACCUEIL[slug]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Méthode — « de l'analyse à la signature » : l'étude est présente à
          chaque étape, ce qu'un site d'étude de place dit en une phrase et
          que nos trois temps détaillent. Le chapeau désamorce l'inconnu :
          le premier rendez-vous n'engage à rien. */}
      <section className="bg-night text-ivory">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule surFondSombre>Notre méthode</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-ivory ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            De l&rsquo;analyse à la signature
          </h2>
          <p className={`mt-6 max-w-2xl text-ivory/85 ${CHAPEAU}`}>
            Le premier rendez-vous permet de poser le cadre : vos objectifs, les
            contraintes de l&apos;opération, le calendrier souhaité. Il
            n&apos;engage à rien. La suite du dossier suit trois temps, et
            l&apos;étude est présente à chacun d&apos;eux, jusqu&apos;aux
            formalités qui suivent la signature.
          </p>
          <ol className="mt-14 grid gap-12 md:grid-cols-3">
            {METHODE.map((etape, index) => (
              <li key={etape.titre} className="border-t border-gold/60 pt-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-3xl leading-none text-gold"
                >
                  {`0${index + 1}`}
                </span>
                <h3 className={`mt-4 text-ivory ${TITRE_BLOC}`}>
                  {etape.titre}
                </h3>
                <p className={`mt-3 ${CORPS_BLOC_SOMBRE}`}>{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Démarches à distance — ce qui se fait sans rendez-vous. */}
      <section className="bg-paper">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule>Services en ligne</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-night ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            Vos démarches à distance
          </h2>
          <ul className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
            {DEMARCHES.map((demarche) => (
              <li
                key={demarche.titre}
                className="flex flex-col border-t-2 border-transparent bg-paper px-8 py-10 transition-colors hover:border-gold"
              >
                <h3 className={`text-night ${TITRE_BLOC}`}>{demarche.titre}</h3>
                <p className={`mt-4 flex-1 ${CORPS_BLOC}`}>{demarche.texte}</p>
                <div className="mt-8">
                  <LienCapitale href={demarche.href} externe={demarche.externe}>
                    {demarche.action}
                  </LienCapitale>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engagements — quatre énoncés au présent descriptif. */}
      <section className="bg-ivory">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule>Nos engagements</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-night ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            Quatre engagements de fonctionnement
          </h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {ENGAGEMENTS.map((engagement) => (
              <div key={engagement.titre} className="border-t-2 border-gold/50 pt-6">
                <h3 className={`text-night ${TITRE_BLOC}`}>
                  {engagement.titre}
                </h3>
                <p className={`mt-3 ${CORPS_BLOC}`}>{engagement.texte}</p>
                {engagement.lien ? (
                  <Link
                    href={engagement.lien.href}
                    className="mt-4 inline-block text-[0.975rem] text-night underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-ink"
                  >
                    {engagement.lien.label}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau international. */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid w-full max-w-grid gap-10 px-6 py-20 lg:grid-cols-[2fr,3fr] lg:items-center">
          <div>
            <Intitule>International</Intitule>
            <h2
              className={`mt-6 text-night ${TITRE_SECTION}`}
              style={{ fontSize: "clamp(1.85rem, 2.6vw, 2.4rem)" }}
            >
              Une pratique internationale
            </h2>
          </div>
          <div>
            <p className={`text-anthracite ${CHAPEAU}`}>
              Successions comportant des éléments d&apos;extranéité,
              acquisitions par des non-résidents, expatriation et retour en
              France : l&apos;étude traite les dossiers internationaux en
              coordination avec des correspondants étrangers lorsque la
              situation l&apos;exige.
            </p>
            <p className="mt-4 text-[0.95rem] text-slate-soft">
              Langues de travail : {etude.langues.join(", ")}.
            </p>
          </div>
        </div>
      </section>

      {/* Derniers articles. */}
      <section className="bg-ivory">
        <div className={`mx-auto w-full max-w-grid ${RYTHME}`}>
          <Intitule>Actualités et publications</Intitule>
          <h2
            className={`mt-6 max-w-3xl text-night ${TITRE_SECTION}`}
            style={{ fontSize: TAILLE_TITRE_SECTION }}
          >
            Les dernières publications de l&rsquo;étude
          </h2>
          {derniersArticles.length > 0 ? (
            <ul className="mt-12 grid gap-10 md:grid-cols-3">
              {derniersArticles.map(({ frontmatter }) => (
                <li
                  key={`${frontmatter.categorie}/${frontmatter.slug}`}
                  className="border-t-2 border-gold/50 pt-6"
                >
                  <p className="text-[0.78rem] font-medium uppercase tracking-[0.24em] text-gold-ink">
                    {CATEGORIE_LABELS[frontmatter.categorie]}
                  </p>
                  <h3 className={`mt-3 text-night ${TITRE_BLOC}`}>
                    <Link
                      href={`/blog/${frontmatter.categorie}/${frontmatter.slug}`}
                      className="no-underline decoration-gold underline-offset-4 hover:underline"
                    >
                      {frontmatter.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[0.95rem] text-slate-soft">
                    <time dateTime={frontmatter.date}>{frontmatter.date}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-8 ${CORPS_BLOC}`}>
              Les articles du blog seront publiés prochainement.
            </p>
          )}
          <div className="mt-12">
            <LienCapitale href="/blog">Toutes les publications</LienCapitale>
          </div>
        </div>
      </section>

      {/* Bloc contact — téléphone appelable en grand pour le mobile,
          adresse électronique, lien statique vers Google Maps, pas d'iframe. */}
      <section className="bg-paper">
        <div className={`mx-auto grid w-full max-w-grid gap-10 md:grid-cols-2 ${RYTHME}`}>
          <div>
            <Intitule>Contact</Intitule>
            <h2
              className={`mt-6 text-night ${TITRE_SECTION}`}
              style={{ fontSize: "clamp(1.85rem, 2.6vw, 2.4rem)" }}
            >
              Nous rencontrer
            </h2>
            <p className={`mt-6 ${CORPS_BLOC}`}>
              {etude.adresse.ligne1}
              <br />
              {etude.adresse.codePostal} {etude.adresse.ville}
            </p>
            <p className="mt-3">
              <a
                href={`tel:${etude.telephoneE164}`}
                className="font-serif text-3xl text-night no-underline"
              >
                {etude.telephone}
              </a>
            </p>
            <p className="mt-2 text-[0.95rem] text-slate-soft">
              {etude.horaires}
            </p>
            <p className="mt-3">
              <a
                href={`mailto:${etude.email}`}
                className="text-[0.975rem] text-night underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-ink"
              >
                {etude.email}
              </a>
            </p>
            <p className="mt-3">
              <a
                href={etude.liens.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.975rem] text-night underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-ink"
              >
                Voir le plan d&apos;accès
              </a>
            </p>
          </div>
          <div className="flex flex-col items-start justify-center gap-6">
            <CtaRendezVous />
            <LienCapitale href="/contact">Accès et formulaire de contact</LienCapitale>
          </div>
        </div>
      </section>
    </main>
  );
}
