---
title: Qualité du maillage
description: Les contrôles effectués après la génération, la liste des problèmes et les interfaces non conformes.
order: 3
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [qualité du maillage, minSICN, jacobien, rapport d'aspect, élément inversé, interface non conforme]
helpIds: []
---
## Panneau « Qualité du maillage »

Il s'ouvre après chaque génération, ou avec **Vérifier la qualité du maillage** (ruban **Analyse**). Il indique la
version de Gmsh, la date, le nombre de nœuds et d'éléments par dimension, le nombre de degrés de liberté estimé, puis
la synthèse des contrôles.

## Contrôles

- Qualité **minSICN** de Gmsh (1 : élément parfait ; négatif : élément inversé).
- Rapport d'aspect, angles minimal et maximal, jacobien normalisé (quadrangles, hexaèdres).
- Éléments dégénérés, orientation incohérente entre éléments voisins.
- Nœuds isolés, nœuds confondus non fusionnés.
- Connexions incorrectes et incompatibilités entre régions.
- Interfaces non conformes, par exemple une barre reliée à une semelle par un seul nœud.
- Croissance des tailles le long des barres.

## Liste des problèmes

Chaque ligne donne la gravité, le type, l'objet et l'élément ou le nœud concerné. Cliquer sur une ligne met
l'élément en évidence dans la vue 3D et cadre la vue dessus. Dans la vue, les éléments de qualité insuffisante
(minSICN inférieur à 0,1) sont tracés en rouge.

> [!WARNING]
> Une génération sans erreur ne prouve pas la convergence : comparez les résultats obtenus avec plusieurs finesses.

## Voir aussi

- [Paramètres et génération](/docs/mesh/generation)
- [Affichage dans la vue 3D](/docs/mesh/display)
