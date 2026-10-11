---
title: Maillage et calcul
description: Ce que TSA transmet au moteur OpenSees à partir du maillage, et ce qui reste exclu du calcul.
order: 5
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [maillage et calcul, subdivision, opensees, coque, volume, obsolète]
helpIds: []
---
## Avant le calcul

Quand un maillage existe, TSA vérifie sa compatibilité avec le moteur avant chaque calcul : types et ordre des
éléments, continuité des barres, sections, matériaux, appuis et charges. Une fenêtre récapitule ce qui est transmis
et ce qui ne l'est pas. Aucune conversion n'est faite en silence.

## Éléments transmis

| Éléments du maillage | Traitement |
| :--- | :--- |
| Segments des poutres et poteaux (premier ordre) | La barre est subdivisée aux nœuds du maillage. Charges réparties, charges ponctuelles et poids propre sont répartis exactement sur les sous-éléments |
| Segments des treillis et câbles | Un seul élément par barre (une chaîne articulée subdivisée serait un mécanisme) |
| Segments du second ordre (Line3) | Refusés : régénérez au premier ordre |
| Triangles et quadrangles (dalles, voiles) | **Non transmis** : les dalles et voiles restent exclus du calcul |
| Tétraèdres et hexaèdres (semelles) | **Non transmis** ; les appuis définis aux nœuds restent appliqués |

Les résultats sont recomposés par barre : tableaux, diagrammes et note de calcul restent ceux des barres du modèle.

## Maillage obsolète

Si la géométrie a changé depuis la génération, TSA propose de régénérer le maillage, de calculer sans maillage ou
d'annuler.

> [!IMPORTANT]
> Le calcul des dalles et des voiles en éléments de coque est prévu, mais pas encore disponible. Les charges
> surfaciques ne sont pas encore appliquées au calcul.

## Voir aussi

- [Préparer le modèle](/docs/analysis/preparing-model)
- [Afficher le maillage dans la vue 3D](/docs/mesh/display)
