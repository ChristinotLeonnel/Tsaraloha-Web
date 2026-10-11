---
title: Afficher le maillage dans la vue 3D
description: Modes d'affichage, filtres, isolation de groupes, coupe, étiquettes, sélection de nœuds et d'éléments et déplacements sur le maillage.
order: 4
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [affichage du maillage, filaire, faces, éléments réduits, coupe, isoler, étiquettes, inspection, déformée]
helpIds: []
---
## Afficher ou masquer

Le maillage s'affiche dans la **même vue 3D** que le modèle : navigation, cadrage, accrochage et sélection du modèle
restent inchangés. Le bouton **Afficher le maillage** (ruban **Analyse**, groupe **Discrétisation**) le montre ou le
masque ; il est activé automatiquement après une génération.

Toutes les commandes ci-dessous sont dans le menu du bouton **Affichage du maillage**, à côté.

## Modes d'affichage

| Commande | Résultat |
| :--- | :--- |
| Filaire | Arêtes seules |
| Faces et arêtes | Faces des éléments et arêtes (mode par défaut) |
| Faces seules | Faces sans arêtes |
| Éléments réduits | Chaque élément réduit autour de son centre, pour contrôler la connectivité |
| Arêtes du maillage | Affiche ou masque les arêtes |
| Faces transparentes | Faces semi-transparentes |
| Nœuds du maillage, Taille des nœuds… | Marqueurs des nœuds et leur taille |
| Épaisseur des traits… | Épaisseur des arêtes et des éléments 1D |
| Numéros des nœuds, Numéros des éléments | Identifiants affichés (au plus 1000 de chaque, répartis sur tout le maillage) |

Une arête partagée par plusieurs éléments n'est tracée qu'une fois.

## Géométrie et maillage

- **Maillage seul (masquer la géométrie)** masque barres, dalles, voiles, semelles et nœuds du modèle, puis les
  rétablit quand vous décochez la commande.
- Pour voir la géométrie seule, décochez **Afficher le maillage**.

## Filtres, groupes et volumes

- **Éléments 1D**, **Éléments 2D**, **Éléments 3D** : affichent ou masquent chaque dimension.
- **Isoler des groupes…** n'affiche que les groupes choisis : un objet maillé (B1, SL1, F2…) ou un groupe physique
  Gmsh. **Afficher tous les groupes** annule l'isolation.
- Les volumes sont représentés par leurs **faces extérieures**. **Faces intérieures des volumes** affiche aussi les
  faces partagées entre volumes.
- **Coupe du maillage…** masque les éléments situés au-delà d'un plan normal à X, Y ou Z. Les faces ainsi exposées
  sont affichées : la coupe montre l'intérieur du maillage.

## Sélection et propriétés

1. Activez **Sélection dans le maillage** : le panneau **Inspection du maillage** s'ouvre.
2. Cliquez un nœud ou un élément dans la vue 3D. Le survol indique déjà l'entité visée.

| Entité | Propriétés affichées |
| :--- | :--- |
| Élément | Identifiant, type et ordre, nœuds, étiquette et entité Gmsh, objet d'origine, groupes, qualité |
| Nœud | Identifiant, coordonnées, nœud du modèle confondu, étiquette Gmsh, objet d'origine, groupes, déplacement |

Hors de ce mode, le maillage n'interfère pas avec la sélection du modèle. **Cadrer sur le maillage** ajuste la vue
au maillage affiché.

Le panneau **Inspection du maillage** résume aussi l'affichage : nombres de nœuds et d'éléments par dimension,
arêtes tracées, faces extérieures et intérieures des volumes, filtres actifs, et éléments écartés de l'affichage
avec leur motif (par exemple un nombre de nœuds incorrect dans un maillage importé).

## Déplacements sur le maillage

Après un calcul, **Déplacements sur le maillage** colore le maillage selon la norme du déplacement, avec une
légende, et affiche la forme déformée par-dessus la forme initiale (en gris).

- Aux nœuds du modèle : valeurs calculées par le moteur.
- Le long des barres : valeurs interpolées entre les points de calcul du moteur.
- Dalles, voiles et semelles : **aucune valeur** (nœuds en gris), car ils ne sont pas encore calculés. TSA
  n'invente aucune valeur.

**Facteur de déformation…** règle l'amplification (0 : automatique). **Animer la déformée** fait osciller la
forme déformée.

## Voir aussi

- [Qualité du maillage](/docs/mesh/quality)
- [Maillage et calcul](/docs/mesh/analysis)
- [Diagrammes et déformée](/docs/results/diagrams-deformed)
