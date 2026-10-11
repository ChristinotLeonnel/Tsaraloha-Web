// Captures d'écran de l'application TSA réelle (tools/ui_tests/demo_screenshots.ps1 du dépôt TSA) sur les trois
// projets de démonstration (TSA_TestSuite --suite=demo). Images : public/images/tsa/screenshots/<id>.webp (1920 px)
// et <id>-960.webp. Aucune retouche autre que le redimensionnement.

import type { Language } from '../types';

const base = import.meta.env.BASE_URL;

export type DemoProjectId = 'pont' | 'hangar' | 'batiment';

export interface Screenshot {
  id: string;
  project: DemoProjectId;
  alt: Record<Language, string>;
  caption: Record<Language, string>;
}

export const SCREENSHOT_WIDTH = 1920;
export const SCREENSHOT_HEIGHT = 1042;

export const screenshotSrc = (id: string) => `${base}images/tsa/screenshots/${id}.webp`;
export const screenshotSrcSet = (id: string) =>
  `${base}images/tsa/screenshots/${id}-960.webp 960w, ${base}images/tsa/screenshots/${id}.webp 1920w`;

export const screenshots: Screenshot[] = [
  {
    id: 'pont-perspective',
    project: 'pont',
    alt: { fr: 'TSA : pont en treillis de trois travées en vue 3D filaire', en: 'TSA: three-span truss bridge in 3D wireframe view' },
    caption: { fr: 'Pont en treillis Warren, 3 travées de 48 m — vue 3D, représentation filaire analytique', en: 'Warren truss bridge, 3 spans of 48 m — 3D view, analytical wireframe display' },
  },
  {
    id: 'pont-elevation',
    project: 'pont',
    alt: { fr: 'TSA : élévation latérale du pont montrant les travées et les piles', en: 'TSA: side elevation of the bridge showing spans and piers' },
    caption: { fr: 'Élévation : culées C0 et C3, piles P1 et P2, niveaux nommés', en: 'Elevation: abutments C0 and C3, piers P1 and P2, named levels' },
  },
  {
    id: 'pont-detail-treillis',
    project: 'pont',
    alt: { fr: 'TSA : vue rapprochée des poutres treillis, des longerons et des contreventements du pont', en: 'TSA: close-up of the bridge trusses, stringers and bracing' },
    caption: { fr: 'Détail : membrures, montants, diagonales, longerons et contreventements', en: 'Detail: chords, posts, diagonals, stringers and bracing' },
  },
  {
    id: 'hangar-perspective',
    project: 'hangar',
    alt: { fr: 'TSA : ossature du hangar métallique en vue 3D filaire', en: 'TSA: steel hangar frame in 3D wireframe view' },
    caption: { fr: 'Hangar 60 × 40 m : 11 portiques à fermes triangulées', en: '60 × 40 m hangar: 11 frames with triangulated trusses' },
  },
  {
    id: 'hangar-portique-pignon',
    project: 'hangar',
    alt: { fr: 'TSA : vue de pignon du hangar montrant la ferme, les poteaux et les lisses', en: 'TSA: gable view of the hangar showing the truss, columns and girts' },
    caption: { fr: 'Portique et ferme Pratt vus en pignon : sol, entrait, sablière, faîtage', en: 'Frame and Pratt truss seen from the gable: ground, tie, eaves, ridge' },
  },
  {
    id: 'hangar-portiques-contreventements',
    project: 'hangar',
    alt: { fr: 'TSA : portiques, pannes et contreventements du hangar', en: 'TSA: hangar frames, purlins and bracing' },
    caption: { fr: 'Portiques, pannes, lisses et palées de stabilité des travées d’extrémité', en: 'Frames, purlins, girts and end-bay bracing' },
  },
  {
    id: 'hangar-sous-toiture',
    project: 'hangar',
    alt: { fr: 'TSA : ossature de toiture du hangar, fermes, pannes et poutres au vent', en: 'TSA: hangar roof structure, trusses, purlins and wind girders' },
    caption: { fr: 'Ossature de toiture : fermes, pannes et poutres au vent (vue orthographique)', en: 'Roof structure: trusses, purlins and wind girders (orthographic view)' },
  },
  {
    id: 'batiment-perspective',
    project: 'batiment',
    alt: { fr: 'TSA : bâtiment R+5 à ossature métallique en vue 3D filaire', en: 'TSA: six-storey steel-frame building in 3D wireframe view' },
    caption: { fr: 'Bâtiment R+5 : trame 5 × 3, niveaux RDC à toiture', en: 'Six-storey building: 5 × 3 grid, ground floor to roof' },
  },
  {
    id: 'batiment-facade',
    project: 'batiment',
    alt: { fr: 'TSA : façade du bâtiment avec axes A à F, niveaux et palée de stabilité', en: 'TSA: building elevation with grid lines A to F, levels and bracing' },
    caption: { fr: 'Façade : axes A à F, niveaux nommés, palée de stabilité en croix', en: 'Elevation: grid lines A to F, named levels, X-braced bay' },
  },
  {
    id: 'batiment-niveaux-escalier',
    project: 'batiment',
    alt: { fr: 'TSA : structure de plusieurs niveaux du bâtiment, poutres principales et secondaires', en: 'TSA: multi-level structure of the building, primary and secondary beams' },
    caption: { fr: 'Plusieurs niveaux : poutres principales et secondaires, poteaux, palées', en: 'Several levels: primary and secondary beams, columns, bracing' },
  },
];

export const screenshotById = (id: string) => screenshots.find((s) => s.id === id)!;

export interface DemoProject {
  id: DemoProjectId;
  file: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  /** Valeurs relevées sur le modèle par la suite de tests de TSA (--suite=demo). */
  nodes: number;
  bars: number;
  supports: number;
  length: number;
  maxDisplacementMm: number;
  cover: string;
}

export const demoProjects: DemoProject[] = [
  {
    id: 'pont',
    file: 'TSA_Demo_Pont_Treillis_3x48m.tsa',
    title: { fr: 'Pont en treillis — 3 × 48 m', en: 'Truss bridge — 3 × 48 m' },
    description: {
      fr: 'Treillis Warren à montants, tablier à pièces de pont et longerons, contreventements inférieur et supérieur, portails, piles en palées métalliques et culées.',
      en: 'Warren truss with posts, deck with floor beams and stringers, lower and upper bracing, portals, steel trestle piers and abutments.',
    },
    nodes: 253,
    bars: 665,
    supports: 14,
    length: 3675,
    maxDisplacementMm: 34.7,
    cover: 'pont-perspective',
  },
  {
    id: 'hangar',
    file: 'TSA_Demo_Hangar_60x40m.tsa',
    title: { fr: 'Hangar métallique — 60 × 40 m', en: 'Steel hangar — 60 × 40 m' },
    description: {
      fr: '11 portiques à fermes triangulées, pannes, lisses, potelets de pignon, poutres au vent et palées de long-pan, portes de 20 × 7,5 m et 12 × 5 m.',
      en: '11 frames with triangulated trusses, purlins, girts, gable posts, roof and wall bracing, 20 × 7.5 m and 12 × 5 m doors.',
    },
    nodes: 514,
    bars: 1209,
    supports: 27,
    length: 4484,
    maxDisplacementMm: 9.2,
    cover: 'hangar-perspective',
  },
  {
    id: 'batiment',
    file: 'TSA_Demo_Batiment_R+5.tsa',
    title: { fr: 'Bâtiment R+5 — ossature métallique', en: 'Six-storey steel-frame building' },
    description: {
      fr: 'Trame 5 × 3, poutres principales et secondaires, palées de stabilité, escalier à volées et paliers, atrium double hauteur, contreventement de toiture et édicule.',
      en: '5 × 3 grid, primary and secondary beams, braced bays, staircase with flights and landings, double-height atrium, roof bracing and penthouse.',
    },
    nodes: 380,
    bars: 798,
    supports: 26,
    length: 3188,
    maxDisplacementMm: 4.5,
    cover: 'batiment-perspective',
  },
];

export const exampleUrl = (file: string) => `${base}examples/${encodeURIComponent(file)}`;
