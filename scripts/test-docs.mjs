// Tests de la documentation (npm run test:docs), sans dépendance supplémentaire : Vite charge les
// modules TypeScript du site (import.meta.glob compris) ; React les rend en HTML côté serveur.
// Couvre le catalogue (routes, repli de langue, navigation), la recherche (synonymes, accents) et la
// sûreté du rendu Markdown. Si dist/ existe, vérifie aussi les pages de route et le plan du site.

import { createServer } from 'vite';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { root, deployment } from './docs-lib.mjs';

let passed = 0;
const failures = [];
const check = (name, condition, detail = '') => {
  if (condition) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' });
try {
  const catalog = await vite.ssrLoadModule('/src/docs/catalog.ts');
  const search = await vite.ssrLoadModule('/src/docs/search.ts');
  const categories = await vite.ssrLoadModule('/src/docs/categories.ts');
  const md = await vite.ssrLoadModule('/src/docs/Markdown.tsx');
  const fm = await vite.ssrLoadModule('/src/docs/frontmatter.ts');

  // ── Catalogue ──
  const frPages = catalog.allDocPages.filter((p) => p.language === 'fr');
  check('catalogue : pages chargées', frPages.length >= 40, `${frPages.length} pages fr`);
  for (const cat of categories.docCategories)
    check(`catégorie ${cat.id} : page d'accueil`, !!catalog.findPage(`/docs/${cat.id}`, 'fr'));
  const exact = catalog.findPage('/docs/loading/distributed-loads', 'fr');
  check('findPage : page française', exact && !exact.fallback && exact.page.title === 'Charges réparties');
  const fallback = catalog.findPage('/docs/loading/distributed-loads', 'en');
  check('findPage : repli en → fr signalé', fallback && fallback.fallback === true && fallback.page.language === 'fr');
  const translated = catalog.findPage('/docs/getting-started/introduction', 'en');
  check('findPage : page anglaise sans repli', translated && !translated.fallback && translated.page.language === 'en');
  check('findPage : barre oblique finale tolérée', !!catalog.findPage('/docs/modeling/nodes/', 'fr'));
  check('findPage : route inconnue', catalog.findPage('/docs/inexistant/page', 'fr') === undefined);
  const nav = catalog.navigationPages('fr');
  check('navigation : chemins uniques', new Set(nav.map((p) => p.path)).size === nav.length);
  const first = catalog.neighbours(nav[0].path, 'fr');
  const last = catalog.neighbours(nav[nav.length - 1].path, 'fr');
  check('précédent / suivant : bornes', !first.previous && !!first.next && !!last.previous && !last.next);
  check('catalogue : états valides', frPages.every((p) => ['available', 'experimental', 'planned'].includes(p.status)));
  check('catalogue : surfaces signalées comme non calculées', /pas pris en compte par le calcul/.test(catalog.findPage('/docs/modeling/surfaces', 'fr').page.body));

  // ── En-tête ──
  const parsed = fm.parseFrontmatter('---\r\ntitle: "Essai"\r\norder: 3\r\nkeywords: [a, b]\r\n---\r\nTexte');
  check('en-tête : texte, nombre, liste, CRLF', parsed.data.title === 'Essai' && parsed.data.order === 3 && parsed.data.keywords.join() === 'a,b' && parsed.body === 'Texte');
  check('en-tête : absent', fm.parseFrontmatter('# Titre').body === '# Titre');

  // ── Recherche ──
  const top = (q, lang = 'fr') => search.searchDocs(q, lang).map((h) => h.page.path);
  check('recherche : « charge répartie »', top('charge répartie')[0] === '/docs/loading/distributed-loads', top('charge répartie').slice(0, 3).join(' '));
  check('recherche : sans accents', top('charge repartie')[0] === '/docs/loading/distributed-loads');
  check('recherche : synonyme anglais « distributed load »', top('distributed load').includes('/docs/loading/distributed-loads'));
  check('recherche : « Ctrl+clic »', top('ctrl clic').includes('/docs/modeling/selection'));
  check('recherche : « IFC »', top('IFC')[0] === '/docs/bim/ifc');
  check('recherche : « opensees »', top('opensees').includes('/docs/analysis/engines'));
  check('recherche : « note de calcul »', top('note de calcul')[0] === '/docs/results/calculation-report');
  check('recherche : « poids propre »', top('poids propre')[0] === '/docs/loading/self-weight');
  check('recherche : terme inconnu', top('zzzxqw').length === 0);
  check('recherche : requête trop courte', top('a').length === 0);
  check('recherche : anglais avec repli', top('IFC', 'en').includes('/docs/bim/ifc'));

  // ── Rendu Markdown ──
  const render = (source) => renderToStaticMarkup(React.createElement(md.Markdown, { source }));
  const hostile = render('<script>alert(1)</script>\n\n[x](javascript:alert(1)) <img src=x onerror=alert(1)>');
  check('Markdown : balises échappées', !hostile.includes('<script') && !hostile.includes('<img') && hostile.includes('&lt;script&gt;'));
  check('Markdown : lien javascript: neutralisé', !hostile.includes('href="javascript'));
  const ext = render('[OpenSees](https://opensees.berkeley.edu/) et [non sûr](http://exemple.test)');
  check('Markdown : lien HTTPS externe', ext.includes('href="https://opensees.berkeley.edu/"') && ext.includes('rel="noopener noreferrer"'));
  check('Markdown : lien HTTP refusé', !ext.includes('href="http://'));
  const rich = render('## Mon Titre éé\n\n| a | b |\n| :--- | :--- |\n| 1 | 2 |\n\n> [!WARNING]\n> Attention\n\n- un\n- deux\n\n1. premier');
  check('Markdown : intertitre avec ancre', rich.includes('<h2 id="mon-titre-ee"'));
  check('Markdown : tableau, encadré, listes', rich.includes('<table') && rich.includes('role="note"') && rich.includes('<ul') && rich.includes('<ol'));
  const toc = md.extractToc('## A\n```\n## pas un titre\n```\n### B');
  check('sommaire : ignore les blocs de code', toc.length === 2 && toc[1].level === 3);
} finally {
  await vite.close();
}

// ── Construction (si dist/ existe) ──
const dist = join(root, 'dist');
if (existsSync(join(dist, 'index.html'))) {
  for (const route of ['docs', 'docs/loading/distributed-loads', 'docs/troubleshooting', 'support', 'downloads']) {
    const file = join(dist, ...route.split('/'), 'index.html');
    const ok = existsSync(file) && readFileSync(file, 'utf8').includes('<div id="root">');
    check(`construction : /${route} servi directement`, ok);
  }
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  check('plan du site : adresses propres', sitemap.includes(`${deployment.siteUrl}/docs/modeling/selection</loc>`) && !sitemap.includes('?/'));
  check('construction : 404.html présent', existsSync(join(dist, '404.html')));
} else {
  console.warn('avertissement : dist/ absent, tests de construction ignorés (lancer npm run build).');
}

for (const f of failures) console.error(`ÉCHEC : ${f}`);
console.log(`${passed} réussi(s), ${failures.length} échec(s)`);
process.exit(failures.length ? 1 : 0);
