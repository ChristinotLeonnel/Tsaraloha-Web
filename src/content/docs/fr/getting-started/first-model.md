---
title: Premier modèle pas à pas
description: Dessiner, appuyer, charger et calculer une poutre simple.
order: 7
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [tutoriel, exemple, poutre, tutorial, first model]
helpIds: []
---
Cet exemple calcule une poutre de 6 m sur deux appuis, chargée uniformément.

## 1. Dessiner la poutre

1. Créez un projet avec `Ctrl+N`.
2. Appuyez sur `B` pour dessiner une poutre.
3. Cliquez sur deux points de la grille distants de 6 m, ou tapez la longueur au clavier puis `Entrée`.
4. Appuyez sur `Échap` pour terminer.

## 2. Section et matériau

Sélectionnez la poutre. Dans le panneau **Propriétés**, choisissez une section (par exemple un IPE) et
un matériau acier. Voir [Sections et matériaux](/docs/modeling/sections-materials).

## 3. Appuis

Sélectionnez le nœud de gauche et attribuez une articulation, puis le nœud de droite et attribuez un
appui simple. Voir [Appuis](/docs/modeling/supports).

## 4. Charge

Sélectionnez la poutre et ouvrez **Charge sur barre**. Choisissez le type **Uniforme**, la direction
**Gravité** et saisissez l'intensité en kN/m. Voir [Charges réparties](/docs/loading/distributed-loads).

## 5. Calcul et résultats

1. Lancez l'analyse avec `F5` ou depuis l'onglet **Analyse**.
2. Affichez la déformée et les diagrammes dans l'onglet **Résultats**.
3. Comparez la flèche au résultat théorique 5qL⁴/384EI.

> [!TIP]
> Vérifier un cas simple avec une formule connue est la meilleure façon de valider vos hypothèses.
