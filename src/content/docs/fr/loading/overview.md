---
title: Vue d'ensemble des charges
description: Types de charges disponibles, repères et conventions de signe.
order: 1
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [types de charges, direction, gravité, signe, load types]
helpIds: [loading.overview]
---
## Types disponibles

| Type | Unité | Fenêtre |
| :--- | :--- | :--- |
| Force nodale Fx, Fy, Fz | kN | Charge nodale : force et couple |
| Couple nodal Mx, My, Mz | kN·m | Charge nodale : force et couple |
| Charge uniforme sur barre | kN/m | Charge sur barre |
| Charge linéaire, triangulaire ou trapézoïdale | kN/m | Charge sur barre |
| Force ponctuelle sur barre | kN | Charge sur barre |
| Poids propre | calculé | Cas de charge |
| Charge surfacique | — | Prévue |

## Directions

- **Gravité** : la charge est toujours dirigée vers le bas, selon −Z. Le signe saisi est ignoré.
- **Global X, Y, Z** : une valeur positive agit dans le sens de l'axe, une valeur négative en sens opposé.
- **Local x, y, z** : axes de la barre. Voir [Poutres et poteaux](/docs/modeling/members).

## Aucune valeur par défaut

Les fenêtres de charge s'ouvrent sans valeur pré-remplie. Saisissez toujours l'intensité voulue.
