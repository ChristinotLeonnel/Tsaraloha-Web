// Copie les ressources graphiques officielles du logiciel TSA dans le site (npm run sync:tsa-assets).
// Source unique : le dépôt du logiciel (../TSA par défaut, ou TSA_ROOT). Aucun fichier n'est redessiné :
//   - logo et variantes (resources/icons/TSA*.svg|png|ico, ceux qu'utilise l'application) → public/assets/branding/
//   - favicon (copie exacte de TSA.svg)                                                  → public/favicon.svg
//   - icônes d'application (resources/icons/png/TSA_app_*.png)                           → public/assets/branding/
//   - icônes métier réellement affichées par l'application (ruban, menus)                → public/assets/icons/tsa/
//   - projets de démonstration examples/*.tsa et notes examples/notes/*.pdf                → public/examples/, public/notes/
// Les anciennes copies (public/assets/icons/*.svg, versions antérieures) sont supprimées pour qu'il n'existe qu'une
// copie de chaque ressource. Code de sortie 1 si une ressource attendue manque dans TSA.

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tsa = resolve(process.env.TSA_ROOT ?? join(site, '..', 'TSA'));
const icons = join(tsa, 'resources', 'icons');
if (!existsSync(icons)) {
  console.error(`Ressources TSA introuvables : ${icons} (définir TSA_ROOT)`);
  process.exit(1);
}

const branding = ['TSA.svg', 'TSA_light.svg', 'TSA_glyph.svg', 'TSA_monochrome.svg', 'TSA.ico', 'TSA_dark.png', 'TSA_light.png',
  'TSA_glyph.png', 'TSA_mono_dark.png', 'TSA_mono_white.png'];
const appIcons = ['TSA_app_32x32.png', 'TSA_app_128x128.png', 'TSA_app_256x256.png', 'TSA_app_512x512.png', 'TSA_app_1024x1024.png'];
// Icônes métier : chemin dans resources/icons, tel que référencé par l'application (voir src/config/tsaIcons.ts).
const appUiIcons = ['view/view_3d.svg', 'view/fit_all.svg', 'modeling/draw_beam.svg', 'modeling/draw_column.svg', 'modeling/struct_truss.svg',
  'modeling/grid_cartesian.svg', 'modeling/levels.svg', 'modeling/load_dist.svg', 'modeling/support_fixed.svg', 'edit/move.svg',
  'analysis/analysis_run.svg', 'analysis/analysis_static.svg', 'analysis/mesh_generate.svg', 'analysis/results_disp.svg',
  'analysis/results_moment.svg', 'file/file_new.svg', 'file/file_export.svg', 'file/file_open.svg', 'common/help.svg',
  'common/settings.svg', 'common/about.svg', 'sections/section_i.svg'];

let copied = 0;
const missing = [];
const copy = (from, to) => {
  if (!existsSync(from)) {
    missing.push(from);
    return;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied++;
};

for (const f of branding) copy(join(icons, f), join(site, 'public', 'assets', 'branding', f));
copy(join(icons, 'TSA.svg'), join(site, 'public', 'favicon.svg'));
for (const f of appIcons) copy(join(icons, 'png', f), join(site, 'public', 'assets', 'branding', f));

// Anciennes copies d'icônes (racine de public/assets/icons) : remplacées par public/assets/icons/tsa/
const legacy = join(site, 'public', 'assets', 'icons');
if (existsSync(legacy))
  for (const f of readdirSync(legacy)) {
    const p = join(legacy, f);
    if (statSync(p).isFile()) rmSync(p);
  }
for (const f of appUiIcons) copy(join(icons, f), join(legacy, 'tsa', f));

// Projets de démonstration (.tsa) et notes de calcul PDF produits par la suite « demo » de TSA (examples/)
const examples = join(tsa, 'examples');
if (existsSync(examples)) {
  for (const f of readdirSync(examples)) if (f.endsWith('.tsa')) copy(join(examples, f), join(site, 'public', 'examples', f));
  const notes = join(examples, 'notes');
  if (existsSync(notes)) for (const f of readdirSync(notes)) if (f.endsWith('.pdf')) copy(join(notes, f), join(site, 'public', 'notes', f));
} else missing.push(examples);

console.log(`${copied} ressource(s) copiée(s) depuis ${tsa}`);
if (missing.length) {
  console.error(`Manquantes :\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
