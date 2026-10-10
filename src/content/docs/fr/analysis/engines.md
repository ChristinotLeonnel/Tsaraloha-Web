---
title: Moteurs de calcul
description: OpenSees pour la 3D et Custom2D pour les ossatures planes.
order: 4
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [moteur, opensees, custom2d, solveur, engine, solver]
helpIds: [analysis.engines]
---
## OpenSees

| Élément | Valeur |
| :--- | :--- |
| Version | 3.8.0 |
| Dimension | 3D |
| Éléments | poutres, poteaux, treillis, câbles, appuis élastiques |
| Calcul | statique linéaire ; statique non linéaire en option expérimentale |

TSA lit la version de l'exécutable installé. S'il manque, TSA propose de le télécharger.

## Custom2D

Moteur d'ossatures planes par la méthode des déplacements. Il calcule les portiques et treillis plans
d'un axe de grille ou d'un plan. Ce moteur est **expérimental**.

## Analyse dynamique

L'analyse modale, la poussée progressive et l'analyse temporelle ne sont **pas disponibles** dans la
version actuelle.
