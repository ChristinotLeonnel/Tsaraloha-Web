---
title: Poutres et poteaux
description: Dessiner des barres, définir leur orientation et leurs propriétés.
order: 2
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [poutre, poteau, barre, beam, column, member, repère local]
helpIds: [model.members]
---
## Dessiner

| Élément | Raccourci | Saisie |
| :--- | :--- | :--- |
| Poutre | `B` | deux points |
| Poteau | `C` | deux points, ou point de base et hauteur |

La saisie au clavier fonctionne pendant le dessin : tapez une longueur puis `Entrée`.
`Échap` termine la commande.

## Propriétés d'une barre

Dans **Propriétés** : section, matériau, angle de rotation β autour de l'axe de la barre, et nœuds
d'extrémité. Les nœuds d'extrémité affichés sont reliés à la barre : modifier un nœud met la barre à jour.

## Repère local

- x suit la barre, du nœud de départ vers le nœud d'arrivée.
- z est construit à partir de Z global, ou de Y global pour une barre verticale, puis tourné de β.
- Les charges en repère local utilisent ces axes.

## Voir aussi

- [Sections et matériaux](/docs/modeling/sections-materials)
- [Outils de modification](/docs/modeling/editing-tools)
