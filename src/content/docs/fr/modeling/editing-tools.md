---
title: Outils de modification
description: Déplacer, copier, tourner, diviser, prolonger et ajuster.
order: 10
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [déplacer, copier, rotation, symétrie, diviser, prolonger, ajuster, move, copy, trim, extend]
helpIds: [model.edit]
---
Les outils se pilotent dans la vue 3D par défaut : clics accrochés, valeur tapée au clavier puis
`Entrée`, aperçu en couleur. `Maj` + clic sur un outil ouvre sa fenêtre de paramètres.

## Outils

| Outil | Saisie dans la vue |
| :--- | :--- |
| Déplacer (`M`) | point de base, puis destination ou distance |
| Copier | point de base, puis destinations |
| Rotation (`Ctrl+R`) | centre, référence, puis angle |
| Symétrie | deux points de l'axe |
| Échelle | point de base, puis facteur |
| Réseau linéaire ou polaire | nombre, puis pas ou centre |
| Décaler | distance, puis côté |
| Diviser en N, diviser au point | clic sur la barre |
| Intersecter, prolonger, ajuster | barre limite, puis barre à modifier |
| Fusionner les nœuds | immédiat |
| Chaîne, rectangle, portique, contreventement, arc | points successifs |

## Clavier

- `Entrée` seule termine une chaîne.
- `Échap` efface la valeur tapée, puis recommence l'outil, puis le quitte.
- `Ctrl` + clic choisit la variante de l'outil, par exemple une rotation avec copie.

Chaque opération s'annule en une fois avec `Ctrl+Z`. Rien n'est modifié si l'outil échoue.
