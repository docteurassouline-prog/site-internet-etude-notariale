/** Un seul classement pour l'accueil, le répertoire et les pages détaillées. */
export const FAMILLES = [
  {
    id: "immobilier",
    titre: "Immobilier",
    description:
      "Acquisitions et ventes, VEFA, promotion, marchands de biens, fiscalité immobilière : du logement à l'opération d'ensemble.",
    slugs: [
      "immobilier-residentiel",
      "immobilier-commercial",
      "vefa",
      "promotion-immobiliere",
      "marchands-de-biens",
      "fiscalite-immobiliere",
    ],
  },
  {
    id: "patrimoine-famille",
    titre: "Patrimoine & famille",
    description:
      "Successions, donations, partages, séparations et structuration patrimoniale, pensés dans la durée d'une famille.",
    slugs: [
      "successions",
      "donations",
      "partage",
      "divorce",
      "structuration-patrimoniale",
      "sci",
    ],
  },
  {
    id: "entreprise",
    titre: "Entreprise",
    description:
      "Transmission d'entreprise, baux commerciaux, sociétés civiles : l'immobilier et le patrimoine du dirigeant, en coordination avec ses conseils.",
    slugs: ["transmission-entreprise", "baux-commerciaux"],
  },
  {
    id: "international",
    titre: "International",
    description:
      "Successions transfrontalières, non-résidents, expatriés, investisseurs étrangers et family offices.",
    slugs: [
      "successions-internationales",
      "expatries",
      "investisseurs-etrangers",
      "family-office",
    ],
  },
] as const;

export const NAVIGATION = [
  { href: "/etude", label: "L'étude" },
  { href: "/expertises", label: "Expertises" },
  { href: "/international", label: "International" },
  { href: "/blog", label: "Publications" },
  { href: "/tarif", label: "Tarif" },
] as const;
