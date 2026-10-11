---
title: Maillage
description: Maillage éléments finis des barres, dalles, voiles et semelles avec Gmsh, contrôle de qualité et affichage dans la vue 3D.
order: 0
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [maillage, mesh, gmsh, éléments finis, discrétisation]
helpIds: []
---
TSA maille le modèle avec **Gmsh 4.15** : barres en éléments 1D, dalles et voiles en éléments 2D, semelles en
éléments 3D. Le maillage est enregistré dans le projet, contrôlé, affiché dans la vue 3D et transmis au calcul pour
les barres.

| Page | Contenu |
| :--- | :--- |
| [Vue d'ensemble](/docs/mesh/overview) | Ce qui est maillé, déroulé, ce que le calcul utilise |
| [Paramètres et génération](/docs/mesh/generation) | Tailles, ordre, algorithmes, profils, maillage local, aperçu |
| [Qualité du maillage](/docs/mesh/quality) | Contrôles, liste des problèmes, interfaces |
| [Affichage dans la vue 3D](/docs/mesh/display) | Modes, filtres, coupe, sélection, déplacements sur le maillage |
| [Maillage et calcul](/docs/mesh/analysis) | Éléments transmis à OpenSees, limites actuelles |
| [Import et export](/docs/mesh/import-export) | Formats d'échange, outil en ligne de commande |

> [!IMPORTANT]
> Les dalles, voiles et semelles sont maillés mais **pas encore calculés** : seuls les éléments des barres sont
> transmis au moteur. Voir [Maillage et calcul](/docs/mesh/analysis).
