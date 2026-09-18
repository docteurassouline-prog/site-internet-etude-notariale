import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

// Exécuter le véritable gestionnaire, avec un transport simulé : aucun e-mail
// ne quitte ce test, y compris pour les cas considérés comme acceptés.
const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const valide = { nom: "Visiteur test", email: "test@example.org", objet: "Rendez-vous", message: "Message de recette", consentement: true };
function route(fetch, env = { RESEND_API_KEY: "test-only" }) {
  const module = { exports: {} };
  const imports = (name) => name === "@/config/etude" ? { etude: { email: "contact@example.org" } } : require(name);
  new Function("require", "module", "exports", "process", "fetch", code)(imports, module, module.exports, { env }, fetch);
  return module.exports.POST;
}
function requete(body = valide, headers = {}) {
  return new Request("https://example.org/api/contact", { method: "POST", headers: { "content-type": "application/json", origin: "https://example.org", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
}
const interdit = () => { throw new Error("Le transport ne doit pas être appelé"); };

test("refuse un transport non configuré et une origine étrangère", async () => {
  assert.equal((await route(interdit, {})(requete())).status, 503);
  assert.equal((await route(interdit)(requete(valide, { origin: "https://autre.example" }))).status, 403);
});
test("borne le corps réel même sans Content-Length", async () => {
  assert.equal((await route(interdit)(requete("a".repeat(32769)))).status, 413);
  assert.equal((await route(interdit)(requete("{"))).status, 400);
  assert.equal((await route(interdit)(requete(valide, { "content-type": "text/plain" }))).status, 415);
});
test("refuse le défaut de consentement, les champs vides et les limites dépassées", async () => {
  for (const valeurs of [{ consentement: false }, { nom: " " }, { email: "invalide" }, { objet: "Ligne 1\nLigne 2" }, { message: "x".repeat(6001) }]) {
    assert.equal((await route(interdit)(requete({ ...valide, ...valeurs }))).status, 422);
  }
});
test("échappe le HTML et transmet les messages suspects sans faux succès", async () => {
  let envoi;
  const handler = route(async (_url, options) => { envoi = JSON.parse(options.body); return Response.json({ id: "simulation" }); }, { RESEND_API_KEY: "test-only", CONTACT_DESTINATAIRE: "" });
  const reponse = await handler(requete({ ...valide, nom: "<script>test</script>", suspect: true }));
  assert.equal(reponse.status, 200);
  assert.deepEqual(await reponse.json(), { ok: true });
  assert.ok(envoi.html.includes("&lt;script&gt;test&lt;/script&gt;"));
  assert.ok(envoi.subject.includes("SUSPECT"));
  assert.deepEqual(envoi.to, ["contact@example.org"]);
});
test("annonce un échec sur refus, panne et expiration du prestataire", async () => {
  for (const transport of [async () => new Response("refus", { status: 429 }), async () => { throw new Error("network"); }, async () => { throw new DOMException("timeout", "TimeoutError"); }]) {
    const reponse = await route(transport)(requete());
    assert.equal(reponse.status, 502);
    assert.equal((await reponse.json()).ok, undefined);
  }
});
