import type { ReactNode } from "react";
import { FilAriane, type Maillon } from "@/components/fil-ariane";

export function PageIntro({
  titre,
  rubrique,
  description,
  maillons,
  children,
}: {
  titre: string;
  rubrique?: string;
  description?: string;
  maillons?: Maillon[];
  children?: ReactNode;
}) {
  return (
    <header className="page-intro">
      <div className="site-container">
        <FilAriane maillons={maillons ?? [{ label: titre }]} />
        {rubrique && <p className="eyebrow mt-10">{rubrique}</p>}
        <h1 className={`display-title ${rubrique ? "mt-4" : "mt-9"}`}>
          {titre}
        </h1>
        {description && <p className="intro-copy">{description}</p>}
        {children}
      </div>
    </header>
  );
}
