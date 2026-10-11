---
title: Maillage : vue d'ensemble
description: Ce que TSA maille avec Gmsh, le déroulé de la génération et ce que le calcul utilise.
order: 1
status: available
version: 0.1.0
updated: 2026-10-11
keywords: [maillage, mesh, gmsh, éléments finis, discrétisation, coque, volume]
helpIds: [mesh.overview]
---
## Ce qui est maillé

| Objet | Éléments | Utilisé par le calcul |
| :--- | :--- | :--- |
| Poutres, poteaux | segments (Line2, ou Line3 au second ordre) | **oui** : chaque barre est subdivisée aux nœuds du maillage |
| Treillis, câbles | segments | maillés, mais calculés en un seul élément par barre |
| Dalles (avec ouvertures), voiles | triangles et quadrangles (Tri3, Quad4 ; Tri6, Quad8 au second ordre) | non, pas encore |
| Semelles | tétraèdres ou hexaèdres (Tet4, Hex8 ; Tet10, Hex20) | non, pas encore |

Les nœuds du modèle (appuis, nœuds de poteaux, points de charge) sont des sommets du maillage. Une arête commune à deux
objets, par exemple une poutre sur le bord d'une dalle, est maillée une seule fois : les nœuds sont partagés.

## Déroulé

1. Réglez les tailles dans **Paramètres du maillage** (ruban **Analyse**, groupe **Discrétisation**).
2. Facultatif : **Aperçu du maillage** affiche le maillage prévu, en orange, sans l'enregistrer.
3. **Générer le maillage** : Gmsh travaille en arrière-plan, l'interface reste utilisable.
4. Le panneau **Qualité du maillage** s'ouvre et le maillage s'affiche dans la vue 3D.
5. Lancez le calcul : TSA indique ce qui est transmis au moteur et ce qui ne l'est pas.

Après une modification de la géométrie, le maillage est signalé **obsolète** dans la barre d'état et au lancement
du calcul : régénérez-le, calculez sans maillage ou annulez.

## Enregistrement

Les paramètres, le maillage généré et le rapport de génération (version de Gmsh, date, durée, avertissements,
synthèse de qualité) sont enregistrés dans le fichier `.tsa`. À la réouverture, le maillage est restitué
tel quel.

> [!NOTE]
> Une génération sans erreur ne prouve ni la qualité ni la convergence des résultats. Comparez les résultats
> obtenus avec plusieurs finesses de maillage.

## Voir aussi

- [Paramètres et génération](/docs/mesh/generation)
- [Affichage dans la vue 3D](/docs/mesh/display)
- [Maillage et calcul](/docs/mesh/analysis)
