// Audit visuel et fonctionnel du site construit (npm run audit:visual), sans dépendance : pilote Chrome par le
// protocole DevTools (WebSocket natif de Node ≥ 22).
//
// Pour chaque page et chaque résolution : erreurs et avertissements de console, exceptions, requêtes en échec,
// images cassées, débordement horizontal (éléments fautifs), boutons et liens sans nom accessible, images sans
// texte alternatif, polices chargées, liens internes vers une route inconnue ; capture pleine page.
// Puis : menu mobile, menu « Plus », navigation au clavier (ordre et visibilité du focus).
//
// Usage : node scripts/visual-audit.mjs [--base http://localhost:4179] [--out audit-out] [--pages /,/docs] [--theme light]
//         Variable CHROME_PATH si Chrome n'est pas à l'emplacement habituel. Le site doit être servi
//         (npm run build && npx vite preview --port 4179). Code de sortie 1 si un problème est trouvé.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { appRoutes, loadPages } from './docs-lib.mjs';

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : def;
};
const BASE = arg('--base', 'http://localhost:4179').replace(/\/+$/, '');
// Préfixe des adresses du site (ex. /Tsaraloha-Web sous GitHub Pages), retiré avant de contrôler les liens internes.
const BASE_PATH = new URL(BASE).pathname.replace(/\/+$/, '');
const OUT = resolve(arg('--out', 'audit-out'));
const SIZES = [
  { name: '1920', width: 1920, height: 1080, mobile: false },
  { name: '1366', width: 1366, height: 768, mobile: false },
  { name: '1024', width: 1024, height: 768, mobile: false },
  { name: '390', width: 390, height: 844, mobile: true },
];
const DEFAULT_PAGES = ['/', '/features', '/analysis', '/bim', '/co-engineering', '/docs', '/docs/mesh/display',
  '/downloads', '/pricing', '/licensing', '/roadmap', '/changelog', '/about', '/support', '/page-inexistante'];
const PAGES = (arg('--pages', '') || DEFAULT_PAGES.join(',')).split(',');
const THEME = arg('--theme', ''); // light | dark : thème imposé (sinon celui par défaut du site)

const CHROME = process.env.CHROME_PATH ||
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => existsSync(p));
if (!CHROME) {
  console.error('Chrome introuvable : définir CHROME_PATH');
  process.exit(2);
}

const knownRoutes = new Set([...appRoutes(), '/docs', ...loadPages().filter((p) => p.valid).map((p) => p.path)]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Client DevTools minimal ---------------------------------------------------------------------------
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { res, rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      } else if (msg.method) for (const l of this.listeners) l(msg);
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
  on(fn) { this.listeners.push(fn); }
}

async function launch() {
  const profile = join(tmpdir(), `tsa-audit-${process.pid}`);
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((res, rej) => {
    let buf = '';
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) res(m[1]);
    });
    setTimeout(() => rej(new Error('Chrome ne répond pas')), 20000);
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  return { proc, cdp: new Cdp(ws) };
}

// --- Analyse d'une page (exécutée dans la page) ----------------------------------------------------------
const PAGE_PROBE = `(() => {
  const vw = window.innerWidth;
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = (el.getAttribute('class') || '').split(/\\s+/).filter(Boolean).slice(0, 3).join('.');
    if (cls) s += '.' + cls;
    const txt = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
    return txt ? s + ' « ' + txt + ' »' : s;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; };
  const overflow = [];
  if (document.documentElement.scrollWidth > vw + 1) {
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0 && visible(el)) {
        // élément le plus profond fautif seulement
        if (![...el.children].some((c) => c.getBoundingClientRect().right > vw + 1)) overflow.push(describe(el) + ' → ' + Math.round(r.right) + 'px');
      }
      if (overflow.length >= 8) break;
    }
  }
  const brokenImages = [...document.images].filter((i) => (!i.complete || i.naturalWidth === 0) && visible(i)).map((i) => i.getAttribute('src'));
  const imageCount = [...document.images].filter(visible).length;
  const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src'));
  const unnamed = [...document.querySelectorAll('button, a[href], [role=button]')].filter((el) => visible(el) &&
    !(el.textContent || '').trim() && !el.getAttribute('aria-label') && !el.getAttribute('title') &&
    !el.getAttribute('aria-labelledby') && !el.querySelector('img[alt]:not([alt=""])')).map(describe).slice(0, 10);
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const fonts = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')))];
  const clipped = [...document.querySelectorAll('h1,h2,h3,button,a')].filter((el) => visible(el) &&
    el.scrollWidth > el.clientWidth + 2 && ['hidden', 'clip'].includes(getComputedStyle(el).overflowX)).map(describe).slice(0, 6);
  return { title: document.title, overflow, brokenImages, imageCount, noAlt, unnamed, links, fonts, clipped,
           height: document.documentElement.scrollHeight };
})()`;

async function openTarget(cdp) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  await s('Page.enable');
  await s('Runtime.enable');
  await s('Log.enable');
  await s('Network.enable');
  if (THEME) await s('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('tsa_theme', '${THEME}'); } catch (e) {}` });
  return { s, sessionId, targetId };
}

async function navigate(s, url) {
  await s('Page.navigate', { url });
  await sleep(1800); // rendu React, polices, images
  // Défilement jusqu'en bas : les images en chargement différé (loading="lazy") sont chargées puis contrôlées
  await s('Runtime.evaluate', { awaitPromise: true, expression: `(async () => {
    const step = Math.max(300, innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
    scrollTo(0, 0);
  })()` });
  await sleep(300);
}

async function evaluate(s, expr) {
  const r = await s('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const { proc, cdp } = await launch();
  const problems = [];
  const report = [];
  const events = [];
  cdp.on((msg) => events.push(msg));
  try {
    const { s, sessionId } = await openTarget(cdp);
    for (const size of SIZES) {
      await s('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: 1, mobile: size.mobile });
      await s('Emulation.setTouchEmulationEnabled', { enabled: size.mobile });
      for (const page of PAGES) {
        events.length = 0;
        await navigate(s, BASE + page);
        const probe = await evaluate(s, PAGE_PROBE);
        const mine = events.filter((e) => e.sessionId === sessionId);
        const consoleErrors = mine.filter((e) => (e.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(e.params.type)))
          .map((e) => `${e.params.type} : ${e.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 160)}`);
        const exceptions = mine.filter((e) => e.method === 'Runtime.exceptionThrown').map((e) => e.params.exceptionDetails.exception?.description?.slice(0, 160) ?? e.params.exceptionDetails.text);
        const logErrors = mine.filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map((e) => `${e.params.entry.text} ${e.params.entry.url ?? ''}`.slice(0, 180));
        const failed = mine.filter((e) => e.method === 'Network.loadingFailed' && !e.params.canceled).map((e) => e.params.errorText);
        const http = mine.filter((e) => e.method === 'Network.responseReceived' && e.params.response.status >= 400)
          .map((e) => `${e.params.response.status} ${e.params.response.url}`);
        const badLinks = probe.links.filter((h) => h.startsWith('/') && !h.startsWith('//'))
          .map((h) => (BASE_PATH && (h === BASE_PATH || h.startsWith(`${BASE_PATH}/`)) ? h.slice(BASE_PATH.length) : h))
          .map((h) => h.split(/[?#]/)[0].replace(/\/+$/, '') || '/')
          .filter((h) => !knownRoutes.has(h) && !/\.\w{2,5}$/.test(h));
        const entry = { page, size: size.name, ...probe, consoleErrors, exceptions, logErrors, failed, http, badLinks: [...new Set(badLinks)] };
        delete entry.links;
        report.push(entry);
        const issues = [];
        if (consoleErrors.length) issues.push(`console : ${consoleErrors.join(' | ')}`);
        if (exceptions.length) issues.push(`exception : ${exceptions.join(' | ')}`);
        const expected404 = page === '/page-inexistante';
        if (logErrors.length && !expected404) issues.push(`journal : ${logErrors.join(' | ')}`);
        if (http.length && page !== '/page-inexistante') issues.push(`HTTP : ${http.join(' | ')}`);
        if (failed.length) issues.push(`réseau : ${failed.join(' | ')}`);
        if (probe.brokenImages.length) issues.push(`images cassées : ${probe.brokenImages.join(', ')}`);
        if (probe.noAlt.length) issues.push(`images sans alt : ${probe.noAlt.join(', ')}`);
        if (probe.overflow.length) issues.push(`débordement horizontal : ${probe.overflow.join(' ; ')}`);
        if (probe.unnamed.length) issues.push(`sans nom accessible : ${probe.unnamed.join(' ; ')}`);
        if (probe.clipped.length) issues.push(`texte coupé : ${probe.clipped.join(' ; ')}`);
        if (entry.badLinks.length) issues.push(`liens internes inconnus : ${entry.badLinks.join(', ')}`);
        for (const i of issues) problems.push(`${page} @${size.name} — ${i}`);
        // Capture pleine page (hauteur bornée)
        const h = Math.min(probe.height, 7000);
        const shot = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: size.width, height: h, scale: 1 } });
        writeFileSync(join(OUT, `${(page.replace(/\//g, '_') || '_').replace(/^_/, '') || 'home'}_${size.name}.png`), Buffer.from(shot.data, 'base64'));
      }
    }

    // --- Interactions ---------------------------------------------------------------------------------
    const interactions = [];
    // Menu mobile
    await s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await navigate(s, BASE + '/');
    const mobile = await evaluate(s, `(() => {
      const b = [...document.querySelectorAll('header button[aria-controls]')].find((x) => x.offsetParent !== null && x.getAttribute('aria-controls') !== 'nav-more-menu');
      if (!b) return { ok: false, why: 'bouton du menu introuvable' };
      const name = b.getAttribute('aria-label') || '';
      b.click();
      return new Promise((r) => setTimeout(() => {
        const drawer = document.getElementById(b.getAttribute('aria-controls') || '') || document.querySelector('header nav[aria-label]');
        const links = drawer ? drawer.querySelectorAll('a[href]').length : 0;
        r({ ok: links > 5, name, expanded: b.getAttribute('aria-expanded'), links });
      }, 400));
    })()`);
    interactions.push(['menu mobile', mobile]);
    if (!mobile.ok) problems.push(`menu mobile : ${JSON.stringify(mobile)}`);
    await s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const mobileShot = await s('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, 'interaction_menu_mobile.png'), Buffer.from(mobileShot.data, 'base64'));

    // Menu « Plus » (bureau)
    await s('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await s('Emulation.setTouchEmulationEnabled', { enabled: false });
    await navigate(s, BASE + '/');
    const more = await evaluate(s, `(() => {
      const b = [...document.querySelectorAll('header button')].find((x) => /Plus|More/.test(x.innerText));
      if (!b) return { ok: false, why: 'bouton Plus introuvable' };
      b.click();
      return new Promise((r) => setTimeout(() => {
        const items = document.querySelectorAll('header [role=menu] a, header .absolute a').length;
        r({ ok: items >= 5, items, expanded: b.getAttribute('aria-expanded') });
      }, 300));
    })()`);
    interactions.push(['menu Plus', more]);
    if (!more.ok) problems.push(`menu Plus : ${JSON.stringify(more)}`);
    const moreShot = await s('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, 'interaction_menu_plus.png'), Buffer.from(moreShot.data, 'base64'));
    // Échap ferme le menu
    await s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(200);
    const closed = await evaluate(s, `document.querySelectorAll('header [role=menu] a').length === 0`);
    interactions.push(['Échap ferme le menu Plus', closed]);
    if (!closed) problems.push('menu Plus : Échap ne le ferme pas');

    // Navigation au clavier : 14 tabulations depuis le haut de la page d'accueil
    await navigate(s, BASE + '/');
    const focusTrail = [];
    for (let i = 0; i < 14; i++) {
      await s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await sleep(60);
      focusTrail.push(await evaluate(s, `(() => { const el = document.activeElement; if (!el || el === document.body) return null;
        const st = getComputedStyle(el); const ring = st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0 || st.boxShadow !== 'none';
        return { el: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().replace(/\\s+/g, ' ').slice(0, 30), ring }; })()`));
    }
    const noRing = focusTrail.filter((f) => f && !f.ring).map((f) => f.el);
    interactions.push(['clavier', focusTrail]);
    if (focusTrail.every((f) => !f)) problems.push('clavier : aucun élément ne reçoit le focus');
    if (noRing.length) problems.push(`clavier : focus non visible sur ${noRing.join(', ')}`);

    writeFileSync(join(OUT, 'report.json'), JSON.stringify({ base: BASE, report, interactions }, null, 2));
    const fonts = [...new Set(report.flatMap((r) => r.fonts))];
    console.log(`${PAGES.length} pages × ${SIZES.length} résolutions ; polices chargées : ${fonts.join(', ') || 'aucune'}`);
    const images = report.filter((r) => r.size === SIZES[0].name).map((r) => `${r.page} ${r.imageCount}`).join(', ');
    console.log(`images chargées et visibles (${SIZES[0].name} px) : ${images}`);
    for (const [name, value] of interactions) console.log(`${name} : ${JSON.stringify(value)}`);
    if (problems.length) {
      console.log(`\n${problems.length} problème(s) :`);
      for (const p of problems) console.log(' - ' + p);
    } else console.log('\nAucun problème détecté.');
    console.log(`Captures et rapport : ${OUT}`);
    process.exitCode = problems.length ? 1 : 0;
  } finally {
    proc.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
