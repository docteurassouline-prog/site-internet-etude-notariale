import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ContactBand } from "@/components/contact-band";
import { FAMILLES } from "@/config/navigation";
import { etude } from "@/config/etude";
import { loadExpertise } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clientèle internationale",
  description:
    "L'étude Thomas Lévy à Paris reçoit en français, anglais et allemand. Accès aux expertises internationales et coordonnées de l'étude.",
  alternates: { canonical: "/international" },
};

/** Orientation et coordonnées traduites uniquement : les analyses juridiques
 *  françaises restent les textes validés, sans traduction juridique inventée. */
export default function International() {
  const famille = FAMILLES.find((f) => f.id === "international")!;
  return (
    <main>
      <PageIntro
        titre="Votre projet, au-delà des frontières"
        rubrique="Clientèle internationale"
        description="Successions transfrontalières, non-résidents, expatriés, investisseurs étrangers et family offices. L'étude reçoit en français, en anglais et en allemand."
      >
        <nav
          id="languages"
          aria-label="Informations par langue"
          className="topic-nav mt-8"
        >
          <a href="#expertises-internationales" lang="fr">
            Français
          </a>
          <a href="#english" lang="en">
            English
          </a>
          <a href="#deutsch" lang="de">
            Deutsch
          </a>
        </nav>
      </PageIntro>
      <section
        id="expertises-internationales"
        className="site-container page-body"
      >
        <h2 className="section-title">Les expertises internationales</h2>
        <ul className="expertise-grid mt-10">
          {famille.slugs.map((slug) => {
            const fm = loadExpertise(slug).frontmatter;
            return (
              <li key={slug}>
                <Link href={`/expertises/${slug}`} className="expertise-card">
                  <h3>{fm.title}</h3>
                  <p>{fm.description}</p>
                  <span>Découvrir cette expertise ↗</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="border-t border-line bg-white">
        <div className="site-container page-body grid gap-14 md:grid-cols-2">
          <section id="english" lang="en">
            <p className="eyebrow">English</p>
            <h2 className="section-title mt-4">A notarial office in Paris</h2>
            <p className="mt-6 text-slate-soft">
              Thomas Lévy&apos;s office welcomes clients in French, English and
              German. Our areas of practice include real estate, family and
              estate matters, business and international matters.
            </p>
            <h3 className="mt-8 font-serif text-2xl">Contact the office</h3>
            <p className="mt-4 text-slate-soft">
              To arrange an appointment, contact us by telephone or email and
              indicate your preferred language.
            </p>
            <a href={`tel:${etude.telephoneE164}`} className="text-link mt-4">
              +33 1 40 75 05 55
            </a>
            <br />
            <a className="text-link break-all" href={`mailto:${etude.email}`}>
              {etude.email}
            </a>
            <p className="mt-5 text-sm text-slate-soft">
              11 boulevard Flandrin, 2nd floor, 75116 Paris, France
            </p>
            <Link href="/contact" className="text-link mt-4">
              Contact form & directions (in French) ↗
            </Link>
            <p className="mt-5 text-sm text-slate-soft">
              The legal articles and detailed practice pages are currently
              available in French.
            </p>
          </section>
          <section id="deutsch" lang="de">
            <p className="eyebrow">Deutsch</p>
            <h2 className="section-title mt-4">Ein Notariat in Paris</h2>
            <p className="mt-6 text-slate-soft">
              Das Notariat Thomas Lévy empfängt Mandanten auf Französisch,
              Englisch und Deutsch. Die Tätigkeitsbereiche umfassen Immobilien,
              Familie und Vermögen, Unternehmen sowie internationale
              Angelegenheiten.
            </p>
            <h3 className="mt-8 font-serif text-2xl">Kontakt zum Notariat</h3>
            <p className="mt-4 text-slate-soft">
              Für eine Terminvereinbarung erreichen Sie uns telefonisch oder per
              E-Mail. Bitte geben Sie Ihre bevorzugte Sprache an.
            </p>
            <a href={`tel:${etude.telephoneE164}`} className="text-link mt-4">
              +33 1 40 75 05 55
            </a>
            <br />
            <a className="text-link break-all" href={`mailto:${etude.email}`}>
              {etude.email}
            </a>
            <p className="mt-5 text-sm text-slate-soft">
              11 boulevard Flandrin, 2. Stock, 75116 Paris, Frankreich
            </p>
            <Link href="/contact" className="text-link mt-4">
              Kontaktformular & Anfahrt (auf Französisch) ↗
            </Link>
            <p className="mt-5 text-sm text-slate-soft">
              Die juristischen Beiträge und ausführlichen Fachseiten stehen
              derzeit auf Französisch zur Verfügung.
            </p>
          </section>
        </div>
      </div>
      <ContactBand />
    </main>
  );
}
