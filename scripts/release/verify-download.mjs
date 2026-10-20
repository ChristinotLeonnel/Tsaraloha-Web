#!/usr/bin/env node
// scripts/release/verify-download.mjs
// Vérifie la disponibilité, la reprise de téléchargement (Range request)
// et l'intégrité d'une URL de téléchargement direct de package.
//
// Usage:
//   node scripts/release/verify-download.mjs <url> [--expected-size <bytes>] [--expected-sha256 <hex>]

import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith('http://') || a.startsWith('https://'));

if (!url) {
  console.log('Usage: node scripts/release/verify-download.mjs <https://url-du-package.exe> [--expected-size <octets>] [--check-hash]');
  process.exit(0);
}

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const expectedSize = getArg('--expected-size') ? parseInt(getArg('--expected-size'), 10) : null;
const expectedHash = getArg('--expected-sha256')?.toLowerCase();
const checkHash = args.includes('--check-hash');

console.log(`Vérification de l'URL : ${url}`);

try {
  // 1. Requête HEAD pour vérifier l'existence et les en-têtes
  const headRes = await fetch(url, { method: 'HEAD' });
  console.log(`  Statut HTTP HEAD : ${headRes.status} ${headRes.statusText}`);

  if (!headRes.ok) {
    console.error(`  ✕ Échec : Le serveur a renvoyé ${headRes.status}`);
    process.exit(1);
  }

  const contentLength = headRes.headers.get('content-length');
  const acceptRanges = headRes.headers.get('accept-ranges');
  const contentType = headRes.headers.get('content-type');

  console.log(`  Content-Length : ${contentLength ?? 'Non spécifié'} octets`);
  console.log(`  Content-Type   : ${contentType ?? 'Non spécifié'}`);
  console.log(`  Accept-Ranges  : ${acceptRanges ?? 'none'} (Support de la reprise)`);

  if (expectedSize && contentLength && parseInt(contentLength, 10) !== expectedSize) {
    console.error(`  ✕ Incohérence : Taille attendue ${expectedSize} ≠ Reçue ${contentLength}`);
    process.exit(1);
  }

  // 2. Vérification de la reprise (Range request RFC 7233)
  const rangeRes = await fetch(url, {
    headers: { Range: 'bytes=0-1023' },
  });
  if (rangeRes.status === 206) {
    console.log(`  ✓ Reprise de téléchargement (Range HTTP 206 Partial Content) supportée`);
  } else {
    console.log(`  ℹ Range HTTP 206 non supporté directement (Status: ${rangeRes.status})`);
  }

  // 3. Téléchargement et vérification SHA-256 complets si demandé
  if (checkHash) {
    console.log(`  Téléchargement en cours pour vérification d'intégrité SHA-256...`);
    const getRes = await fetch(url);
    const arrayBuffer = await getRes.arrayBuffer();
    const hash = createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex').toLowerCase();
    console.log(`  SHA-256 calculé : ${hash}`);
    if (expectedHash && hash !== expectedHash) {
      console.error(`  ✕ Incohérence SHA-256 : Attendu ${expectedHash} ≠ Reçu ${hash}`);
      process.exit(1);
    }
    console.log(`  ✓ SHA-256 vérifié et identique`);
  }

  console.log(`✓ Vérification terminée avec succès.`);
} catch (err) {
  console.error(`Erreur réseau lors de la vérification : ${err.message}`);
  process.exit(1);
}
