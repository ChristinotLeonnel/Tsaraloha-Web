import { ChangelogItem } from '../types';

export const changelogItems: ChangelogItem[] = [
  {
    version: '0.1.0-dev',
    releaseType: 'development',
    date: '2026-10-04',
    titleEn: 'Internal Development Milestone — 3D Kernel & OpenSees Bridge',
    titleFr: 'Jalon de Développement Interne — Noyau 3D & Passerelle OpenSees',
    addedEn: [
      'Core structural object model (Nodes, Beams, Columns, Slabs, Walls, Foundations, Cables, Trusses).',
      'OpenCASCADE Technology (OCCT) 3D graphics viewport with AIS presentation and interactive navigation.',
      'OpenSees finite element solver translation engine for linear static frames.',
      'Comprehensive Cross-Section library (Rectangular, Circular, IPE, HEA, HEB, UPN, Angle, TSection, Box, Pipe).',
      'Dynamic TSALib extension system for hot-reloading section catalogs and material laws.',
      'Parametric WorkPlanes and 3D coordinate grids with magnetic snapping.',
      'Undo/Redo architecture using command pattern and state snapshot restoration.',
    ],
    addedFr: [
      'Modèle objet structural complet (Nœuds, Poutres, Poteaux, Dalles, Voiles, Fondations, Câbles, Treillis).',
      'Viewport graphique 3D OpenCASCADE Technology (OCCT) avec présentation AIS et navigation interactive.',
      'Moteur de traduction vers le solveur d\'éléments finis OpenSees pour portiques statiques linéaires.',
      'Bibliothèque complète de sections transversales (Rectangulaire, Circulaire, IPE, HEA, HEB, UPN, Cornières, T, Caissons, Tubes).',
      'Système d\'extensions dynamiques TSALib pour le rechargement à chaud de sections et lois de comportement.',
      'Plans de travail paramétriques (WorkPlanes) et grilles de coordonnées 3D avec accrochage magnétique.',
      'Architecture Undo/Redo complète par commandes et restauration de snapshots d\'état.',
    ],
    changedEn: [
      'Refactored CMake build configuration with optimized Ninja presets and precompiled headers (PCH).',
      'Separated core modeling kernel (TSA_Core OBJECT library) from UI and visualization targets.',
    ],
    changedFr: [
      'Refonte de la configuration de compilation CMake avec presets Ninja optimisés et en-têtes précompilés (PCH).',
      'Séparation stricte du noyau de modélisation (bibliothèque TSA_Core) des cibles UI et visualisation.',
    ],
    fixedEn: [
      'Resolved circular column 3D sweep meshing orientation in OpenCASCADE builder.',
      'Corrected MSVC localized /showIncludes header dependency scanning under UTF-8 console encoding.',
    ],
    fixedFr: [
      'Correction de l\'orientation de l\'extrusion 3D des poteaux circulaires dans le constructeur OpenCASCADE.',
      'Correction de la détection des dépendances d\'en-têtes MSVC /showIncludes en encodage console UTF-8.',
    ],
    knownIssuesEn: [
      'Automated 2D shell meshing for non-convex slab geometries is in active beta testing.',
      'BIM IFC 4.3 structural import is currently in specification and scheduled for v0.2.0.',
    ],
    knownIssuesFr: [
      'Le maillage automatique des dalles coques de géométrie non convexe est en cours de validation bêta.',
      'L\'import/export BIM IFC 4.3 structural est en cours de spécification pour la version v0.2.0.',
    ],
  },
];
