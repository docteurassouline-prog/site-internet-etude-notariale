# Recomposition éditoriale — 10 septembre 2026

La première refonte avait surtout harmonisé les gabarits et corrigé les contenus. Cette seconde version répond à la demande d'une transformation visuelle plus marquée.

## Changements visibles

- Accueil clair, titre en trois lignes, portrait original de Thomas Lévy et légende de présentation.
- Quatre domaines d'expertise présentés dans un sélecteur sur fond bleu nuit. Les dix-huit liens restent présents dans le HTML initial ; navigation au clavier par les flèches, Début et Fin.
- Sections consacrées à la méthode et à l'international recomposées, avec accès aux informations pratiques françaises, anglaises et allemandes.
- Publications présentées en grille typographique numérotée.
- En-tête simplifié, titres des pages intérieures en deux colonnes, annuaire des expertises et page de l'étude recomposés, nouvelle invitation au contact et signature typographique au pied de page.
- Logo et portrait d'origine conservés sans retouche. Aucun visuel généré ajouté.

## Vérifications réalisées

- TypeScript : succès.
- ESLint : succès, aucune alerte.
- Vérification des contenus : aucun problème bloquant ; quatorze mentions légales préexistantes restent à valider par l'étude.
- Compilation de production Next.js : succès, 47 sorties générées.
- Contrôle du HTML des 38 pages publiques : 1 597 liens et ancres internes vérifiés, aucune cible manquante ; un titre H1 par page.
- Contrôle des relations ARIA des quatre onglets et panneaux dans le HTML initial : succès.
- `git diff --check` : succès.

Les contrôles portent sur le code et le HTML compilé. Le rendu en navigateur, les interactions réelles sur mobile et l'envoi du formulaire n'ont pas été vérifiés dans cette session.

## Aperçu et publication

Cette version est proposée sur une branche dédiée pour fournir un nouvel aperçu Vercel. La validation de l'identité visuelle doit porter sur cet aperçu avant sa fusion dans la version principale.
