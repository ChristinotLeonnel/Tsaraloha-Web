// Ressources officielles de l'identité TSA (public/assets/branding). Seul endroit où leurs chemins sont écrits :
// remplacer un fichier ici suffit à mettre à jour l'en-tête, le pied de page, la documentation et la page 404.
// Les chemins partent de la base du site (BASE_URL) : ils restent valables sur toutes les routes, y compris
// /docs/<catégorie>/<page>, et sous GitHub Pages (/Tsaraloha-Web/).

const base = import.meta.env.BASE_URL;
const asset = (file: string) => `${base}assets/branding/${file}`;

export const brandAssets = {
  /** Tuile sur fond sombre (thème sombre, pied de page). */
  tileDark: asset('TSA.svg'),
  /** Tuile sur fond clair (thème clair). */
  tileLight: asset('TSA_light.svg'),
  /** Glyphe seul, couleurs officielles, fond transparent. */
  glyph: asset('TSA_glyph.svg'),
  /** Glyphe monochrome blanc (fonds foncés unis). */
  glyphWhite: asset('TSA_mono_white.png'),
} as const;

export const brandName = {
  short: 'TSA',
  full: 'Tsaraloha Structural Analysis',
} as const;
