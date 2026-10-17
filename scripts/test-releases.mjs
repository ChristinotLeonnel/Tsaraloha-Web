// Tests de scripts/fetch-releases.mjs sans réseau : fetch est remplacé par des réponses de l'API GitHub simulées,
// puis on vérifie quelles versions sont retenues ou écartées, et pourquoi. Dépôt de diffusion commun à TSA et
// TSALab : le produit est désigné par l'étiquette (tsa-v…, tsalab-v…).

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = pathToFileURL(join(root, 'scripts/fetch-releases.mjs')).href;
const sha = (c) => c.repeat(64);
const MB = 1024 * 1024;

const asset = (name, size, digest) => ({ name, size, browser_download_url: `https://dl.test/${name}`, digest, download_count: 0 });
let day = 10;
const release = (tag, assets, extra = {}) => ({
  tag_name: tag, name: tag, draft: false, prerelease: false, published_at: `2026-10-${day++}T00:00:00Z`,
  body: 'notes', html_url: `https://github.test/${tag}`, assets: [...assets, asset('SHA256SUMS.txt', 300)], ...extra,
});

const sums = [
  `${sha('a')}  TSA-0.2.0-windows-x64.zip`,
  `${sha('9')}  TSA-0.2.0-windows-x64-setup.exe`,
  `${sha('b')}  TSA-0.3.0-rc.1-windows-x64.zip`,
  `${sha('c')}  TSA-0.4.0-windows-x64.zip`,
  `${sha('d')}  TSA-0.5.0-windows-x64.zip`,
  `${sha('e')}  TSA-9.9.9-windows-x64.zip`,
  `${sha('1')}  TSALab-0.1.0-windows-x64-setup.exe`,
].join('\n');

const listing = [
  release('tsa-v0.2.0', [asset('TSA-0.2.0-windows-x64.zip', 80 * MB, `sha256:${sha('a')}`), asset('TSA-0.2.0-windows-x64-setup.exe', 70 * MB)]), // retenue, stable
  release('tsa-v0.3.0-rc.1', [asset('TSA-0.3.0-rc.1-windows-x64.zip', 80 * MB)]),                         // retenue, préversion
  release('tsa-v0.4.0', [asset('TSA-0.4.0-windows-x64.zip', 80 * MB, `sha256:${sha('f')}`)]),              // empreinte ≠ GitHub
  release('tsa-v0.5.0', [asset('TSA-0.5.0-windows-x64.zip', 10)]),                                        // archive vide
  release('tsa-v0.6.0', [asset('TSA-9.9.9-windows-x64.zip', 80 * MB)]),                                   // version ≠ étiquette
  release('tsa-v0.7.0', [asset('TSA-0.7.0-windows-x64.zip', 80 * MB)]),                                   // empreinte absente
  release('tsa-demo', [asset('TSA-0.2.0-windows-x64.zip', 80 * MB)]),                                     // étiquette non semver
  release('v0.2.0', [asset('TSA-0.2.0-windows-x64.zip', 80 * MB)]),                                       // sans préfixe de produit
  release('tsa-v0.8.0', [asset('TSA-0.8.0-windows-x64.zip', 80 * MB)], { draft: true }),                  // brouillon
  release('tsalab-v0.1.0', [asset('TSALab-0.1.0-windows-x64-setup.exe', 60 * MB)]),                       // TSALab, stable
];

let mode = 'ok';
let listCalls = 0;
globalThis.fetch = async (url) => {
  if (url.includes('/Setup-Livrable/releases')) {
    listCalls++;
    if (mode === 'down') throw new Error('réseau simulé indisponible');
    if (mode === '404') return { ok: false, status: 404 };
    return { ok: true, status: 200, json: async () => listing };
  }
  if (url === 'https://dl.test/SHA256SUMS.txt') return { ok: true, status: 200, text: async () => sums };
  return { ok: false, status: 404 };
};

const dir = mkdtempSync(join(tmpdir(), 'tsa-releases-'));
const warnings = [];
console.warn = (m) => warnings.push(String(m));
async function run(name, previous) {
  const out = join(dir, `${name}.json`);
  if (previous) writeFileSync(out, JSON.stringify(previous));
  process.env.RELEASES_OUT = out;
  mode = name;
  listCalls = 0;
  await import(`${script}?${name}`);
  return JSON.parse(readFileSync(out, 'utf8'));
}

let failures = 0;
const check = (label, ok) => {
  console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${label}`);
  if (!ok) failures++;
};

const result = await run('ok');
const tsa = result.products.tsa;
const lab = result.products.tsalab;
check('une seule requête pour les deux logiciels', listCalls === 1);
check('deux versions TSA retenues', tsa.releases.length === 2);
check('la plus récente en premier', tsa.releases[0]?.tag === 'tsa-v0.3.0-rc.1');
const v020 = tsa.releases.find((r) => r.tag === 'tsa-v0.2.0');
check('tsa-v0.2.0 stable, version 0.2.0 : installateur puis archive, empreintes de SHA256SUMS',
  v020?.channel === 'stable' && v020.version === '0.2.0' && v020.assets.map((a) => a.format).join() === 'installer,portable-zip'
  && v020.assets[0].sha256 === sha('9') && v020.assets[1].sha256 === sha('a'));
check('tsa-v0.3.0-rc.1 préversion', tsa.releases.find((r) => r.tag === 'tsa-v0.3.0-rc.1')?.channel === 'prerelease');
check('URL directe du fichier publié', tsa.releases[0]?.assets[0].url === 'https://dl.test/TSA-0.3.0-rc.1-windows-x64.zip');
check('empreinte contredite par GitHub écartée', warnings.some((w) => w.includes('0.4.0') && w.includes('calculée par GitHub')));
check('archive vide écartée', warnings.some((w) => w.includes('0.5.0') && w.includes('octets')));
check('version du nom ≠ étiquette écartée', warnings.some((w) => w.includes('9.9.9') && w.includes('étiquette')));
check('empreinte absente écartée', warnings.some((w) => w.includes('0.7.0') && w.includes('absente')));
check('brouillon, étiquette non semver et étiquette sans produit ignorés', !tsa.releases.some((r) => ['tsa-demo', 'tsa-v0.8.0', 'v0.2.0'].includes(r.tag)));
check('TSALab : sa seule version, sans les archives de TSA', lab.releases.length === 1 && lab.releases[0].tag === 'tsalab-v0.1.0' && lab.releases[0].assets.length === 1);

const down = await run('down', { products: { tsalab: { repo: 'x', checkedAt: '2026-10-01T00:00:00Z', stale: false, releases: [{ tag: 'tsalab-v0.1.0' }] } } });
check('GitHub injoignable : données précédentes gardées, marquées non actualisées',
  down.products.tsalab.stale === true && down.products.tsalab.releases[0]?.tag === 'tsalab-v0.1.0' && down.products.tsa.stale === true);

const missing = await run('404');
check('dépôt de diffusion absent : aucune version, sans être traité comme une panne',
  missing.products.tsa.releases.length === 0 && missing.products.tsa.stale === false && missing.products.tsalab.stale === false);

console.log(failures ? `${failures} échec(s)` : 'test:releases — tout est conforme');
process.exit(failures ? 1 : 0);
