---
title: Présentation de TSA
description: Ce que fait TSA aujourd'hui, ce qui est expérimental et ce qui est prévu.
order: 1
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [présentation, fonctions, état, overview, features]
helpIds: [general.about]
---
TSA permet de dessiner une structure en 3D (nœuds, poutres, poteaux, treillis, câbles), de lui
attribuer sections, matériaux et appuis, de la charger, puis de la calculer avec un moteur d'éléments
finis. Les résultats s'affichent dans la vue 3D, dans des tableaux et dans une note de calcul.

## État des fonctions

| Domaine | État | Remarque |
| :--- | :--- | :--- |
| Modélisation de barres (poutres, poteaux, treillis, câbles) | Disponible | Saisie dans la vue 3D ou par fenêtre |
| Dalles et voiles | Disponible en modélisation | **Non pris en compte dans le calcul** |
| Charges nodales et sur barres | Disponible | Uniforme, trapézoïdale, ponctuelle, couple nodal |
| Charges surfaciques | Prévu | Pas encore de charge sur dalle |
| Cas de charge, combinaisons, poids propre | Disponible | Catégories et combinaisons inspirées de l'EN 1990 |
| Analyse statique linéaire 3D (OpenSees) | Disponible | OpenSees 3.8.0, exécutable externe |
| Analyse statique non linéaire (OpenSees) | Expérimental | Options avancées du moteur |
| Analyse d'ossatures planes (Custom2D) | Expérimental | Portiques et treillis plans |
| Analyse dynamique (modale, temporelle) | Non disponible | Retirée de la version actuelle |
| Maillage éléments finis des surfaces | Prévu | Seule une estimation est proposée |
| Note de calcul PDF et HTML | Disponible | Générée à partir des résultats |
| Import et export IFC | Expérimental | Export partiel |

## Plateforme

TSA fonctionne sous **Windows 10 ou 11, 64 bits**. Aucune version Linux ou macOS n'est publiée.

## Pour aller plus loin

- [Configuration requise](/docs/getting-started/system-requirements)
- [Créer un projet](/docs/getting-started/create-project)
- [Premier modèle pas à pas](/docs/getting-started/first-model)
