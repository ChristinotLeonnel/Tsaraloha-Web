// Icônes officielles du logiciel TSA (copiées depuis TSA/resources/icons par npm run sync:tsa-assets).
// Chaque entrée indique l'usage réel de l'icône dans l'application : le site ne l'emploie que pour la même fonction.
// Les rubriques sans icône équivalente dans TSA gardent une icône Lucide (navigation.ts), sans être présentées
// comme des icônes officielles.

const base = import.meta.env.BASE_URL;

export const tsaIcons = {
  view3d: { file: 'view/view_3d.svg', usage: 'Vue 3D axonométrique (ruban, onglet Accueil)' },
  fitAll: { file: 'view/fit_all.svg', usage: 'Zoom étendu' },
  beam: { file: 'modeling/draw_beam.svg', usage: 'Dessiner une poutre' },
  column: { file: 'modeling/draw_column.svg', usage: 'Dessiner un poteau' },
  truss: { file: 'modeling/struct_truss.svg', usage: 'Treillis' },
  grid: { file: 'modeling/grid_cartesian.svg', usage: 'Grilles' },
  levels: { file: 'modeling/levels.svg', usage: 'Niveaux' },
  distributedLoad: { file: 'modeling/load_dist.svg', usage: 'Charge répartie' },
  support: { file: 'modeling/support_fixed.svg', usage: 'Appui encastré' },
  move: { file: 'edit/move.svg', usage: 'Déplacer (outils de modification)' },
  analysisRun: { file: 'analysis/analysis_run.svg', usage: 'Lancer le calcul structurel' },
  analysisSettings: { file: 'analysis/analysis_static.svg', usage: 'Analyse (moteur, portée)' },
  mesh: { file: 'analysis/mesh_generate.svg', usage: 'Générer le maillage' },
  displacements: { file: 'analysis/results_disp.svg', usage: 'Déplacements / déformée' },
  moments: { file: 'analysis/results_moment.svg', usage: 'Diagramme des moments' },
  newProject: { file: 'file/file_new.svg', usage: 'Nouveau projet' },
  exportIfc: { file: 'file/file_export.svg', usage: 'Exporter IFC' },
  openProject: { file: 'file/file_open.svg', usage: 'Ouvrir un projet' },
  help: { file: 'common/help.svg', usage: 'Aide' },
  settings: { file: 'common/settings.svg', usage: 'Paramètres' },
  about: { file: 'common/about.svg', usage: 'À propos' },
  section: { file: 'sections/section_i.svg', usage: 'Sections et matériaux' },
} as const;

export type TsaIconKey = keyof typeof tsaIcons;

export const tsaIconUrl = (key: TsaIconKey) => `${base}assets/icons/tsa/${tsaIcons[key].file}`;
