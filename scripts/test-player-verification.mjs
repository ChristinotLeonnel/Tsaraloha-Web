// Test complet du lecteur vidéo, du son, des commandes et des sous-titres via Chrome DevTools Protocol.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BASE = 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ||
  ['C:/Program Files/Google/Chrome/Application/chrome.exe',
   'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
   '/usr/bin/google-chrome'].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome introuvable.');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=0',
  '--autoplay-policy=no-user-gesture-required',
  `--user-data-dir=${join(tmpdir(), `tsa-test-player-${process.pid}`)}`,
  '--no-first-run',
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  proc.stderr.on('data', (d) => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) res(m[1]);
  });
  setTimeout(() => rej(new Error('Timeout lancement Chrome')), 20000);
});

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));

let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  }
});

const send = (method, params = {}, sessionId) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  return new Promise((res, rej) => pending.set(i, { res, rej }));
};

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);

const consoleErrors = [];
await s('Page.enable');
await s('Runtime.enable');
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    consoleErrors.push(m.params.args.map((a) => a.value || a.description).join(' '));
  }
});

const evalJs = async (expr) =>
  (await s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

console.log('--- TEST 1 : Bureau (Desktop 1366x900) ---');
await s('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
await s('Page.navigate', { url: `${BASE}/` });
await sleep(4000);

const desktopResult = await evalJs(`(async () => {
  try {
    const v = document.querySelector('video');
    if (!v) return { error: 'video introuvable' };
    
    v.scrollIntoView();
    
    const sources = [...v.querySelectorAll('source')].map(s => s.src);
    const tracks = [...v.querySelectorAll('track')].map(t => ({ lang: t.srclang, src: t.src }));
    
    const initialPaused = v.paused;
    const initialMuted = v.muted;
    
    // Test de lecture
    v.muted = true;
    await v.play();
    await new Promise(r => setTimeout(r, 1200));
    
    const playing = !v.paused;
    const currentTime1 = v.currentTime;
    
    // Déplacement au temps 6s pour vérifier le sous-titre
    v.currentTime = 6.0;
    await new Promise(r => v.addEventListener('seeked', r, { once: true }));
    await new Promise(r => setTimeout(r, 600));
    
    const subEl = document.querySelector('p.line-clamp-2');
    const subText = subEl ? subEl.innerText : null;
    const subFontSize = subEl ? window.getComputedStyle(subEl).fontSize : null;
    
    // Bouton de son
    const soundButtons = [...document.querySelectorAll('button')].filter(b => b.innerText.includes('Son'));
    const soundText = soundButtons.length > 0 ? soundButtons[0].innerText : null;
    
    v.pause();
    
    return {
      initialPaused,
      initialMuted,
      playing,
      currentTime1,
      duration: v.duration,
      sources,
      tracks,
      subText,
      subFontSize,
      soundText
    };
  } catch (err) {
    return { error: err.toString(), stack: err.stack };
  }
})()`);

console.log('Résultats Desktop :', JSON.stringify(desktopResult, null, 2));

console.log('\n--- TEST 2 : Mobile (Mobile 375x812) ---');
await s('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await s('Page.navigate', { url: `${BASE}/` });
await sleep(3500);

const mobileResult = await evalJs(`(async () => {
  const v = document.querySelector('video');
  if (!v) return { error: 'video introuvable' };
  
  v.scrollIntoView();
  v.currentTime = 6.0;
  await new Promise(r => v.addEventListener('seeked', r, { once: true }));
  await new Promise(r => setTimeout(r, 600));
  
  const subEl = document.querySelector('p.line-clamp-2');
  const subText = subEl ? subEl.innerText : null;
  const subFontSize = subEl ? window.getComputedStyle(subEl).fontSize : null;
  
  return {
    subText,
    subFontSize,
    videoWidth: v.clientWidth,
    videoHeight: v.clientHeight
  };
})()`);

console.log('Résultats Mobile :', JSON.stringify(mobileResult, null, 2));

console.log('\n--- TEST 3 : Erreurs Console & Intégrité du site ---');
console.log('Erreurs console détectées :', consoleErrors.length === 0 ? 'AUCUNE (0)' : consoleErrors);

proc.kill();

const success =
  desktopResult &&
  desktopResult.playing &&
  desktopResult.duration >= 41.5 &&
  desktopResult.subText &&
  desktopResult.subText.includes('Modélisation 3D') &&
  parseFloat(desktopResult.subFontSize) >= 18 &&
  parseFloat(desktopResult.subFontSize) <= 22 &&
  mobileResult &&
  mobileResult.subText &&
  parseFloat(mobileResult.subFontSize) >= 14 &&
  parseFloat(mobileResult.subFontSize) <= 18 &&
  consoleErrors.length === 0;

console.log('\n========================================');
console.log(success ? '>>> TOUS LES TESTS SONT VALIDES AVEC SUCCÈS ! <<<' : '>>> DES TESTS ONT ÉCHOUÉ ! <<<');
console.log('========================================');
process.exit(success ? 0 : 1);
