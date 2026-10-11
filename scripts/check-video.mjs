// Contrôle de la vidéo de présentation dans Chrome (protocole DevTools, sans dépendance) : attributs du lecteur
// (pas de lecture automatique, commandes, affiche, préchargement), lecture réelle de quelques secondes, dimensions et
// durée décodées, sous-titres chargés, déplacement dans la vidéo. Les médias restent muets (la vidéo n'a pas de son).
//
// Usage : node scripts/check-video.mjs [--base http://localhost:4179] [--reduced-motion]   (site servi par vite preview)

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const arg = (n, d) => (process.argv.indexOf(n) > 0 ? process.argv[process.argv.indexOf(n) + 1] : d);
const BASE = arg('--base', 'http://localhost:4179').replace(/\/+$/, '');
const REDUCED = process.argv.includes('--reduced-motion');
const CHROME = process.env.CHROME_PATH ||
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome'].find((p) => existsSync(p));
if (!CHROME) {
  console.error('Chrome introuvable : définir CHROME_PATH');
  process.exit(2);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${join(tmpdir(), `tsa-video-${process.pid}`)}`,
  '--no-first-run', '--mute-audio', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
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
await s('Page.enable');
await s('Runtime.enable');
if (REDUCED) await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await s('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
await s('Page.navigate', { url: `${BASE}/` });
await sleep(4000);
const evalJs = async (expr) => (await s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

const report = await evalJs(`(async () => {
  const v = document.querySelector('video');
  if (!v) return { error: 'aucun élément <video>' };
  v.scrollIntoView();
  const attrs = { autoplay: v.autoplay, controls: v.controls, preload: v.preload, poster: v.getAttribute('poster'), playsInline: v.playsInline,
                  sources: [...v.querySelectorAll('source')].map((x) => x.getAttribute('src')),
                  tracks: [...v.querySelectorAll('track')].map((t) => t.srclang + ':' + t.getAttribute('src')),
                  pausedAtLoad: v.paused, readyStateAtLoad: v.readyState };
  v.muted = true;
  for (const t of v.textTracks) t.mode = 'hidden';
  await v.play();
  await new Promise((r) => setTimeout(r, 3500));
  const played = { currentTime: v.currentTime, duration: v.duration, width: v.videoWidth, height: v.videoHeight, error: v.error && v.error.code,
                   paused: v.paused, quality: v.getVideoPlaybackQuality ? v.getVideoPlaybackQuality().totalVideoFrames : null };
  v.currentTime = 30;
  await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
  const cues = [...v.textTracks].map((t) => t.language + ':' + (t.cues ? t.cues.length : 0));
  const activeCue = [...v.textTracks].map((t) => t.activeCues && t.activeCues[0] ? t.activeCues[0].text : '').filter(Boolean);
  v.pause();
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { attrs, played, seekedTo: v.currentTime, cues, activeCue, reducedMotion: rm, reducedMotionPaused: v.paused };
})()`);
console.log(JSON.stringify(report, null, 2));
const ok = report.attrs && !report.attrs.autoplay && report.attrs.controls && report.attrs.pausedAtLoad && report.played.currentTime > 2 &&
  report.played.width === 1280 && report.played.height === 720 && Math.abs(report.played.duration - 42) < 0.5 && !report.played.error &&
  report.cues.every((c) => Number(c.split(':')[1]) >= 7);
console.log(ok ? 'Vidéo : lecture vérifiée.' : 'Vidéo : PROBLÈME.');
proc.kill();
process.exit(ok ? 0 : 1);
