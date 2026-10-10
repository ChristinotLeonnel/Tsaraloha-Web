---
title: Import et export IFC
description: Formats pris en charge et limites connues.
order: 2
status: experimental
version: 0.1.0
updated: 2026-10-10
keywords: [ifc, import, export, bim, ifc4]
helpIds: [bim.ifc]
---
## Export

**Fichier > Exporter IFC** écrit un fichier **IFC 4.3** avec les produits physiques, le modèle
analytique, les matériaux, les profils et les jeux de propriétés.

## Import

**Fichier > Importer IFC** crée un projet depuis un fichier **IFC2X3**, **IFC4** ou **IFC4X3**.

## Limites connues

- Les charges, cas et combinaisons ne sont pas exportés.
- Les relâchements d'extrémité et les excentrements ne sont pas exportés.
- Les grilles ne sont pas exportées.
- À l'import, certaines représentations et les barres courbes sont ignorées et signalées.
