---
title: Importer et exporter un maillage
description: Formats d'échange du maillage et outil en ligne de commande tsa-mesh.
order: 6
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [exporter le maillage, importer un maillage, msh, vtk, unv, abaqus, nastran, tsa-mesh]
helpIds: []
---
## Exporter

**Exporter…** (panneau **Paramètres du maillage**) écrit le maillage du projet dans l'un de ces formats :

| Format | Extension |
| :--- | :--- |
| Gmsh | `.msh` (groupes physiques compris) |
| VTK | `.vtk` |
| I-DEAS universel | `.unv` |
| Abaqus | `.inp` |
| Nastran | `.bdf` |
| Medit | `.mesh` |

## Importer

**Importer…** lit un maillage dans l'un des formats lus par Gmsh. Les étiquettes d'origine des nœuds et des éléments
sont conservées et affichées dans les propriétés. Chaque groupe physique devient un groupe de TSA ; un élément peut
appartenir à plusieurs groupes.

> [!NOTE]
> Un maillage importé n'est transmis au calcul que s'il correspond aux objets du modèle (groupes nommés B1, C2,
> SL1…). Un élément invalide est écarté de l'affichage et signalé dans **Inspection du maillage**.

## Ligne de commande

L'outil `tsa-mesh`, livré avec TSA, maille un projet avec les paramètres qu'il contient :

```text
tsa-mesh <projet.tsa | modèle.tsa3d> <sortie.msh> [taille globale m] [--3d] [--quads] [--order2]
```

Le format de sortie est déduit de l'extension. Codes de sortie : 0 succès, 1 échec, 2 usage incorrect.

## Voir aussi

- [Paramètres et génération](/docs/mesh/generation)
