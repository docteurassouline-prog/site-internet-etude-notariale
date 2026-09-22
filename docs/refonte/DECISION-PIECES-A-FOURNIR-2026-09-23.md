# Liste publique des pièces à fournir — décisions à prendre

*Note du 23 septembre 2026, à l'attention de Me Thomas Lévy. Rien n'est publié avant votre réponse.*

## Ce qui est proposé

Une page du site où le visiteur coche les pièces à réunir avant son rendez-vous, avec une barre de progression et une version imprimable, par type de dossier.

## Ce qui existe déjà

La plateforme de rendez-vous (branche `rdv/socle-plateforme`, non publiée) contient un catalogue de pièces. Pour les quatre motifs dont vous avez dicté les questions, il distingue les pièces demandées dans tous les cas (le « socle ») et celles qui dépendent de la situation :

| Motif | Demandées dans tous les cas | Selon la situation |
|---|---|---|
| Achat immobilier | Pièce d'identité | Promesse ou compromis signé ; justificatif de financement ; pièces d'identité des autres acquéreurs |
| Vente immobilière | Pièce d'identité, titre de propriété | Pièces d'identité des autres propriétaires (indivision) ; justificatif de votre qualité pour vendre ; règlement de copropriété et derniers procès-verbaux d'assemblée ; diagnostics techniques ; tableau d'amortissement du prêt en cours |
| Succession | Pièce d'identité, acte de décès, livret de famille | Justificatif du dernier domicile (domicile hors de France) ; titre de propriété (bien immobilier) |
| Donation | Pièce d'identité, livret de famille | Titre de propriété (bien immobilier) ; statuts et derniers comptes (entreprise) ; actes des donations antérieures |

Ces libellés ont été rédigés pendant la construction de la plateforme. Ils n'ont pas été relus par vous en vue d'une publication sur le site.

## Les trois points à trancher

**1. Publier une liste par motif sur le site public.**
Dans le parcours de rendez-vous, la liste est calculée à partir des réponses du visiteur. Une page publique affiche au contraire la même liste à tous. Faut-il la publier, et pour quels motifs ? Proposition : seulement les quatre motifs ci-dessus.

**2. Présenter les pièces qui dépendent de la situation.**
Deux options :
- a. n'afficher que les pièces demandées dans tous les cas ;
- b. afficher aussi les autres, chacune avec sa condition (« si vous achetez à plusieurs », « si le bien est en copropriété »…). Ces conditions seraient alors à relire par vous, parce qu'elles désignent ce qui est juridiquement pertinent (§9 du cahier des charges).

**3. Faire vivre le catalogue sur `main` avant l'arbitrage de la branche rendez-vous.**
Le cahier des charges (§13, arbitrage n° 2) prévoit que la branche ne rejoint `main` qu'après votre décision. Publier la page suppose d'y faire entrer ce seul catalogue, pour que le site et la future prise de rendez-vous partagent une liste unique. La question du dépôt de pièces en ligne (décision n° 3 du document `docs/rendez-vous/04-conformite-et-securite.md`) reste distincte : lister des pièces n'est pas les recevoir.

## Après votre réponse

La page est construite selon vos choix, relue avec vous en ligne avant d'être indexée, et la liste reste modifiable dans un seul fichier.
