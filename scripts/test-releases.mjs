// Tests de scripts/fetch-releases.mjs sans réseau : fetch est remplacé par des réponses de l'API GitHub simulées,
// puis on vérifie quelles versions sont retenues ou écartées, et pourquoi.

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sha = (c) => c.repeat(64);
const MB = 1024 * 1024;

const asset = (name, size, digest) => ({ name, size, browser_download_url: `https://dl.test/${name}`, digest, download_count: 0 });
let day = 10;
const release = (tag, assets, extra = {}) => ({
  tag_name: tag, name: tag, draft: false, prerelease: false, published_at: `2026-10-${day++}T00:00:00Z`,
  body: 'notes', html_url: `https://github.test/${tag}`, assets: [...assets, asset('SHA256SUMS.txt', 300)], ...extra,
});

const sums = {
  'https://dl.test/SHA256SUMS.txt': [
    `${sha('a')}  TSA-0.2.0-windows-x64.zip`,
    `${sha('9')}  TSA-0.2.0-windows-x64-setup.exe`,
    `${sha('b')}  TSA-0.3.0-rc.1-windows-x64.zip`,
    `${sha('c')}  TSA-0.4.0-windows-x64.zip`,
    `${sha('d')}  TSA-0.5.0-windows-x64.zip`,
    `${sha('e')}  TSA-9.9.9-windows-x64.zip`,
  ].join('\n'),
};

const api = {
  'TSA-Releases': [
    release('v0.2.0', [asset('TSA-0.2.0-windows-x64.zip', 80 * MB, `sha256:${sha('a')}`), asset('TSA-0.2.0-windows-x64-setup.exe', 70 * MB)]), // retenue, stable
    release('v0.3.0-rc.1', [asset('TSA-0.3.0-rc.1-windows-x64.zip', 80 * MB)]),                             // retenue, préversion
    release('v0.4.0', [asset('TSA-0.4.0-windows-x64.zip', 80 * MB, `sha256:${sha('f')}`)]),                  // empreinte ≠ GitHub
    release('v0.5.0', [asset('TSA-0.5.0-windows-x64.zip', 10)]),                                            // archive vide
    release('v0.6.0', [asset('TSA-9.9.9-windows-x64.zip', 80 * MB)]),                                       // version ≠ étiquette
    release('v0.7.0', [asset('TSA-0.7.0-windows-x64.zip', 80 * MB)]),                                       // empreinte absente
    release('demo', [asset('TSA-0.2.0-windows-x64.zip', 80 * MB)]),                                         // étiquette non semver
    release('v0.8.0', [asset('TSA-0.8.0-windows-x64.zip', 80 * MB)], { draft: true }),                      // brouillon
  ],
  'TSALab-Releases': 'down',
};

globalThis.fetch = async (url) => {
  const repo = Object.keys(api).find((r) => url.includes(`/${r}/releases`));
  if (repo) {
    if (api[repo] === 'down') throw new Error('réseau simulé indisponible');
    return { ok: true, status: 200, json: async () => api[repo] };
  }
  if (url.includes('/repos/')) return { ok: false, status: 404 };
  if (sums[url]) return { ok: true, status: 200, text: async () => sums[url] };
  return { ok: false, status: 404 };
};

const out = join(mkdtempSync(join(tmpdir(), 'tsa-releases-')), 'releases.json');
// Données précédentes : TSALab doit être conservé (et marqué non actualisé) si GitHub ne répond pas.
writeFileSync(out, JSON.stringify({ products: { tsalab: { repo: 'x', checkedAt: '2026-10-01T00:00:00Z', stale: false, releases: [{ tag: 'v0.1.0' }] } } }));
process.env.RELEASES_OUT = out;
const warnings = [];
console.warn = (m) => warnings.push(String(m));
await import(pathToFileURL(join(root, 'scripts/fetch-releases.mjs')).href);
const result = JSON.parse(readFileSync(out, 'utf8'));

let failures = 0;
const check = (label, ok) => {
  console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${label}`);
  if (!ok) failures++;
};
const tsa = result.products.tsa;
check('deux versions TSA retenues', tsa.releases.length === 2);
check('la plus récente en premier', tsa.releases[0]?.tag === 'v0.3.0-rc.1');
const v020 = tsa.releases.find((r) => r.tag === 'v0.2.0');
check('v0.2.0 stable : installateur en premier, puis archive portable, empreintes de SHA256SUMS',
  v020?.channel === 'stable' && v020.assets.map((a) => a.format).join() === 'installer,portable-zip' && v020.assets[0].sha256 === sha('9') && v020.assets[1].sha256 === sha('a'));
check('v0.3.0-rc.1 préversion', tsa.releases.find((r) => r.tag === 'v0.3.0-rc.1')?.channel === 'prerelease');
check('URL directe du fichier publié', tsa.releases[0]?.assets[0].url === 'https://dl.test/TSA-0.3.0-rc.1-windows-x64.zip');
check('empreinte contredite par GitHub écartée', warnings.some((w) => w.includes('0.4.0') && w.includes('calculée par GitHub')));
check('archive vide écartée', warnings.some((w) => w.includes('0.5.0') && w.includes('octets')));
check('version du nom ≠ étiquette écartée', warnings.some((w) => w.includes('9.9.9') && w.includes('étiquette')));
check('empreinte absente écartée', warnings.some((w) => w.includes('0.7.0') && w.includes('absente')));
check('brouillon et étiquette non semver ignorés', !tsa.releases.some((r) => ['demo', 'v0.8.0'].includes(r.tag)));
check('TSALab injoignable : données précédentes gardées, marquées non actualisées', result.products.tsalab.stale === true && result.products.tsalab.releases[0]?.tag === 'v0.1.0');

// Dépôt de diffusion absent (404) : aucune version, sans être traité comme une panne.
api['TSA-Releases'] = undefined;
delete api['TSA-Releases'];
const out2 = out.replace('releases.json', 'releases-404.json');
process.env.RELEASES_OUT = out2;
await import(pathToFileURL(join(root, 'scripts/fetch-releases.mjs')).href + '?404');
const r404 = JSON.parse(readFileSync(out2, 'utf8')).products.tsa;
check('dépôt de diffusion absent : aucune version, données non marquées « non actualisées »', r404.releases.length === 0 && r404.stale === false);

console.log(failures ? `${failures} échec(s)` : 'test:releases — tout est conforme');
process.exit(failures ? 1 : 0);
