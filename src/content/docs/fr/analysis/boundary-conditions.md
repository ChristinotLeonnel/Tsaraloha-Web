---
title: Conditions aux limites
description: Appuis, relâchements et stabilité du modèle de calcul.
order: 3
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [conditions aux limites, stabilité, mécanisme, boundary]
helpIds: []
---
## Appuis

Les appuis définis aux nœuds sont transmis au moteur. Voir [Appuis](/docs/modeling/supports).

## Stabilité

Un mécanisme, par exemple une barre isolée sans appui, rend la matrice de rigidité singulière.
Le moteur refuse alors le calcul.

> [!TIP]
> Un modèle sans aucun degré de liberté libre est également refusé par OpenSees.
