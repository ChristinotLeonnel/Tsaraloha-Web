import type { DocCategory } from './types';

// Ordre et titres des catégories ; les pages sont découvertes dans src/content/docs/<langue>/<catégorie>/.
export const docCategories: DocCategory[] = [
  {
    id: 'getting-started',
    order: 1,
    title: { fr: 'Bien démarrer', en: 'Getting started' },
    description: {
      fr: 'Installation, premier projet, fichiers et interface.',
      en: 'Installation, first project, files and interface.',
    },
  },
  {
    id: 'modeling',
    order: 2,
    title: { fr: 'Modélisation', en: 'Modeling' },
    description: {
      fr: 'Nœuds, barres, surfaces, sections, grilles, sélection et outils.',
      en: 'Nodes, members, surfaces, sections, grids, selection and tools.',
    },
  },
  {
    id: 'loading',
    order: 3,
    title: { fr: 'Charges et cas de charge', en: 'Loads and load cases' },
    description: {
      fr: 'Charges nodales, sur barres, cas, combinaisons et poids propre.',
      en: 'Nodal and member loads, cases, combinations and self-weight.',
    },
  },
  {
    id: 'mesh',
    order: 4,
    title: { fr: 'Maillage', en: 'Meshing' },
    description: {
      fr: 'État du maillage dans TSA et estimation des éléments finis.',
      en: 'Meshing status in TSA and finite element estimate.',
    },
  },
  {
    id: 'analysis',
    order: 5,
    title: { fr: 'Analyse structurelle', en: 'Structural analysis' },
    description: {
      fr: 'Préparation du modèle, moteurs de calcul, paramètres et validation.',
      en: 'Model preparation, analysis engines, settings and validation.',
    },
  },
  {
    id: 'results',
    order: 6,
    title: { fr: 'Résultats et rapports', en: 'Results and reports' },
    description: {
      fr: 'Déformée, diagrammes, tableaux et note de calcul.',
      en: 'Deformed shape, diagrams, tables and calculation report.',
    },
  },
  {
    id: 'bim',
    order: 7,
    title: { fr: 'BIM et interopérabilité', en: 'BIM and interoperability' },
    description: {
      fr: 'Identifiants, propriétés, import et export IFC.',
      en: 'Identifiers, properties, IFC import and export.',
    },
  },
  {
    id: 'troubleshooting',
    order: 8,
    title: { fr: 'Dépannage', en: 'Troubleshooting' },
    description: {
      fr: 'Problèmes courants, messages d’erreur et signalement de bugs.',
      en: 'Common problems, error messages and bug reports.',
    },
  },
];

export const categoryById = (id: string): DocCategory | undefined => docCategories.find((c) => c.id === id);
