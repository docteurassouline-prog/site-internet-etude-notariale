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
        <div className="page-intro-composition">
          <div>
            <p className="eyebrow">{rubrique ?? "Lévy Notaires · Paris"}</p>
            <h1 className="display-title">{titre}</h1>
          </div>
          {description && <p className="intro-copy">{description}</p>}
        </div>
        {children && <div className="page-intro-details">{children}</div>}
      </div>
    </header>
  );
}
