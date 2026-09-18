# Livraison et limites vérifiées — 18 septembre 2026

## Version enregistrée

Les corrections sont enregistrées sur `main` de la copie `docteurassouline-prog/site-internet-etude-notariale`, commit `81df55aac2be3e9486232045288570ff16121992`.

L'arbre de fichiers distant est identique à celui contrôlé localement : `322bd863b91ca54162f3380f1c7490ffc279569b`.

Rapport : [Audit du 18 septembre](AUDIT-2026-09-18.md).

## Contrôles réussis

- TypeScript, ESLint, garde des contenus et compilation Next.js.
- Cinq tests du gestionnaire de contact avec transport simulé, aucun e-mail envoyé.
- 38 pages publiques et 1 616 liens/ancres internes, aucune cible manquante.
- Contact local en HTTP 200, sujet conservé dans le lien de courriel en l'absence de transport.
- Aucune vulnérabilité signalée dans les dépendances de production par `npm audit --omit=dev`.
- Vercel : statut `success` sur le commit livré, déploiement [8GRMh2tjZP6w8FwtPbH6hdhH4qpM](https://vercel.com/drs-projects-b3281ae2/site-internet-etude-notariale/8GRMh2tjZP6w8FwtPbH6hdhH4qpM).

## Distinction entre compilation et publication

Le contrôle réel du lien `https://site-internet-etude-notariale-ten.vercel.app/`, après réussite du déploiement, montre encore l'accueil ancien (« Le conseil notarial pour les opérations immobilières et patrimoniales complexes »). Ce lien ne peut donc pas être présenté comme celui de la nouvelle version.

L'ancien aperçu de branche du 10 septembre demande une connexion Vercel. Le navigateur distant ne peut pas atteindre le serveur local. Le rendu de la nouvelle version dans un navigateur et les interactions mobiles ne sont donc pas validés dans cette session. Aucun score Lighthouse ou niveau de conformité RGAA n'est revendiqué.

## Accès à rétablir pour terminer

1. Sur le dépôt `thomaslevy-commits/site-internet-etude-notariale`, autoriser l'installation GitHub utilisée dans ChatGPT à écrire le contenu de ce dépôt. L'API refuse actuellement une création de blob avec `403 Resource not accessible by integration`, malgré les droits de collaborateur affichés sur les métadonnées.
2. Vérifier dans Vercel le dépôt connecté, la branche de production et les domaines affectés au déploiement. L'accès Vercel connecté n'est pas disponible dans cette session ; une connexion a été proposée.
3. Publier le code validé sur le dépôt d'origine une fois l'accès rétabli, puis contrôler le domaine réel `www.levy-notaires.fr` et les principaux parcours.

Les quatorze informations légales à valider et le `noindex` volontaire restent consignés dans l'audit. Ils ne doivent pas être confondus avec le refus technique d'écriture GitHub.
