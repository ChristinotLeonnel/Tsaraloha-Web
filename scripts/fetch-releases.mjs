// Avant la construction : lit les GitHub Releases du dépôt public de diffusion de chaque logiciel (releaseRepo de
// src/config/products.json ; le code source, lui, est dans un dépôt privé) et écrit
// src/generated/releases.json, seule source des pages de téléchargement. Une version n'est retenue que si son archive
// porte le nom attendu, si la version du nom correspond à l'étiquette et si son empreinte SHA-256 figure dans le fichier
// d'empreintes publié avec elle (recoupée avec l'empreinte calculée par GitHub quand l'API la donne). Rien n'est inventé :
// sans réponse de GitHub, les données précédentes sont gardées et marquées « non actualisées ».
//
// GITHUB_TOKEN (facultatif, côté serveur seulement) relève la limite de débit de l'API. --strict : échec si GitHub ne
// répond pas (déploiement), au lieu de garder les données précédentes (construction locale hors ligne).
// RELEASES_OUT : autre fichier de sortie (tests).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(join(root, 'src/config/products.json'), 'utf8'));
const target = process.env.RELEASES_OUT ?? join(root, 'src/generated/releases.json');
const strict = process.argv.includes('--strict');

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'tsaraloha-web-build', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

/**
 * Canal de diffusion d'une version publiée : 'stable', 'prerelease', 'experimental', ou null pour l'écarter du site.
 * `release` est l'objet de l'API GitHub (tag_name, name, prerelease, body…).
 */
function classifyChannel(release) {
  // Étiquette au format semver (v0.1.0, v0.2.0-rc.1) ; toute autre étiquette (test, demo) reste hors du site.
  const m = release.tag_name.match(/^v?\d+\.\d+\.\d+(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  const suffix = (m[1] ?? '').toLowerCase();
  // Les indices se cumulent dans le sens prudent : un signe d'instabilité rétrograde, aucun ne promeut.
  if (/^(alpha|nightly|dev|exp|snapshot)/.test(suffix)) return 'experimental';
  if (suffix || release.prerelease) return 'prerelease';
  return 'stable';
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': headers['User-Agent'] } });
  if (!res.ok) throw new Error(`${url} : HTTP ${res.status}`);
  return res.text();
}

/** « <64 hex>  <nom> » par ligne (format de sha256sum et de Get-FileHash converti). */
function parseChecksums(text) {
  const sums = new Map();
  for (const line of text.split(/\r?\n/)) {
    const m = line.trim().match(/^([0-9a-fA-F]{64})\s+\*?(.+)$/);
    if (m) sums.set(m[2].trim(), m[1].toLowerCase());
  }
  return sums;
}

async function readRelease(product, release, problems) {
  const channel = classifyChannel(release);
  if (!channel) return null;
  const pattern = new RegExp(product.assetPattern);
  const tagVersion = release.tag_name.replace(/^v/, '');
  const sumsAsset = release.assets.find((a) => a.name === config.checksumsAsset);
  const candidates = release.assets.filter((a) => pattern.test(a.name));
  if (!candidates.length) return null;
  if (!sumsAsset) {
    problems.push(`${product.id} ${release.tag_name} : ${config.checksumsAsset} absent, version écartée`);
    return null;
  }
  const sums = parseChecksums(await getText(sumsAsset.browser_download_url));
  const assets = [];
  for (const a of candidates) {
    const { version, kind } = a.name.match(pattern).groups;
    const sha256 = sums.get(a.name);
    const githubDigest = a.digest?.startsWith('sha256:') ? a.digest.slice(7) : null;
    if (version !== tagVersion) problems.push(`${product.id} ${a.name} : version ${version} ≠ étiquette ${release.tag_name}`);
    else if (!sha256) problems.push(`${product.id} ${a.name} : empreinte absente de ${config.checksumsAsset}`);
    else if (githubDigest && githubDigest !== sha256) problems.push(`${product.id} ${a.name} : empreinte publiée ≠ empreinte calculée par GitHub`);
    else if (a.size < 1024 * 1024) problems.push(`${product.id} ${a.name} : archive de ${a.size} octets, version écartée`);
    else assets.push({ name: a.name, size: a.size, url: a.browser_download_url, sha256, os: 'windows', arch: 'x64', format: kind === '.zip' ? 'portable-zip' : 'installer', downloads: a.download_count });
  }
  if (!assets.length) return null;
  assets.sort((x, y) => (x.format === 'installer' ? 0 : 1) - (y.format === 'installer' ? 0 : 1));
  return {
    tag: release.tag_name,
    version: tagVersion,
    channel,
    title: release.name || release.tag_name,
    publishedAt: release.published_at,
    notes: release.body ?? '',
    pageUrl: release.html_url,
    checksumsUrl: sumsAsset.browser_download_url,
    assets,
  };
}

const previous = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : { products: {} };
const output = { generatedAt: new Date().toISOString(), products: {} };
let failed = false;

for (const product of config.products) {
  const problems = [];
  try {
    // 404 : dépôt de diffusion absent (ou non public) — réponse certaine, « aucune version publiée », et non panne.
    const res = await fetch(`https://api.github.com/repos/${product.releaseRepo}/releases?per_page=30`, { headers });
    if (res.status === 404) problems.push(`${product.id} : dépôt ${product.releaseRepo} introuvable ou non public, aucune version affichée`);
    else if (!res.ok) throw new Error(`${product.releaseRepo} : HTTP ${res.status}`);
    const list = res.status === 404 ? [] : await res.json();
    const releases = [];
    for (const r of list.filter((r) => !r.draft)) {
      const entry = await readRelease(product, r, problems);
      if (entry) releases.push(entry);
    }
    releases.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    output.products[product.id] = { repo: product.releaseRepo, checkedAt: output.generatedAt, stale: false, releases };
    console.log(`${product.id} : ${releases.length} version(s) retenue(s) sur ${list.length} publiée(s)`);
  } catch (err) {
    failed = true;
    console.warn(`${product.id} : GitHub injoignable (${err.message})`);
    const kept = previous.products[product.id];
    output.products[product.id] = kept ? { ...kept, stale: true } : { repo: product.releaseRepo, checkedAt: null, stale: true, releases: [] };
  }
  for (const p of problems) console.warn(`  écarté — ${p}`);
}

if (failed && strict) {
  console.error('fetch-releases --strict : données de version non actualisées, construction arrêtée');
  process.exit(1);
}
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);
