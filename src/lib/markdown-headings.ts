import { fromMarkdown } from "mdast-util-from-markdown";

/** Le parseur CommonMark ignore notamment les faux titres dans les blocs de code. */
export function markdownHeadings(contenu: string) {
  const arbre = fromMarkdown(contenu);
  function texte(node: { value?: string; children?: unknown[] }): string {
    return node.value ?? (node.children ?? []).map((enfant) => texte(enfant as typeof node)).join("");
  }
  return arbre.children.flatMap((node) => node.type === "heading" && node.depth === 2
    ? [{ id: `lecture-${node.position?.start.line}`, titre: texte(node) }]
    : []);
}
