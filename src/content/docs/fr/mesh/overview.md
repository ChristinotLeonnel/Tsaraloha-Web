---
title: Maillage : état actuel
description: Ce que fait la commande Générer maillage et ce qui est prévu.
order: 1
status: planned
version: 0.1.0
updated: 2026-10-10
keywords: [maillage, mesh, éléments finis, discrétisation, coque]
helpIds: [mesh.overview]
---
## Barres

Chaque barre est transmise au moteur comme un élément fini. Aucun maillage n'est nécessaire.

## Commande « Générer maillage »

La commande de l'onglet **Analyse** donne seulement une **estimation** du nombre d'éléments. Elle ne
crée pas de maillage et ne modifie pas le calcul.

## Surfaces

Le maillage des dalles et des voiles en éléments de coque est **prévu**. D'ici là, les surfaces sont
exclues du calcul et TSA l'indique avant chaque analyse.
