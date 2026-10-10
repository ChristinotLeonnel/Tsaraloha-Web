// Outils partagés par les scripts de la documentation (vérification, pages de route, plan du site).
// La grammaire de l'en-tête est la même que src/docs/frontmatter.ts.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const contentDir = join(root, 'src', 'content', 'docs');
export const deployment = JSON.parse(readFileSync(join(root, 'src', 'config', 'deployment.json'), 'utf8'));

export const categories = ['getting-started', 'modeling', 'loading', 'mesh', 'analysis', 'results', 'bim', 'troubleshooting'];
export const statuses = ['available', 'experimental', 'planned'];
export const languages = ['fr', 'en'];

const unquote = (v) => {
  const t = v.trim();
  return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")) ? t.slice(1, -1) : t;
};

export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text, hasHeader: false };
  const end = text.indexOf('\n---', 4);
  if (end < 0) return { data: {}, body: text, hasHeader: false };
  const data = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']'))
      data[m[1]] = value.slice(1, -1).split(',').map(unquote).filter((x) => x.length > 0);
    else if (/^-?\d+(\.\d+)?$/.test(value)) data[m[1]] = Number(value);
    else data[m[1]] = unquote(value);
  }
  return { data, body: text.slice(text.indexOf('\n', end + 1) + 1), hasHeader: true };
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Toutes les pages Markdown : langue, catégorie, slug, route, en-tête et texte. */
export function loadPages() {
  return walk(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const rel = relative(contentDir, file).split(sep).join('/');
      const m = rel.match(/^(fr|en)\/([\w-]+)\/([\w-]+)\.md$/);
      const { data, body, hasHeader } = parseFrontmatter(readFileSync(file, 'utf8'));
      return {
        file: rel,
        valid: !!m,
        language: m?.[1],
        category: m?.[2],
        slug: m?.[3],
        path: m ? (m[3] === 'index' ? `/docs/${m[2]}` : `/docs/${m[2]}/${m[3]}`) : undefined,
        data,
        body,
        hasHeader,
      };
    });
}

/** Routes de l'application déclarées dans src/App.tsx (case '/…'). */
export function appRoutes() {
  const app = readFileSync(join(root, 'src', 'App.tsx'), 'utf8');
  return [...app.matchAll(/case '(\/[^']*)'/g)].map((m) => m[1]);
}

/**
 * Registre des identifiants d'aide de TSA (dépôt voisin ../TSA), s'il est présent :
 * lignes « { "model.nodes", "docs/modeling/nodes" }, » de src/Help/HelpTopics.cpp.
 */
export function tsaHelpTopics() {
  const file = join(root, '..', 'TSA', 'src', 'Help', 'HelpTopics.cpp');
  if (!existsSync(file)) return undefined;
  const source = readFileSync(file, 'utf8');
  const topics = [...source.matchAll(/\{\s*"([a-z0-9.-]+)"\s*,\s*"(docs[a-z0-9/-]*)"\s*\}/g)].map((m) => ({
    id: m[1],
    path: '/' + m[2],
  }));
  return { file, topics };
}
