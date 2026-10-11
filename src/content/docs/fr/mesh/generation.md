---
title: Paramètres et génération du maillage
description: Régler les tailles, l'ordre et les algorithmes, utiliser les profils, le maillage local, les zones de raffinement et l'aperçu, puis générer le maillage.
order: 2
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [paramètres du maillage, taille, finesse, raffinement, profil, aperçu, gmsh, quadrangle, hexaèdre]
helpIds: []
---
## Ouvrir les paramètres

Ruban **Analyse**, groupe **Discrétisation**, bouton **Paramètres du maillage**. Le panneau propose les commandes
**Estimer**, **Aperçu**, **Générer**, **Régénérer**, **Vérifier la qualité**, **Supprimer**, **Importer** et
**Exporter**.

## Onglet Général

| Réglage | Effet |
| :--- | :--- |
| Dimensions | 1D (barres), 2D (dalles, voiles), 3D (semelles) |
| Taille globale, minimale, maximale | Taille visée des éléments, en mètres |
| Finesse, facteur de raffinement | Multiplient la taille globale (« Fin » : × 0,5) |
| Transition | Croissance de la taille en s'éloignant d'une zone de raffinement |
| Ordre des éléments | Premier ordre, ou second ordre (nœuds milieux : Line3, Tri6, Quad8, Tet10, Hex20) |
| Nœuds caractéristiques | Nœuds aux charges ponctuelles et aux nœuds du modèle situés dans les surfaces |
| Nombre maximal d'éléments | Garde-fou : une génération qui le dépasserait est refusée |

## Onglet Surfaces / volumes

- **Surfaces** : algorithme de Gmsh (automatique, Delaunay, frontal, quadrangles…), maillage **structuré** quand
  la surface a 4 côtés sans ouverture, recombinaison des triangles en quadrangles.
- **Volumes** : tétraèdres, ou hexaèdres pour les volumes à 6 faces (semelles).

Les options que Gmsh ne peut pas appliquer ne sont pas proposées.

## Raffinement

- **Raffinement automatique** autour des appuis, des charges ponctuelles, des changements de section, des
  connexions et des ouvertures.
- **Zones de raffinement** : une taille d'élément dans un rayon autour d'un nœud, d'un point ou d'un contour
  d'ouverture. Le bouton du ruban **Raffinement local autour de la sélection** crée une zone autour des nœuds
  sélectionnés.
- **Maillage local de la sélection** : sélectionnez des barres, dalles, voiles ou semelles, puis donnez-leur
  leurs propres paramètres (taille, nombre de divisions, progression, raffinement aux extrémités…), sans
  modifier les autres objets.

Les ouvertures des dalles (rectangles, cercles) se saisissent avec la commande **Ouvertures de la dalle** et sont
respectées par le maillage.

## Profils

Des profils de départ regroupent des réglages : rapide, standard, fin, très fin, poutres, dalles, voiles, ponts,
volumes hexaédriques ou tétraédriques. Choisissez un profil puis **Appliquer**. **Enregistrer…** crée un profil
personnel, que vous pouvez aussi exporter et importer.

## Aperçu, génération, régénération

- **Estimer** donne un ordre de grandeur du nombre d'éléments ; Gmsh donne le nombre réel à la génération.
- **Aperçu du maillage** affiche le maillage prévu en orange, sans remplacer celui du projet. Un second appel, ou
  une modification du modèle, le retire.
- **Générer le maillage** crée le maillage du projet, l'enregistre et ouvre le contrôle de qualité. La génération
  peut être annulée entre deux étapes (géométrie, 1D, 2D, 3D).
- **Régénérer le maillage** reprend les paramètres enregistrés, par exemple après une modification de la géométrie.

> [!NOTE]
> Les paramètres du maillage ne font pas partie d'Annuler / Rétablir.

## Voir aussi

- [Qualité du maillage](/docs/mesh/quality)
- [Affichage dans la vue 3D](/docs/mesh/display)
