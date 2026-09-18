import { NextResponse } from "next/server";
import { z } from "zod";
import { etude } from "@/config/etude";

const schema = z.object({
  nom: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().max(40).optional().default(""),
  objet: z.string().trim().min(1).max(160).refine((v) => !/[\r\n]/.test(v)),
  message: z.string().trim().min(1).max(6000),
  consentement: z.literal(true),
  suspect: z.boolean().optional().default(false),
});

const MAX_BODY_BYTES = 32768;

/** Limiter aussi le flux réel : Content-Length peut être absent ou inexact. */
async function lireCorps(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const decoder = new TextDecoder();
  let taille = 0;
  let texte = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      taille += value.byteLength;
      if (taille > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      texte += decoder.decode(value, { stream: true });
    }
    return JSON.parse(texte + decoder.decode()) as unknown;
  } finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origine de la demande invalide." }, { status: 403 });
  }
  const cle = process.env.RESEND_API_KEY?.trim();
  if (!cle) {
    return NextResponse.json({ error: "Service de messagerie non configuré." }, { status: 503 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Format de demande invalide." }, { status: 415 });
  }
  let body: unknown;
  try { body = await lireCorps(request); }
  catch (error) {
    return NextResponse.json({ error: error instanceof RangeError ? "Message trop volumineux." : "Corps invalide." }, { status: error instanceof RangeError ? 413 : 400 });
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 422 });
  }
  const { nom, email, telephone, objet, message, suspect } = result.data;
  // Un gestionnaire de mots de passe peut renseigner le leurre : on signale
  // le message à l'étude, sans annoncer un faux succès ni le jeter en silence.
  const marqueSuspect = suspect ? " [SUSPECT — vérification recommandée]" : "";
  const html = `
    <h2>Nouveau message depuis le site${marqueSuspect}</h2>
    <table style="border-collapse:collapse">
      <tr><td>Nom</td><td>${escapeHtml(nom)}</td></tr>
      <tr><td>E-mail</td><td>${escapeHtml(email)}</td></tr>
      ${telephone ? `<tr><td>Téléphone</td><td>${escapeHtml(telephone)}</td></tr>` : ""}
      <tr><td>Objet</td><td>${escapeHtml(objet)}</td></tr>
    </table>
    <hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `.trim();
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        // Le domaine d'envoi personnalisé se configure chez le prestataire.
        from: process.env.CONTACT_EXPEDITEUR?.trim() || "Site Étude Lévy <onboarding@resend.dev>",
        to: [process.env.CONTACT_DESTINATAIRE?.trim() || etude.email],
        reply_to: email,
        subject: `[Contact site] ${objet}${marqueSuspect}`,
        html,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "Échec de l'envoi." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    // Pas de données personnelles ni de réponse du prestataire dans les logs
    // ou l'erreur publique ; le visiteur conserve son texte et peut réessayer.
    return NextResponse.json({ error: "La messagerie est temporairement indisponible." }, { status: 502 });
  }
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
