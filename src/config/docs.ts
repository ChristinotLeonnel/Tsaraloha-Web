import { DocSection } from '../types';

export const docSections: DocSection[] = [
  {
    id: 'getting-started',
    titleEn: 'Getting Started',
    titleFr: 'Prise en main',
    articles: [
      {
        id: 'intro',
        slug: 'introduction',
        category: 'getting-started',
        titleEn: 'Introduction to TSA',
        titleFr: 'Introduction à TSA',
        descriptionEn: 'Discover the architecture and engineering capabilities of Tsaraloha Structural Analysis.',
        descriptionFr: 'Découvrez l\'architecture et les capacités d\'ingénierie de Tsaraloha Structural Analysis.',
        readTime: '4 min',
        contentEn: `### Welcome to Tsaraloha Structural Analysis (TSA)

**TSA (Tsaraloha Structural Analysis)** is a next-generation desktop civil engineering software dedicated to 3D structural modeling, advanced finite element analysis (FEA), and architectural interoperability.

#### Core Philosophy
Modern structural engineering requires three uncompromising qualities:
1. **Mathematical Accuracy**: Direct computational verification using trusted, peer-reviewed finite element solvers (**OpenSees**).
2. **Computational Performance**: Modern **C++20** engineering kernel with native multithreading, modular dynamic libraries (**TSALib**), and hardware-accelerated CAD visualization (**OpenCASCADE Technology**).
3. **Ergonomic Workflow**: Intuitive 3D modeling with parametric WorkPlanes, smart object snapping, and context-aware **Co-Engineering AI** assistance.

#### Architecture at a Glance
The TSA system is strictly layered to separate the structural truth from visualization and solvers:
- **Structural Model (\`src/Model\`)**: The single source of truth containing nodes, elements, boundary conditions, sections, and materials.
- **Geometric Builder (\`src/Geometry\`)**: Algorithmic generation of topological solids and sweeps using OpenCASCADE.
- **3D Viewport (\`src/Viewer\`)**: Hardware-accelerated OpenGL / AIS display pipeline with fast picking and interactive manipulators.
- **Solver Interface (\`src/Solvers\`)**: Seamless translation to OpenSees and external computational engines.`,
        contentFr: `### Bienvenue sur Tsaraloha Structural Analysis (TSA)

**TSA (Tsaraloha Structural Analysis)** est un logiciel desktop de nouvelle génération dédié à la modélisation 3D, au calcul par éléments finis (FEM) et à l'interopérabilité pour le génie civil.

#### Philosophie Centrale
L'ingénierie des structures moderne exige trois qualités fondamentales :
1. **Rigueur Mathématique** : Calculs certifiés et vérifiés à l'aide de moteurs de référence reconnus par la communauté scientifique (**OpenSees**).
2. **Performance de Calcul** : Noyau moderne en **C++20**, bibliothèques dynamiques modulaires (**TSALib**) et moteur graphique CAO industriel (**OpenCASCADE Technology**).
3. **Ergonomie & Productivité** : Environnement de saisie 3D intuitif avec plans de travail orientables, accrochages magnétiques et assistance **Co-Engineering IA**.

#### Architecture Logicielle
TSA repose sur un découpage strict garantissant l'intégrité du modèle :
- **Modèle Structural (\`src/Model\`)** : Source unique de vérité regroupant nœuds, barres, coques, appuis, sections et matériaux.
- **Générateur Géométrique (\`src/Geometry\`)** : Construction géométrique et topologique précise via OpenCASCADE.
- **Visualisation 3D (\`src/Viewer\`)** : Moteur de rendu OpenGL / AIS haute performance avec sélection interactive.
- **Interface Solveur (\`src/Solvers\`)** : Passerelle automatisée vers OpenSees et moteurs de calcul externes.`,
      },
      {
        id: 'installation',
        slug: 'installation-guide',
        category: 'getting-started',
        titleEn: 'Installation & System Setup',
        titleFr: 'Installation & Configuration Système',
        descriptionEn: 'How to install pre-built binaries or compile TSA from source.',
        descriptionFr: 'Comment installer les exécutables ou compiler TSA depuis les sources.',
        readTime: '5 min',
        contentEn: `### System Requirements & Installation

TSA is distributed as portable binaries and as open-source code for compilation.

#### Hardware Prerequisites
- **Operating System**: Windows 10 / 11 (64-bit) or Linux (Ubuntu 22.04+ LTS).
- **Processor**: Intel Core i5/i7 or AMD Ryzen 5/7 (4+ cores recommended).
- **RAM**: 8 GB minimum, 16 GB recommended for medium to large frame models.
- **Graphics Card**: GPU with dedicated OpenGL 3.3+ support (NVIDIA, AMD, or modern Intel Iris Xe).

#### Compiling from Source (Developers)
For developers wishing to contribute or test pre-release builds:

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis.git
cd Tsaraloha-Structural-Analysis

# 2. Configure build with Ninja debug preset
cmake --preset ninja-debug

# 3. Compile the core engine and tests
cmake --build --preset ninja-debug -- -k 0
\`\`\`

> **Note**: Building TSA requires MSVC v143 (Visual Studio 2022) with C++20 standard, Qt 6.5+, and OpenCASCADE 7.7+.`,
        contentFr: `### Prérequis Système & Installation

TSA est distribué sous forme de binaires autonomes et de code source à compiler.

#### Configuration Matérielle
- **Système d'exploitation** : Windows 10 / 11 (64 bits) ou Linux (Ubuntu 22.04+ LTS).
- **Processeur** : Intel Core i5/i7 ou AMD Ryzen 5/7 (4 cœurs ou plus recommandés).
- **Mémoire Vive (RAM)** : 8 Go minimum, 16 Go recommandés pour les ossatures importantes.
- **Carte Graphique** : GPU supportant OpenGL 3.3+ (NVIDIA, AMD ou Intel Iris Xe).

#### Compilation depuis les Sources
Pour les développeurs et chercheurs souhaitant tester les versions en développement :

\`\`\`bash
# 1. Cloner le dépôt
git clone https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis.git
cd Tsaraloha-Structural-Analysis

# 2. Configurer avec le preset Ninja
cmake --preset ninja-debug

# 3. Compiler le logiciel et la suite de tests
cmake --build --preset ninja-debug -- -k 0
\`\`\`

> **Remarque** : La compilation requiert le compilateur MSVC v143 (Visual Studio 2022) en C++20, Qt 6.5+ et OpenCASCADE 7.7+.`,
      },
    ],
  },
  {
    id: 'modeling-guide',
    titleEn: 'Structural Modeling',
    titleFr: 'Modélisation Structurale',
    articles: [
      {
        id: 'first-model',
        slug: 'creating-first-model',
        category: 'modeling-guide',
        titleEn: 'Creating Your First 3D Frame',
        titleFr: 'Créer Votre Premier Portique 3D',
        descriptionEn: 'Step-by-step guide to generating nodes, columns, beams, and fixed base supports.',
        descriptionFr: 'Guide pas à pas pour générer les nœuds, poteaux, poutres et appuis encastrés.',
        readTime: '6 min',
        contentEn: `### Creating a Multi-Story 3D Portal Frame

Let us construct a standard portal frame step by step:

#### Step 1: Define Spatial Nodes
In the modeling ribbon, activate the **Add Node** tool or type coordinates into the command prompt:
- Node 1: \`(0.0, 0.0, 0.0)\`
- Node 2: \`(6.0, 0.0, 0.0)\`
- Node 3: \`(0.0, 0.0, 3.5)\`
- Node 4: \`(6.0, 0.0, 3.5)\`

#### Step 2: Draw Columns and Beams
- Connect **Node 1 to Node 3** using a column element (e.g., European section \`HEA 240\` or RC Rectangular \`300x300 mm\`).
- Connect **Node 2 to Node 4** using the same column profile.
- Connect **Node 3 to Node 4** with a horizontal beam element (e.g., \`IPE 300\`).

#### Step 3: Apply Boundary Restraints
- Select base nodes (Node 1 and Node 2).
- In the **Properties Panel**, assign **Fixed Support** (Restraints: \`Ux=1, Uy=1, Uz=1, Rx=1, Ry=1, Rz=1\`).

#### Step 4: Add Gravity & Lateral Loads
- Create a load case \`Dead Load (DL)\` with automatic self-weight multiplier.
- Apply a uniform line load on beam 3-4: \`qz = -25.0 kN/m\`.
- Add a lateral wind load at Node 3: \`Fx = +15.0 kN\`.`,
        contentFr: `### Création d'un Portique Spatial 3D

Construisons un portique standard étape par étape :

#### Étape 1 : Définir les Nœuds Structuraux
Dans le ruban de modélisation, activez l'outil **Nouveau Nœud** ou saisissez les coordonnées dans la console :
- Nœud 1 : \`(0.0, 0.0, 0.0)\`
- Nœud 2 : \`(6.0, 0.0, 0.0)\`
- Nœud 3 : \`(0.0, 0.0, 3.5)\`
- Nœud 4 : \`(6.0, 0.0, 3.5)\`

#### Étape 2 : Dessiner les Poteaux et Poutres
- Reliez le **Nœud 1 au Nœud 3** avec un poteau (ex. profilé métallique \`HEA 240\` ou béton armé \`300x300 mm\`).
- Reliez le **Nœud 2 au Nœud 4** avec la même section.
- Reliez le **Nœud 3 au Nœud 4** avec une poutre horizontale (ex. \`IPE 300\`).

#### Étape 3 : Appliquer les Conditions d'Appuis
- Sélectionnez les nœuds de base (Nœud 1 et Nœud 2).
- Dans le **Panneau Propriétés**, assignez un **Appui Encastré** (Bloquer \`Ux, Uy, Uz, Rx, Ry, Rz\`).

#### Étape 4 : Définir les Cas de Charges
- Créez un cas de charge \`Charges Permanentes (G)\` avec prise en compte automatique du poids propre.
- Appliquez une charge linéique uniforme sur la poutre 3-4 : \`qz = -25.0 kN/m\`.
- Appliquez une force latérale de vent au Nœud 3 : \`Fx = +15.0 kN\`.`,
      },
      {
        id: 'sections-materials',
        slug: 'sections-and-materials',
        category: 'modeling-guide',
        titleEn: 'Cross-Sections & Material Libraries',
        titleFr: 'Sections Transversales & Matériaux',
        descriptionEn: 'Configuring standard steel shapes, reinforced concrete, and custom TSALib catalogs.',
        descriptionFr: 'Configuration des profilés acier, béton armé et catalogues personnalisés TSALib.',
        readTime: '5 min',
        contentEn: `### Cross-Sections & Materials Architecture

TSA provides a centralized section and material engine in \`src/Model/Section.h\`.

#### Supported Section Geometries
- **Parametric Rectangular & Circular**: Solid concrete columns, pile caps, and timber beams.
- **European Standard Steel Profiles**: IPE, HEA, HEB, HEM, UPN, Equal and Unequal Angles (L).
- **Hollow Structural Sections**: Rectangular Hollow Sections (RHS), Square Hollow Sections (SHS), and Circular Pipes (CHS).

#### Constitutive Material Properties
Each material defined in the model stores:
- **Modulus of Elasticity (E)**: e.g., $E = 210\\text{ GPa}$ (Structural Steel), $E = 33\\text{ GPa}$ (C30/37 Concrete).
- **Poisson's Ratio (ν)**: Typically $\\nu = 0.3$ (Steel), $\\nu = 0.2$ (Concrete).
- **Density (ρ)**: Self-weight gravity computation ($7850\\text{ kg/m}^3$ for steel, $2500\\text{ kg/m}^3$ for reinforced concrete).
- **Yield Strength (fy / fck)**: Used in code verification envelopes.`,
        contentFr: `### Gestion des Sections et Matériaux

TSA intègre un moteur unifié de sections et matériaux situé dans \`src/Model/Section.h\`.

#### Géométries de Sections Prises en Charge
- **Sections Rectangulaires & Circulaires** : Poteaux béton armé, poutres bois, micropieux.
- **Profilés Acier Normalisés** : IPE, HEA, HEB, HEM, UPN, Cornières égales et inégales (L).
- **Profils Creux** : Tubes rectangulaires, carrés et circulaires sans soudure.

#### Caractéristiques Élastiques des Matériaux
Chaque matériau du modèle comporte les grandeurs physiques fondamentales :
- **Module d'Young ($E$)** : ex. $E = 210\\text{ GPa}$ (Acier de construction), $E = 33\\text{ GPa}$ (Béton C30/37).
- **Coefficient de Poisson ($\\nu$)** : $\\nu = 0.3$ (Acier), $\\nu = 0.2$ (Béton).
- **Masse volumique ($\\rho$)** : Calcul du poids propre structural ($7850\\text{ kg/m}^3$ acier, $2500\\text{ kg/m}^3$ béton armé).
- **Résistance caractéristique ($f_y$ / $f_{ck}$)** : Exploité pour les ratios de vérification réglementaire.`,
      },
    ],
  },
  {
    id: 'analysis-opensees',
    titleEn: 'Analysis & OpenSees',
    titleFr: 'Analyse & OpenSees',
    articles: [
      {
        id: 'opensees-integration',
        slug: 'opensees-workflow',
        category: 'analysis-opensees',
        titleEn: 'OpenSees Computational Pipeline',
        titleFr: 'Chaîne de Calcul OpenSees',
        descriptionEn: 'How TSA translates physical models into OpenSees analytical representations and extracts results.',
        descriptionFr: 'Comment TSA convertit les modèles physiques en modèles d\'analyse OpenSees et extrait les résultats.',
        readTime: '7 min',
        contentEn: `### The TSA to OpenSees Computational Pipeline

TSA bridges intuitive 3D CAD modeling with the world-renowned scientific solver **OpenSees**.

#### Pipeline Overview

\`\`\`text
TSA Physical Model (Nodes, Beams, Slabs, Loads)
         ↓  [Geometry Discretization & Mesh Generation]
Analytical Elements (1D ElasticBeamColumn, 2D ShellMITC4)
         ↓  [TCL/Python Model Script Generation]
OpenSees Process (Sparse Solver, Newton-Raphson, BandGeneral)
         ↓  [Displacement & Reaction Field Output]
TSA Post-Processing (Bending Moments, Deflections, Equilibrium Verification)
\`\`\`

#### Mathematical Formulation
The global equilibrium equation solved by OpenSees in linear static analysis is:

$$\\mathbf{K} \\mathbf{U} = \\mathbf{F}$$

Where:
- $\\mathbf{K} \\in \\mathbb{R}^{n \\times n}$ is the assembled global structural stiffness matrix.
- $\\mathbf{U} \\in \\mathbb{R}^{n}$ is the vector of unknown nodal generalized displacements (3 translations, 3 rotations per node).
- $\\mathbf{F} \\in \\mathbb{R}^{n}$ is the global vector of equivalent nodal forces combining nodal concentrated loads and distributed element actions.`,
        contentFr: `### La Chaîne de Calcul TSA vers OpenSees

TSA relie la convivialité de la modélisation CAO 3D à la puissance du solveur scientifique international **OpenSees**.

#### Schéma Fonctionnel du Flux

\`\`\`text
Modèle Physique TSA (Nœuds, Poutres, Dalles, Charges)
         ↓  [Discrétisation géométrique & Maillage]
Éléments Analytiques (1D ElasticBeamColumn, 2D ShellMITC4)
         ↓  [Génération du script modèle OpenSees]
Processus OpenSees (Solveur creux, Newton-Raphson, BandGeneral)
         ↓  [Sortie des champs de déplacements et réactions]
Post-Traitement TSA (Diagrammes N-V-M, Flèches, Contrôle d'équilibre)
\`\`\`

#### Formulation Mathématique
L'équation fondamentale d'équilibre statique résolue par le moteur d'éléments finis est :

$$\\mathbf{K} \\mathbf{U} = \\mathbf{F}$$

Où :
- $\\mathbf{K}$ représente la matrice de rigidité globale de la structure.
- $\\mathbf{U}$ est le vecteur des déplacements nodaux inconnus (3 translations, 3 rotations).
- $\\mathbf{F}$ est le vecteur des charges nodales équivalentes et actions extérieures.`,
      },
      {
        id: 'interpreting-results',
        slug: 'understanding-results',
        category: 'analysis-opensees',
        titleEn: 'Interpreting Analysis Results',
        titleFr: 'Interprétation des Résultats d\'Analyse',
        descriptionEn: 'Understanding displacement fields, internal force envelopes, and equilibrium validation checks.',
        descriptionFr: 'Comprendre les champs de déplacement, enveloppes d\'efforts et bilans d\'équilibre statique.',
        readTime: '5 min',
        contentEn: `### Understanding Calculation Outputs

Once the OpenSees solver completes execution, TSA populates several interactive post-processing visualizers:

#### 1. Nodal Displacements {U}
- **Deformed Shape Animation**: The 3D viewport shows the deformed geometry with an adjustable amplification slider (e.g., $10\\times$ to $500\\times$).
- **Extreme Deflection Limits**: Immediate comparison against allowable serviceability limits (e.g., $L / 250$ for total load, $L / 350$ for live load according to Eurocode 3).

#### 2. Internal Force Diagrams
- **Axial Force ($N$)**: Tension (blue) and compression (red) distribution.
- **Shear Forces ($V_y, V_z$)**: Critical shear checks at member ends.
- **Bending Moments ($M_y, M_z$)**: Parabolic bending moment diagrams under distributed transverse loads.

#### 3. Equilibrium Audit (∑F = 0)
TSA automatically computes the sum of all applied loads versus the sum of all support reactions. Any residual force discrepancy greater than $10^{-4}$ triggers an engineering alert.`,
        contentFr: `### Exploitation et Contrôle des Résultats

Dès la fin de l'exécution d'OpenSees, TSA met à disposition plusieurs outils de visualisation graphique :

#### 1. Déplacements Nodaux {U}
- **Déformée Amplifiée** : Visualisation tridimensionnelle de la structure déformée avec facteur d'échelle dynamique réglable ($10\\times$ à $500\\times$).
- **Contrôle des Flèches ELS** : Comparaison automatique avec les tolérances réglementaires (ex. $L/250$ ou $L/350$ selon l'Eurocode 3).

#### 2. Diagrammes des Efforts Internes
- **Effort Normal ($N$)** : Représentation claire des zones en traction (bleu) et compression (rouge).
- **Efforts Tranchants ($V_y, V_z$)** : Localisation des efforts tranchants maximaux aux appuis.
- **Moments Fléchissants ($M_y, M_z$)** : Allure parabolique sous charges réparties et pointes sur appuis continus.

#### 3. Bilan Global d'Équilibre (∑F = 0)
TSA effectue un contrôle automatique de cohérence en comparant la somme des charges appliquées à la somme des réactions d'appuis. Tout résidu non nul supérieur à $10^{-4}$ génère une alerte préventive.`,
      },
    ],
  },
  {
    id: 'faq-section',
    titleEn: 'Troubleshooting & FAQ',
    titleFr: 'Dépannage & FAQ',
    articles: [
      {
        id: 'faq',
        slug: 'frequently-asked-questions',
        category: 'faq-section',
        titleEn: 'Frequently Asked Questions',
        titleFr: 'Foire Aux Questions (FAQ)',
        descriptionEn: 'Answers to common questions regarding TSA licensing, compatibility, and OpenSees.',
        descriptionFr: 'Réponses aux questions courantes sur les licences, la compatibilité et OpenSees.',
        readTime: '4 min',
        contentEn: `### Frequently Asked Questions

#### Q1: Is TSA a cloud application or a desktop software?
**TSA is a native desktop application** developed in C++20 for Windows and Linux. It runs locally on your workstation for maximum speed, security, and confidentiality of structural models.

#### Q2: What is the relationship between TSA and OpenSees?
OpenSees is an open-source finite element framework created at UC Berkeley. TSA uses OpenSees as its core numerical solver for advanced structural calculations while providing a modern, visual 3D CAD modeling interface.

#### Q3: Does the Co-Engineering AI replace the licensed engineer?
**No, absolutely not.** Structural engineering involves public safety and legal responsibility. The TSA Co-Engineering AI is designed strictly as an engineering assistant—helping with drafting, detecting potential model anomalies, and summarizing calculations. All final decisions and approvals belong to the certified professional engineer.

#### Q4: Can I import existing CAD or BIM files?
IFC 4.3 structural interoperability is currently in active specification on the roadmap. DXF coordinate grid imports and tabular CSV coordinates are planned for the upcoming pre-release.`,
        contentFr: `### Foire Aux Questions (FAQ)

#### Q1 : TSA est-il une application Web Cloud ou un logiciel Desktop ?
**TSA est un logiciel desktop natif** développé en C++20 pour Windows et Linux. Il s'exécute localement sur votre poste de travail pour une réactivité maximale et la confidentialité absolue de vos projets d'ouvrages.

#### Q2 : Quel est le lien entre TSA et OpenSees ?
OpenSees est le moteur de calcul par éléments finis développé par l'Université de Californie à Berkeley. TSA l'intègre comme solveur numérique tout en offrant une interface CAO 3D moderne, fluide et accessible.

#### Q3 : L'IA Co-Engineering remplace-t-elle l'ingénieur structure ?
**Absolument pas.** L'ingénierie des structures engage la sécurité des biens et des personnes. L'IA Co-Engineering de TSA intervient exclusivement en tant qu'assistant : aide à la saisie, détection d'anomalies de maillage et aide à la rédaction de synthèses. La responsabilité de conception reste l'apanage exclusif de l'ingénieur diplômé et habilité.

#### Q4 : Puis-je importer des fichiers BIM ou CAO ?
L'interopérabilité BIM IFC 4.3 (Structural Analysis Model) est inscrite à la feuille de route. L'import de grilles DXF et de tableaux de coordonnées CSV sera disponible dès les versions d'évaluation publiques.`,
      },
    ],
  },
];
