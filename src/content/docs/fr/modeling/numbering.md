---
title: Topologie et numérotation
description: Choisir la méthode de numérotation des nœuds et des éléments, prévisualiser et renuméroter les étiquettes.
order: 12
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [numérotation, renumérotation, étiquette, topologie, grille, A1, BFS, DFS, Cuthill-McKee, numbering]
helpIds: [project.topology]
---

## Ouvrir la fenêtre

- **Fichier > Paramètres du projet > Topologie et numérotation**.
- Ou le bouton **Topologie et numérotation** de l'onglet **Outils**, panneau **Projet**.

## Ce qui change, et ce qui ne change pas

La renumérotation ne modifie que les **étiquettes visibles** : N001, A1, B012… Chaque entité garde son
identifiant interne.

> [!IMPORTANT]
> Une renumérotation ne déplace aucun nœud et ne modifie ni les connectivités, ni les sections, ni les
> matériaux, ni les charges, ni les appuis. Les résultats de calcul restent valides, car le solveur utilise
> les identifiants internes.

L'onglet **Correspondances solveur** montre, pour chaque entité, son identifiant interne, son étiquette et le
numéro transmis à OpenSees. Il s'exporte en CSV.

## Méthodes pour les nœuds

| Méthode | Principe |
| :--- | :--- |
| Séquentielle globale | Ordre de création |
| Par coordonnées | Ordre des axes au choix, sens croissant ou décroissant par axe |
| Par rangées, par colonnes | Parcours le long de X ou de Y, couche par couche |
| Par couches | Couche horizontale par couche horizontale ; modèles 3D seulement |
| Grille d'axes | Repère de l'intersection, par exemple A1, avec la couche en 3D (A1-2) |
| Par niveau | Regroupement par niveau du projet |
| Cuthill-McKee inverse | Numéros voisins pour les nœuds reliés |
| Parcours en largeur ou en profondeur | Suit les éléments à partir d'un nœud de départ |
| Personnalisée | Conserve les étiquettes actuelles |

Les coordonnées distantes de moins de la **tolérance** sont regroupées sur une même rangée. Avec la grille, un
nœud hors intersection ne reçoit pas de faux repère : il est numéroté à la suite avec le préfixe. Deux nœuds
confondus à la même intersection reçoivent un suffixe, par exemple A1.2.

## Méthodes pour les éléments

- Séquentielle, par type, par proximité des centres, ou en suivant la numérotation des nœuds.
- Une suite de numéros par famille (B001, C001…) ou une suite commune.
- Les extrémités et l'orientation des barres ne sont jamais modifiées.

## Formats d'étiquette

| Jeton | Valeur |
| :--- | :--- |
| `{p}` | préfixe |
| `{n}` | numéro, complété au nombre de chiffres choisi |
| `{g}` | repère de grille (nœuds) |
| `{l}` | numéro de couche ou de niveau |

Exemples : `{p}{n}` donne N001 ; `{g}` donne A1 ; `{p}{l}-{n}` donne N2-01.

## Prévisualiser puis appliquer

1. Réglez la méthode et le format.
2. Cliquez sur **Prévisualiser** : l'onglet **Aperçu** liste les étiquettes actuelles et nouvelles. Le modèle
   n'est pas modifié.
3. Cliquez sur **Appliquer**. Les paramètres sont enregistrés dans le projet ; **Ctrl+Z** annule la
   renumérotation.

TSA refuse d'appliquer une numérotation qui produirait deux étiquettes identiques. La portée **Entités
sélectionnées** ne renumérote que la sélection. Par défaut, les étiquettes saisies à la main sont conservées.

## Méthodes indisponibles

| Méthode | Raison |
| :--- | :--- |
| Par sous-modèle ou groupe | TSA ne gère pas encore de groupes |
| Orientées maillage | TSA ne génère pas encore de maillage éléments finis |

Elles apparaissent dans la liste avec la mention « indisponible ».

> [!NOTE]
> Il n'existe pas encore de mode automatique : les nouvelles entités reçoivent l'étiquette historique
> (N012, B004…) jusqu'à la prochaine renumérotation.
