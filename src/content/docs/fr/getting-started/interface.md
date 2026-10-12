---
title: L'interface de TSA
description: Ruban, vue 3D, panneaux, console et navigation dans la vue.
order: 6
status: available
version: 0.1.0
updated: 2026-10-12
keywords: [interface, ruban, vue 3d, navigation, raccourcis, onglets, copier-coller, profils, ribbon, ui]
helpIds: [ui.overview, ui.shortcuts]
---
## Zones de l'écran

| Zone | Rôle |
| :--- | :--- |
| Ruban | Onglets Accueil, Modèle, Structure, Charges, Analyse, Résultats, Modifier, Affichage, Outils |
| Vue 3D | Dessin, sélection et visualisation des résultats |
| Arbre du modèle | Liste des objets par famille |
| Propriétés | Données de l'objet sélectionné (touche `P`) |
| Console | Journal et saisie de commandes textuelles |

## Navigation dans la vue 3D

| Action | Effet |
| :--- | :--- |
| Molette | Zoom centré sur le curseur |
| Bouton central enfoncé | Rotation de la vue |
| `Maj` + bouton central | Déplacement panoramique |
| `F` | Cadrer tout le modèle |
| `Maj+F` | Cadrer la sélection |
| `Num 7`, `Num 1`, `Num 3`, `Num 5` | Vues de dessus, de face, de gauche, isométrique |

## Plusieurs projets (onglets)

Chaque projet ouvert a son onglet. Les projets sont indépendants : modèle, historique, maillage, résultats et vue
appartiennent à leur onglet, et un calcul n'apparaît jamais dans un autre projet.

| Action | Effet |
| :--- | :--- |
| `Ctrl+N`, `Ctrl+O`, glisser-déposer d'un fichier `.tsa` | ouvre le projet dans un nouvel onglet ; un fichier déjà ouvert active son onglet |
| `Ctrl+Tab`, `Ctrl+Maj+Tab` | onglet suivant, précédent |
| `Ctrl+W` ou croix de l'onglet | ferme le projet, avec confirmation s'il est modifié (« ● » dans l'onglet) |
| Clic droit sur un onglet | enregistrer, fermer les autres, copier le chemin, ouvrir le dossier |

## Copier-coller entre projets

| Raccourci | Effet |
| :--- | :--- |
| `Ctrl+C`, `Ctrl+X` | copie (ou coupe) la sélection |
| `Ctrl+V` | colle au point désigné dans la vue |
| `Ctrl+Maj+V` | colle aux coordonnées d'origine |

**Édition > Options du presse-papier** règle ce qui est copié (appuis, charges avec leurs cas et combinaisons) et
la fusion des nœuds coïncidents, avec sa tolérance. Un conflit d'appuis est toujours soumis à l'utilisateur. Le
collage est tout ou rien et s'annule en une seule fois. Les résultats ne sont jamais copiés.

## Échelles et profils d'affichage

- **Affichage > Échelle des annotations** : taille des textes, constante à l'écran ou liée au modèle.
- **Affichage > Échelle des charges** : flèches proportionnelles, automatiques ou normalisées.
- **Panneau Résultats** : amplification de la déformée et échelle des diagrammes, réglées séparément.
- **Affichage > Profils d'affichage** : Modélisation, Charges, Maillage, Résultats, Déformées, Analyse modale,
  Présentation, ou un profil enregistré.

Ces réglages ne changent que la représentation : une charge de 100 kN reste égale à 100 kN.

## Thème et plein écran

- `Ctrl+T` alterne entre les thèmes clair et sombre.
- `F11` passe en plein écran.

## Aide

- **Aide > Documentation en ligne** ouvre ce site.
- `F1` affiche la liste des raccourcis dans TSA.
