// Vérification de la documentation (npm run check:docs) : en-têtes, pages vides, liens internes,
// identifiants d'aide et correspondance avec le registre d'aide de TSA. Code de sortie 1 en cas d'erreur.

import { loadPages, appRoutes, tsaHelpTopics, categories, statuses } from './docs-lib.mjs';

const errors = [];
const warnings = [];
const pages = loadPages();
const fr = pages.filter((p) => p.language === 'fr');
const docPaths = new Set(['/docs', ...pages.filter((p) => p.valid).map((p) => p.path)]);
const routes = new Set([...appRoutes(), ...docPaths]);

for (const p of pages) {
  const where = `src/content/docs/${p.file}`;
  if (!p.valid) {
    errors.push(`${where} : emplacement invalide (attendu <fr|en>/<catégorie>/<page>.md, minuscules et tirets)`);
    continue;
  }
  if (!categories.includes(p.category)) errors.push(`${where} : catégorie inconnue « ${p.category} »`);
  if (!p.hasHeader) errors.push(`${where} : en-tête « --- » manquant`);
  for (const key of ['title', 'description', 'status', 'version', 'updated'])
    if (!p.data[key]) errors.push(`${where} : champ « ${key} » manquant`);
  if (p.data.status && !statuses.includes(p.data.status))
    errors.push(`${where} : état « ${p.data.status} » invalide (${statuses.join(', ')})`);
  if (p.data.updated && !/^\d{4}-\d{2}-\d{2}$/.test(p.data.updated))
    errors.push(`${where} : date « ${p.data.updated} » invalide (AAAA-MM-JJ)`);
  if (p.data.version && !/^\d+\.\d+\.\d+$/.test(p.data.version))
    errors.push(`${where} : version « ${p.data.version} » invalide`);
  if (p.body.trim().length < 40) errors.push(`${where} : page vide ou presque`);
  if (p.language === 'en' && !fr.some((f) => f.path === p.path))
    errors.push(`${where} : page anglaise sans page française correspondante`);

  // Liens internes et externes
  let inCode = false;
  p.body.split('\n').forEach((line, i) => {
    if (line.startsWith('```')) inCode = !inCode;
    if (inCode) return;
    for (const m of line.replace(/`[^`]*`/g, '').matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = m[1];
      if (href.startsWith('/')) {
        const target = href.split('#')[0].replace(/\/+$/, '') || '/';
        if (!routes.has(target)) errors.push(`${where}:${i + 1} : lien interne cassé « ${href} »`);
      } else if (href.startsWith('http://')) {
        errors.push(`${where}:${i + 1} : lien non sécurisé « ${href} » (HTTPS requis)`);
      } else if (!href.startsWith('https://') && !href.startsWith('#')) {
        errors.push(`${where}:${i + 1} : lien relatif « ${href} » (utiliser /docs/…)`);
      }
    }
  });
}

// Identifiants d'aide : uniques, rattachés à une seule page française.
const helpOwners = new Map();
for (const p of fr) {
  for (const id of p.data.helpIds ?? []) {
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(id)) errors.push(`${p.file} : identifiant d'aide « ${id} » mal formé`);
    if (helpOwners.has(id)) errors.push(`${p.file} : identifiant d'aide « ${id} » déjà utilisé par ${helpOwners.get(id).file}`);
    else helpOwners.set(id, p);
  }
}
for (const p of pages.filter((x) => x.language === 'en')) {
  const frPage = fr.find((f) => f.path === p.path);
  const a = [...(p.data.helpIds ?? [])].sort().join(',');
  const b = [...(frPage?.data.helpIds ?? [])].sort().join(',');
  if (frPage && a !== b) errors.push(`${p.file} : identifiants d'aide différents de la page française`);
}

// Registre d'aide de TSA (dépôt voisin) : chaque identifiant doit mener à une page existante.
const registry = tsaHelpTopics();
if (!registry) {
  warnings.push('Registre d’aide de TSA introuvable (../TSA/src/Help/HelpTopics.cpp) : correspondance non vérifiée.');
} else {
  const seen = new Set();
  for (const { id, path } of registry.topics) {
    if (seen.has(id)) errors.push(`HelpTopics.cpp : identifiant « ${id} » en double`);
    seen.add(id);
    if (!docPaths.has(path)) errors.push(`HelpTopics.cpp : « ${id} » → ${path} : page inexistante`);
    const owner = helpOwners.get(id);
    if (path !== '/docs' && owner && owner.path !== path)
      errors.push(`HelpTopics.cpp : « ${id} » → ${path}, mais la page ${owner.file} déclare cet identifiant`);
    if (path !== '/docs' && !owner)
      warnings.push(`HelpTopics.cpp : « ${id} » → ${path} : la page ne déclare pas cet identifiant (helpIds)`);
  }
  for (const id of helpOwners.keys())
    if (!seen.has(id)) errors.push(`Identifiant d'aide « ${id} » déclaré par ${helpOwners.get(id).file} mais absent de HelpTopics.cpp`);
  if (registry.topics.length === 0) errors.push('HelpTopics.cpp : aucune entrée reconnue');
}

for (const w of warnings) console.warn(`avertissement : ${w}`);
for (const e of errors) console.error(`erreur : ${e}`);
const enCount = pages.filter((p) => p.language === 'en').length;
console.log(
  `${pages.length} pages (${fr.length} fr, ${enCount} en), ${helpOwners.size} identifiants d'aide` +
    (registry ? `, ${registry.topics.length} entrées dans le registre de TSA` : '') +
    ` — ${errors.length} erreur(s), ${warnings.length} avertissement(s)`,
);
process.exit(errors.length ? 1 : 0);
