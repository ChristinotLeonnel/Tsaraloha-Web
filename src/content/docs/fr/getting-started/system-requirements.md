---
title: Configuration requise
description: Système d'exploitation, matériel et logiciels nécessaires pour utiliser TSA.
order: 2
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [configuration, windows, prérequis, requirements, opengl]
helpIds: []
---
## Système

| Élément | Exigence |
| :--- | :--- |
| Système d'exploitation | Windows 10 ou Windows 11, 64 bits |
| Carte graphique | Compatible OpenGL (affichage 3D par OpenCASCADE) |
| Souris | Trois boutons avec molette cliquable (rotation, panoramique, zoom) |
| Clavier | Pavé numérique recommandé pour les vues standard |

> [!NOTE]
> Les versions Linux et macOS ne sont pas disponibles. Elles ne sont pas annoncées à ce jour.

## Moteur de calcul OpenSees

Le moteur 3D utilise **OpenSees 3.8.0**, un exécutable externe. Lorsqu'il est absent, TSA propose de le
télécharger depuis le site officiel d'OpenSees (Université de Californie à Berkeley) au moment du
premier calcul. Une connexion Internet est donc nécessaire la première fois.

## Voir aussi

- [Installation](/docs/getting-started/installation)
- [Moteurs de calcul](/docs/analysis/engines)
