import Link from "next/link";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

/**
 * Bouton de prise de rendez-vous (§2) — pointe vers l'outil externe
 * NEXT_PUBLIC_BOOKING_URL, à défaut vers /contact.
 *
 * Mise en valeur du 7 septembre 2026, à la demande du notaire. L'appel à
 * l'action était rendu en night sur ivoire et en ivoire sur night : deux
 * aplats sobres qui, dans une page tenue en ivoire, night et or, ne se
 * distinguaient d'aucun autre bloc. Le bouton primaire prend l'or plein —
 * c'est la seule surface dorée du site, elle ne peut donc désigner que lui.
 * Le §5 qui proscrivait le bouton doré est abrogé depuis le 3 septembre 2026 ;
 * reste la seule réserve de contraste, vérifiée : night sur gold vaut 5,2:1
 * et ivoire sur gold-ink 5,0:1, tous deux conformes AA. Le bouton gagne aussi
 * en surface (px-8 py-4) : sur un site de conseil, la prise de rendez-vous
 * est la seule action attendue du visiteur, elle a droit à sa taille.
 */
export function CtaRendezVous({
  variante = "primaire",
  surFondSombre = false,
}: {
  variante?: "primaire" | "secondaire";
  surFondSombre?: boolean;
}) {
  const href = BOOKING_URL && BOOKING_URL.length > 0 ? BOOKING_URL : "/contact";
  // L'or plein ne dépend pas du fond : c'est ce qui rend le bouton
  // reconnaissable d'une section à l'autre, sur ivoire comme sur night.
  const classes =
    variante === "primaire"
      ? "bg-gold text-night shadow-[0_1px_2px_rgba(16,28,44,0.16)] hover:bg-gold-ink hover:text-ivory"
      : surFondSombre
        ? "border border-ivory text-ivory hover:bg-ivory hover:text-night"
        : "border border-night text-night hover:bg-night hover:text-ivory";
  return (
    <Link
      href={href}
      className={`inline-block rounded-sm px-8 py-4 text-[0.84rem] font-semibold uppercase tracking-[0.14em] transition-colors ${classes}`}
    >
      Prendre rendez-vous
    </Link>
  );
}
