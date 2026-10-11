// Quatre projets complets réalisés dans TSA (tests 350 à 353 de la suite « demo » du dépôt TSA) : captures de
// l'application réelle (tools/ui_tests/showcase_captures.ps1), valeurs relevées par la suite de tests (calcul ELU
// OpenSees, contrôles), fichiers .tsa et notes de calcul PDF produits par TSA. Rien n'est estimé ni retouché.

import type { Language } from '../types';

const base = import.meta.env.BASE_URL;

export type ShowcaseId = 'ba' | 'mixte' | 'complexe' | 'haubans';

export interface ShowcaseProject {
  id: ShowcaseId;
  file: string;
  noteSimplified: string;
  noteDetailed: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  /** Inventaire du modèle (suite de tests). */
  nodes: number;
  members: number;
  cables: number;
  slabs: number;
  walls: number;
  footings: number;
  /** Résultats du calcul ELU (OpenSees) relevés par la suite de tests. */
  eluLoadKN: number;
  maxDisplacementMm: number;
  maxDisplacementWhere: Record<Language, string>;
  extra: Record<Language, string>;
  limits: Record<Language, string>;
  shots: string[];
}

const NOTES = 'notes/';
export const exampleFileUrl = (file: string) => `${base}examples/${encodeURIComponent(file)}`;
export const noteUrl = (file: string) => `${base}${NOTES}${encodeURIComponent(file)}`;

const commonLimitsFr =
  'Analyse statique linéaire, sans second ordre ni analyse modale. Dalles, voiles et semelles modélisés mais non transmis au calcul (charges reportées sur les poutres).';
const commonLimitsEn =
  'Linear static analysis, no second-order effects or modal analysis. Slabs, walls and footings are modeled but not sent to the solver (their loads are applied to the beams).';

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'ba',
    file: 'TSA_Projet_Batiment_BA_R+4.tsa',
    noteSimplified: 'TSA_Projet_Batiment_BA_R+4_note_simplifiee.pdf',
    noteDetailed: 'TSA_Projet_Batiment_BA_R+4_note_detaillee.pdf',
    title: { fr: 'Bâtiment en béton armé R+4', en: 'Five-storey reinforced concrete building' },
    description: {
      fr: 'Trame 6 × 3 travées : semelles, longrines, poteaux, poutres porteuses et secondaires, dalles de 20 cm, noyau en voiles, escalier dans une trémie, toiture-terrasse.',
      en: '6 × 3 bay grid: footings, ground beams, columns, primary and secondary beams, 20 cm slabs, wall core, staircase in an opening, flat roof.',
    },
    nodes: 224,
    members: 493,
    cables: 0,
    slabs: 86,
    walls: 15,
    footings: 28,
    eluLoadKN: 42208,
    maxDisplacementMm: 5.8,
    maxDisplacementWhere: { fr: 'palier d’escalier', en: 'stair landing' },
    extra: {
      fr: 'Σ réactions = Σ q·L sous Q (5 940 kN) ; flexion des poutres BA vérifiée (EC2).',
      en: 'Σ reactions = Σ q·L under Q (5,940 kN); RC beam bending checked (EC2).',
    },
    limits: { fr: commonLimitsFr, en: commonLimitsEn },
    shots: ['ba-physique', 'ba-aretes', 'ba-resultats', 'ba-contraintes'],
  },
  {
    id: 'mixte',
    file: 'TSA_Projet_Batiment_Mixte_BA_Acier.tsa',
    noteSimplified: 'TSA_Projet_Batiment_Mixte_BA_Acier_note_simplifiee.pdf',
    noteDetailed: 'TSA_Projet_Batiment_Mixte_BA_Acier_note_detaillee.pdf',
    title: { fr: 'Bâtiment mixte béton armé et acier', en: 'Mixed reinforced concrete and steel building' },
    description: {
      fr: 'Poteaux et noyau en béton armé, planchers à solives IPE 400 et poutres en caisson soudé, palées en tubes, grande salle sous fermes Warren de 18 m.',
      en: 'RC columns and core, floors with IPE 400 joists and welded box girders, tubular bracing, large hall under 18 m Warren trusses.',
    },
    nodes: 210,
    members: 426,
    cables: 0,
    slabs: 24,
    walls: 9,
    footings: 15,
    eluLoadKN: 24204,
    maxDisplacementMm: 42.5,
    maxDisplacementWhere: { fr: 'milieu d’une ferme de 18 m', en: 'mid-span of an 18 m truss' },
    extra: {
      fr: 'Dalle sur bac sans action mixte acier-béton ; flambement des barres comprimées vérifié (EC3).',
      en: 'Composite deck without steel-concrete composite action; compressed members checked for buckling (EC3).',
    },
    limits: { fr: commonLimitsFr, en: commonLimitsEn },
    shots: ['mixte-physique', 'mixte-aretes', 'mixte-resultats', 'mixte-contraintes'],
  },
  {
    id: 'complexe',
    file: 'TSA_Projet_Batiment_Complexe_L.tsa',
    noteSimplified: 'TSA_Projet_Batiment_Complexe_L_note_simplifiee.pdf',
    noteDetailed: 'TSA_Projet_Batiment_Complexe_L_note_detaillee.pdf',
    title: { fr: 'Bâtiment complexe en L', en: 'L-shaped complex building' },
    description: {
      fr: 'Aile en béton armé R+4 avec atrium et porte-à-faux de 4 m, aile en acier R+2 à hauteurs d’étage différentes, toiture en arcs polygonaux. Cas G, Q et vent.',
      en: 'Five-storey RC wing with atrium and 4 m cantilever, three-storey steel wing with different storey heights, polygonal arch roof. Dead, live and wind cases.',
    },
    nodes: 227,
    members: 467,
    cables: 0,
    slabs: 49,
    walls: 15,
    footings: 33,
    eluLoadKN: 33061,
    maxDisplacementMm: 19.8,
    maxDisplacementWhere: { fr: 'extrémité du porte-à-faux', en: 'cantilever tip' },
    extra: {
      fr: 'Combinaison ELU 1,35 G + 1,5 Q + 0,9 W ; vent appliqué en charges nodales de façade.',
      en: 'ULS combination 1.35 G + 1.5 Q + 0.9 W; wind applied as façade nodal loads.',
    },
    limits: { fr: commonLimitsFr, en: commonLimitsEn },
    shots: ['complexe-physique', 'complexe-aretes', 'complexe-resultats', 'complexe-contraintes'],
  },
  {
    id: 'haubans',
    file: 'TSA_Projet_Pont_Haubans_80-180-80m.tsa',
    noteSimplified: 'TSA_Projet_Pont_Haubans_80-180-80m_note_simplifiee.pdf',
    noteDetailed: 'TSA_Projet_Pont_Haubans_80-180-80m_note_detaillee.pdf',
    title: { fr: 'Pont à haubans 80 + 180 + 80 m', en: 'Cable-stayed bridge 80 + 180 + 80 m' },
    description: {
      fr: 'Tablier métallique de 20 m (caissons de rive, pièces de pont, contreventement), deux pylônes en H en béton armé, 64 haubans en semi-harpe, piles auxiliaires et culées.',
      en: '20 m steel deck (edge box girders, cross girders, bracing), two RC H-pylons, 64 semi-harp stay cables, auxiliary piers and abutments.',
    },
    nodes: 229,
    members: 504,
    cables: 64,
    slabs: 0,
    walls: 0,
    footings: 4,
    eluLoadKN: 267969,
    maxDisplacementMm: 425.2,
    maxDisplacementWhere: { fr: 'travée centrale', en: 'main span' },
    extra: {
      fr: 'Haubans modélisés comme câbles précontraints : tous tendus sous ELU (1 108 à 3 850 kN, N / Fpk ≤ 0,37).',
      en: 'Stays modeled as prestressed cables: all in tension at ULS (1,108 to 3,850 kN, N / Fpk ≤ 0.37).',
    },
    limits: {
      fr: 'Calcul linéaire : la tension des câbles est contrôlée a posteriori, sans réglage itératif ni non-linéarité géométrique. Fatigue et ancrages non vérifiés.',
      en: 'Linear analysis: cable tension is checked afterwards, without iterative tuning or geometric nonlinearity. Fatigue and anchorages not checked.',
    },
    shots: ['haubans-physique', 'haubans-aretes', 'haubans-resultats', 'haubans-effort-normal'],
  },
];
