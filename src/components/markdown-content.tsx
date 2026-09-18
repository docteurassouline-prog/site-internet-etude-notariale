import Markdown from "react-markdown";
import Link from "next/link";

/** CommonMark rendu côté serveur : aucun HTML brut ni exécution du MDX. */
export function MarkdownContent({ contenu }: { contenu: string }) {
  return (
    <div className="prose-notariale">
      <Markdown
        components={{
          h2: ({ node, children }) => <h2 id={`lecture-${node?.position?.start.line}`}>{children}</h2>,
          a: ({ href, children }) =>
            href?.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href}>{children}</a>
            ),
        }}
      >
        {contenu}
      </Markdown>
    </div>
  );
}
