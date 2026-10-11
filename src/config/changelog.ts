import { ChangelogItem } from '../types';

export const changelogItems: ChangelogItem[] = [
  {
    version: '0.1.0-dev',
    releaseType: 'development',
    date: '2026-10-11',
    titleEn: 'Development Milestone — Gmsh Meshing & 3D Mesh Display',
    titleFr: 'Jalon de Développement — Maillage Gmsh & Affichage 3D du Maillage',
    addedEn: [
      'Finite element meshing with Gmsh 4.15: members, slabs with openings, walls and footings, first or second order.',
      'Mesh settings panel: sizes, algorithms, structured meshing, local settings, refinement zones and mesh profiles.',
      'Mesh quality control (minSICN, aspect ratio, angles, Jacobian, interfaces) with problems located in the 3D view.',
      'Mesh display in the TSA 3D view: wireframe, faces and edges, faces, shrunk elements, transparency, labels, 1D/2D/3D filters, group isolation and cut.',
      'Node and element picking with properties, including the original Gmsh tags, in the new Mesh inspection panel.',
      'Member displacements shown on the mesh: colours, legend, deformed shape and animation; nodes without a computed value stay grey.',
      'Mesh import and export (msh, vtk, unv, inp, bdf, mesh) and the tsa-mesh command-line tool.',
    ],
    addedFr: [
      'Maillage éléments finis avec Gmsh 4.15 : barres, dalles avec ouvertures, voiles et semelles, au premier ou au second ordre.',
      'Panneau Paramètres du maillage : tailles, algorithmes, maillage structuré, paramètres locaux, zones de raffinement et profils.',
      'Contrôle de qualité du maillage (minSICN, rapport d\'aspect, angles, jacobien, interfaces) avec localisation des problèmes dans la vue 3D.',
      'Affichage du maillage dans la vue 3D de TSA : filaire, faces et arêtes, faces, éléments réduits, transparence, numéros, filtres 1D/2D/3D, isolation de groupes et coupe.',
      'Sélection de nœuds et d\'éléments avec leurs propriétés, dont les étiquettes Gmsh d\'origine, dans le nouveau panneau Inspection du maillage.',
      'Déplacements des barres affichés sur le maillage : couleurs, légende, déformée et animation ; les nœuds sans valeur calculée restent gris.',
      'Import et export du maillage (msh, vtk, unv, inp, bdf, mesh) et outil en ligne de commande tsa-mesh.',
    ],
    changedEn: [
      'Members are subdivided at the mesh nodes for the analysis, with loads and self-weight distributed exactly.',
      'Project file format 1.8: mesh, mesh settings and generation report are saved in the project.',
    ],
    changedFr: [
      'Les barres sont subdivisées aux nœuds du maillage pour le calcul, avec une répartition exacte des charges et du poids propre.',
      'Format de fichier 1.8 : le maillage, ses paramètres et le rapport de génération sont enregistrés dans le projet.',
    ],
    knownIssuesEn: [
      'Slabs, walls and footings are meshed but not yet analysed: only member elements are sent to OpenSees.',
      'Surface loads are not yet applied to the analysis.',
    ],
    knownIssuesFr: [
      'Les dalles, voiles et semelles sont maillés mais pas encore calculés : seuls les éléments des barres sont transmis à OpenSees.',
      'Les charges surfaciques ne sont pas encore appliquées au calcul.',
    ],
  },
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
