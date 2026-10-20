#!/usr/bin/env node
// scripts/release/register-release.mjs
// Calcule l'empreinte SHA-256 et la taille exacte d'un installateur ou binaire réel,
// et enregistre la version dans src/config/releases-direct.json.
//
// Usage:
//   node scripts/release/register-release.mjs <chemin_vers_fichier_setup.exe> [--title "Titre"] [--notes "Notes"] [--channel stable|prerelease]

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const directConfigPath = join(root, 'src/config/releases-direct.json');
const productsConfigPath = join(root, 'src/config/products.json');

const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith('--'));

if (!filePath) {
  console.error('Usage: node scripts/release/register-release.mjs <chemin_vers_setup.exe> [--channel stable]');
  process.exit(1);
}

const resolvedPath = resolve(filePath);
if (!existsSync(resolvedPath)) {
  console.error(`Fichier introuvable : ${resolvedPath}`);
  process.exit(1);
}

const fileName = basename(resolvedPath);
const stats = statSync(resolvedPath);
const size = stats.size;

console.log(`Calcul du SHA-256 pour : ${fileName} (${size} octets)...`);
const buffer = readFileSync(resolvedPath);
const sha256 = createHash('sha256').update(buffer).digest('hex').toLowerCase();
console.log(`SHA-256 : ${sha256}`);

// Identifier le produit et la version d'après le nom de fichier
// Ex: TSA-0.1.0-windows-x64-setup.exe -> produit: tsa, version: 0.1.0, format: installer
const productsConfig = JSON.parse(readFileSync(productsConfigPath, 'utf8'));
let matchedProduct = null;
let matchedKind = null;
let matchedVersion = null;

for (const p of productsConfig.products) {
  if (fileName.startsWith(p.assetPrefix)) {
    for (const k of productsConfig.assetKinds) {
      if (fileName.endsWith(k.suffix)) {
        matchedProduct = p;
        matchedKind = k;
        matchedVersion = fileName.slice(p.assetPrefix.length, fileName.length - k.suffix.length);
        break;
      }
    }
  }
  if (matchedProduct) break;
}

if (!matchedProduct || !matchedKind || !matchedVersion) {
  console.error(`Le fichier ${fileName} ne correspond à aucun modèle connu dans src/config/products.json`);
  process.exit(1);
}

// Extraction des arguments optionnels
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const channel = getArg('--channel', 'stable');
const title = getArg('--title', `${matchedProduct.name} ${matchedVersion} — Version Officielle Windows`);
const baseUrl = getArg('--base-url', 'https://downloads.tsaraloha.org/releases');
const downloadUrl = `${baseUrl}/${fileName}`;
const checksumsUrl = `${baseUrl}/SHA256SUMS.txt`;

const directConfig = existsSync(directConfigPath)
  ? JSON.parse(readFileSync(directConfigPath, 'utf8'))
  : { products: {} };

if (!directConfig.products) directConfig.products = {};
if (!directConfig.products[matchedProduct.id]) directConfig.products[matchedProduct.id] = { releases: [] };

const productReleases = directConfig.products[matchedProduct.id].releases;
const tag = `${matchedProduct.tagPrefix}${matchedVersion}`;

const newAsset = {
  name: fileName,
  size,
  url: downloadUrl,
  sha256,
  os: matchedKind.os,
  arch: matchedKind.arch,
  format: matchedKind.format,
  downloads: 0,
};

let existingRelease = productReleases.find((r) => r.tag === tag);
if (!existingRelease) {
  existingRelease = {
    tag,
    version: matchedVersion,
    channel,
    title,
    publishedAt: new Date().toISOString(),
    notes: `Version officielle de ${matchedProduct.fullName} pour Windows.`,
    pageUrl: `/downloads/${matchedProduct.id}`,
    checksumsUrl,
    assets: [newAsset],
  };
  productReleases.unshift(existingRelease);
} else {
  existingRelease.version = matchedVersion;
  existingRelease.channel = channel;
  existingRelease.title = title;
  const existingAssetIdx = existingRelease.assets.findIndex((a) => a.name === fileName);
  if (existingAssetIdx >= 0) {
    existingRelease.assets[existingAssetIdx] = newAsset;
  } else {
    existingRelease.assets.push(newAsset);
  }
}

writeFileSync(directConfigPath, `${JSON.stringify(directConfig, null, 2)}\n`);
console.log(`✓ Enregistrement réussi dans ${directConfigPath}`);
console.log(`  Produit : ${matchedProduct.name}`);
console.log(`  Tag     : ${tag}`);
console.log(`  Fichier : ${fileName}`);
console.log(`  Taille  : ${size} octets`);
console.log(`  SHA-256 : ${sha256}`);
console.log(`  URL     : ${downloadUrl}`);
