export interface EntreeFaq {
  id: string;
  question: string;
  reponse: string;
}

/** Accordéons natifs, utilisables au clavier et sans JavaScript. */
export function AccordeonFaq({ entrees }: { entrees: EntreeFaq[] }) {
  return (
    <div className="faq-list divide-y divide-line border-y border-line">
      {entrees.map((entree) => (
        <details key={entree.id} id={entree.id} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 font-medium text-night">
            <span>{entree.question}</span>
            <span
              className="shrink-0 text-2xl font-normal text-gold-ink group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="pb-6 pr-5 text-base leading-relaxed text-slate-soft">
            {entree.reponse}
          </p>
        </details>
      ))}
    </div>
  );
}
