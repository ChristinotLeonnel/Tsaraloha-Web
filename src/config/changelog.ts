import { ChangelogItem } from '../types';

export const changelogItems: ChangelogItem[] = [
  {
    version: '0.1.0-dev',
    releaseType: 'development',
    date: '2026-10-12',
    titleEn: 'Development Milestone — Shell Analysis, Scientific Validation & Multi-Project Workspace',
    titleFr: 'Jalon de Développement — Calcul des Coques, Validation Scientifique & Espace Multi-Projets',
    addedEn: [
      'Slabs and walls analysed as OpenSees shells (ShellMITC4, ShellDKGT) with openings, line edge supports and uniform, zone, varying or point surface loads; linear static and modal analysis.',
      'Shell results on the mesh (resultants N, M, V and principal values) and a surface elements chapter in the calculation report.',
      'Scientific validation bank: 27 reference cases, 144 checks against analytical solutions, all passing (OpenSees 3.8.0).',
      'Multi-project tabs: each project fully independent; same file names told apart by folder; drag and drop opens a new tab.',
      'Copy and paste between projects: footings, dimensions, supports, loads with load cases and combinations; optional merging of coincident nodes with support conflict detection; one undo step, no partial paste.',
      'Separate display scales (camera, deformed shape, diagrams, text, load arrows) and saved display profiles.',
      'MCP automation (Claude Code): stable document identifier, list of open documents, explicit refusal of any command aimed at a non-active document.',
    ],
    addedFr: [
      'Dalles et voiles calculés en coques OpenSees (ShellMITC4, ShellDKGT) avec ouvertures, appuis linéiques de bord et charges surfaciques uniformes, sur zone, variables ou ponctuelles ; calcul statique linéaire et modal.',
      'Résultats des coques sur le maillage (résultantes N, M, V et valeurs principales) et chapitre « Éléments surfaciques » dans la note de calcul.',
      'Banc de validation scientifique : 27 cas de référence, 144 vérifications par rapport à des solutions analytiques, toutes réussies (OpenSees 3.8.0).',
      'Onglets multi-projets : chaque projet est entièrement indépendant ; fichiers homonymes distingués par leur dossier ; un fichier déposé s\'ouvre dans un nouvel onglet.',
      'Copier-coller entre projets : semelles, cotations, appuis, charges avec cas et combinaisons ; fusion optionnelle des nœuds coïncidents avec détection des conflits d\'appuis ; une seule étape d\'annulation, aucun collage partiel.',
      'Échelles d\'affichage séparées (caméra, déformée, diagrammes, textes, flèches de charge) et profils d\'affichage enregistrables.',
      'Automatisation MCP (Claude Code) : identifiant de document stable, liste des documents ouverts, refus explicite de toute commande visant un document qui n\'est pas actif.',
    ],
    changedEn: [
      'Load arrows are proportional to their intensity within each unit family (kN, kN·m, kN/m, kN/m²); physical load values are never altered by the display.',
      'Result legend fixed on screen and showing the analysis displayed (engine, load case or combination, mode or step).',
    ],
    changedFr: [
      'Les flèches de charge sont proportionnelles à leur intensité dans chaque famille d\'unités (kN, kN·m, kN/m, kN/m²) ; l\'affichage ne modifie jamais la valeur physique des charges.',
      'Légende des résultats fixée à l\'écran, indiquant le calcul affiché (moteur, cas ou combinaison, mode ou pas).',
    ],
    fixedEn: [
      'Results of a previous analysis could remain displayed after creating or opening another project.',
      'Section properties, Eurocode 2 and 3 checks and the nonlinear load step corrected after the scientific audit.',
      'Saving keyboard shortcuts no longer fails while another program briefly holds the file open.',
    ],
    fixedFr: [
      'Les résultats d\'un calcul précédent pouvaient rester affichés après la création ou l\'ouverture d\'un autre projet.',
      'Propriétés de sections, vérifications Eurocode 2 et 3 et pas de chargement non linéaire corrigés à la suite de l\'audit scientifique.',
      'L\'enregistrement des raccourcis clavier n\'échoue plus quand un autre programme tient brièvement le fichier ouvert.',
    ],
    knownIssuesEn: [
      'Shells: no second order, buckling, time history, response spectrum or cracking; no reinforcement or punching checks for slabs and walls.',
      'Footings are meshed but not analysed as solids.',
      'MCP commands always act on the active document.',
    ],
    knownIssuesFr: [
      'Coques : pas de second ordre, de flambement, de temporel, de spectre de réponse ni de fissuration ; aucune vérification de ferraillage ni de poinçonnement des dalles et voiles.',
      'Les semelles sont maillées mais pas calculées en volumes.',
      'Les commandes MCP agissent toujours sur le document actif.',
    ],
  },
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
