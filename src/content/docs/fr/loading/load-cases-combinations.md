---
title: Cas de charge et combinaisons
description: Organiser les charges par cas et définir les combinaisons ELU et ELS.
order: 7
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [cas de charge, combinaison, elu, els, load case, combination]
helpIds: [loading.cases]
---
## Cas de charge

La fenêtre **Cas de charges et combinaisons** liste les cas avec leur catégorie :

| Catégorie | Symbole |
| :--- | :--- |
| Permanente | G |
| Exploitation | Q |
| Vent | W |
| Neige | S |
| Séisme | E |
| Température | T |
| Accidentelle | A |

Le bouton de réinitialisation recrée les cas G, Q, W, S et E proposés par défaut.

## Combinaisons

Une combinaison associe un coefficient à chaque cas, par exemple 1,35 G + 1,5 Q. Types proposés :

- ELU fondamental, accidentel et sismique ;
- ELS caractéristique, fréquent et quasi permanent ;
- combinaison personnalisée.

> [!WARNING]
> TSA ne choisit pas les coefficients à votre place selon une norme. Vérifiez-les pour votre projet.
