import Link from "next/link";
import { CtaRendezVous } from "@/components/cta-rdv";
import { etude } from "@/config/etude";

export function ContactBand() {
  return (
    <section className="contact-band" aria-labelledby="contact-band-title">
      <div className="site-container contact-composition">
        <div>
          <p className="eyebrow">Tout commence par un échange</p>
          <h2 id="contact-band-title">Parlons de<br /><em>votre projet.</em></h2>
        </div>
        <div className="contact-actions">
          <p>{etude.adresse.ligne1}<br />{etude.adresse.codePostal} {etude.adresse.ville}</p>
          <p className="contact-hours">{etude.horaires}</p>
          <CtaRendezVous />
          <a href={`tel:${etude.telephoneE164}`} className="text-link">
            {etude.telephone}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactAside() {
  return (
    <aside className="contact-aside">
      <p className="eyebrow">Votre interlocuteur</p>
      <h2 className="mt-3 font-serif text-3xl">L&apos;étude Thomas Lévy</h2>
      <p className="mt-4">
        Un rendez-vous permet d&apos;examiner votre situation.
      </p>
      <div className="mt-6">
        <CtaRendezVous surFondSombre />
      </div>
      <a href={`tel:${etude.telephoneE164}`} className="mt-5 block">
        {etude.telephone}
      </a>
      <Link
        href="/tarif"
        className="mt-4 inline-block underline underline-offset-4"
      >
        Comprendre le tarif
      </Link>
    </aside>
  );
}
