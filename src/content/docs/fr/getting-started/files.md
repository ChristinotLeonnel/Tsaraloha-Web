---
title: Fichiers de projet
description: Le format .tsa : contenu, compatibilité et bonnes pratiques de sauvegarde.
order: 5
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [fichier, format, tsa, sauvegarde, file format]
helpIds: [project.files]
---
## Le format `.tsa`

Un fichier `.tsa` contient le modèle structural : nœuds, barres, sections, matériaux, appuis, dalles,
voiles, fondations, grilles, charges, cas, combinaisons et réglages d'analyse. La version actuelle du
format est la **1.4**.

- La géométrie 3D est reconstruite à l'ouverture : le fichier ne contient pas de maillage d'affichage.
- Un contrôle d'intégrité est vérifié à l'ouverture. Un fichier corrompu ou tronqué est refusé.
- Les fichiers écrits par une version plus ancienne de TSA restent lisibles.

## Bonnes pratiques

- Enregistrez souvent avec `Ctrl+S`.
- Gardez une copie avant une modification importante du modèle.
- Les résultats de calcul ne remplacent pas le modèle : relancez le calcul après réouverture si besoin.

## Voir aussi

- [Problèmes d'enregistrement](/docs/troubleshooting/saving)
