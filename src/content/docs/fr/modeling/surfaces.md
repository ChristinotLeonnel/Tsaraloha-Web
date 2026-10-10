---
title: Dalles et voiles
description: Modéliser des éléments surfaciques et connaître leurs limites.
order: 4
status: experimental
version: 0.1.0
updated: 2026-10-10
keywords: [dalle, voile, surface, slab, wall, plancher]
helpIds: [model.surfaces]
---
## Créer

| Élément | Raccourci | Saisie |
| :--- | :--- | :--- |
| Dalle | `L` | contour fermé d'au moins 3 points coplanaires |
| Voile | `W` | ligne d'assise, puis hauteur |

> [!IMPORTANT]
> Les dalles et les voiles **ne sont pas pris en compte par le calcul**. TSA vous avertit avant chaque
> analyse lorsqu'un modèle en contient. Leur poids et leur rigidité n'agissent pas sur la structure.

## Usage actuel

Les surfaces servent à la représentation du bâtiment, aux quantités et à l'export IFC. Pour transmettre
une charge de plancher, appliquez-la sur les poutres porteuses.

## Voir aussi

- [Maillage](/docs/mesh/overview)
- [Charges surfaciques](/docs/loading/surface-loads)
