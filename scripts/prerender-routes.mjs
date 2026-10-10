// Après la construction (npm run build) : une copie de dist/index.html par route, avec titre,
// description et adresse canonique propres. GitHub Pages sert alors chaque adresse directement
// (code 200, référencement), au lieu de passer par la redirection de 404.html. Écrit aussi
// dist/sitemap.xml avec des adresses propres.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { root, loadPages, appRoutes, deployment } from './docs-lib.mjs';

const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const siteUrl = deployment.siteUrl.replace(/\/+$/, '');
const suffix = 'TSA — Tsaraloha Structural Analysis';

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pageMeta = {
  '/features': ['Fonctionnalités', 'Fonctions de TSA et état de chacune : disponible, expérimental ou prévu.'],
  '/analysis': ['Analyse & OpenSees', 'Analyse structurelle dans TSA avec le moteur OpenSees.'],
  '/bim': ['BIM & CAO', 'Interopérabilité BIM de TSA : identifiants, propriétés et IFC.'],
  '/co-engineering': ['Co-Engineering IA', 'Assistance par intelligence artificielle dans TSA.'],
  '/docs': ['Documentation', 'Guide d’utilisation de TSA : modélisation, charges, analyse, résultats et dépannage.'],
  '/pricing': ['Prix', 'Éditions de TSA.'],
  '/licensing': ['Licences', 'Licences de TSA et des composants tiers.'],
  '/downloads': ['Téléchargements', 'Versions de TSA et configuration requise.'],
  '/roadmap': ['Feuille de route', 'Jalons de développement de TSA.'],
  '/changelog': ['Changelog', 'Historique des versions de TSA.'],
  '/about': ['À propos', 'À propos de Tsaraloha Structural Analysis.'],
  '/support': ['Support', 'Aide sur TSA : documentation, questions fréquentes et signalement de bugs.'],
};

const routes = new Map();
for (const r of appRoutes()) if (r !== '/') routes.set(r, pageMeta[r] ?? [r.slice(1), '']);
for (const p of loadPages()) {
  if (!p.valid || p.language !== 'fr') continue;
  routes.set(p.path, [`${p.data.title} — Documentation`, p.data.description ?? '']);
}

function render(route, title, description) {
  let html = template;
  const url = `${siteUrl}${route}`;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(`${title} | ${suffix}`)}</title>`);
  if (description)
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(description)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(title)}$2`);
  return html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
}

let count = 0;
for (const [route, [title, description]] of routes) {
  const folder = join(dist, ...route.split('/').filter(Boolean));
  mkdirSync(folder, { recursive: true });
  const target = join(folder, 'index.html');
  if (existsSync(target) && target !== join(dist, 'index.html')) {
    // Une route ne doit pas écraser un fichier de public/.
    const existing = readFileSync(target, 'utf8');
    if (!existing.includes('<div id="root">')) throw new Error(`${target} existe déjà et n'est pas une page de l'application`);
  }
  writeFileSync(target, render(route, title, description));
  count++;
}

// Page d'accueil : adresse canonique.
writeFileSync(join(dist, 'index.html'), template.replace('</head>', `    <link rel="canonical" href="${siteUrl}/" />\n  </head>`));

const today = new Date().toISOString().slice(0, 10);
const urls = ['/', ...routes.keys()].map((route) => {
  const priority = route === '/' ? '1.0' : route.startsWith('/docs') ? '0.7' : '0.8';
  return `  <url>\n    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
});
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
console.log(`${count} pages de route écrites, sitemap.xml : ${urls.length} adresses (${siteUrl})`);
