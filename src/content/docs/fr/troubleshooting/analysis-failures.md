---
title: Échecs de calcul
description: Le calcul échoue ou donne des résultats incohérents.
order: 4
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [échec, erreur, singulière, instable, analysis failure]
helpIds: []
---
| Message ou symptôme | Cause probable |
| :--- | :--- |
| Matrice singulière | structure instable ou appuis insuffisants |
| Aucun degré de liberté libre | tous les nœuds sont bloqués |
| OpenSees introuvable | moteur absent : acceptez le téléchargement |
| Dalles exclues | les surfaces ne sont pas calculées |
| Déplacements énormes | section, matériau ou unité erronés |

Le journal détaillé du calcul se trouve dans la console.
