---
title: Charges réparties
description: Appliquer une charge linéique uniforme sur toute la barre ou sur une partie.
order: 4
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [charge répartie, charge uniforme, charge linéique, udl, distributed load]
helpIds: [loading.distributed]
---
## Appliquer une charge uniforme

1. Sélectionnez une ou plusieurs barres.
2. Ouvrez **Charge sur barre** et choisissez **Uniforme (kN/m)**.
3. Choisissez la direction : gravité, axe global ou axe local.
4. Saisissez l'intensité q en kN/m.
5. Pour une charge partielle, indiquez le début x1 et la fin x2 en mètres.

Avec plusieurs barres sélectionnées, cochez **Appliquer aux barres sélectionnées** pour charger toutes
les barres en une seule opération.

## Affichage

La charge est dessinée par une série de flèches régulières sur la longueur chargée, reliées par une
ligne d'enveloppe. Les flèches indiquent la direction réelle de la charge.

## Vérifier

Sélectionnez la barre : **Propriétés** liste ses charges. Voir aussi
[Vérifier les charges](/docs/loading/checking-loads).
