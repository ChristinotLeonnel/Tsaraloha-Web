---
title: Moteurs de calcul
description: OpenSees pour la 3D, Custom2D pour les ossatures planes, Fem3D en développement.
order: 4
status: available
version: 0.1.0
updated: 2026-10-20
keywords: [moteur, opensees, custom2d, fem3d, solveur, engine, solver]
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

## Fem3D

Moteur d'éléments finis 3D de poutres développé pour TSA (poutres d'Euler–Bernoulli et de Timoshenko,
statique linéaire), validé contre des solutions analytiques et contre OpenSees 3.8.0. Il est intégré à la
**version de développement** de TSA comme moteur secondaire, et n'est encore dans aucune version publiée :
OpenSees reste le moteur 3D par défaut tant que sa qualification n'est pas terminée.

Documentation complète (livre technique, parcours d'apprentissage, validation), publiée par le dépôt du moteur :
[site de la documentation Fem3D](https://christinotleonnel.github.io/TSA-3D-FEM-Engine/).

## Analyse dynamique

L'analyse modale, la poussée progressive et l'analyse temporelle ne sont **pas disponibles** dans la
version actuelle.
