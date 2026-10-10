---
title: Appuis
description: Bloquer des degrés de liberté aux nœuds : encastrement, articulation, ressorts.
order: 6
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [appui, encastrement, articulation, ressort, support, condition aux limites]
helpIds: [model.supports]
---
## Types d'appui

| Type | Degrés de liberté bloqués |
| :--- | :--- |
| Encastrement | les trois translations et les trois rotations |
| Articulation | les trois translations |
| Appui simple | translation verticale, ou direction choisie |
| Appui glissant | tout sauf la translation axiale |
| Appui élastique | ressorts de raideur K par degré de liberté |
| Personnalisé | combinaison libre des six degrés de liberté |

## Attribuer un appui

Sélectionnez un ou plusieurs nœuds, puis choisissez l'appui dans le ruban ou dans **Propriétés**.

> [!WARNING]
> Une structure insuffisamment appuyée est instable. Le calcul échoue alors : voir
> [Échecs de calcul](/docs/troubleshooting/analysis-failures).
