// En-tête des articles : bloc délimité par « --- » en tête de fichier, lignes « clé: valeur ».
// Valeurs : texte (guillemets facultatifs), nombre, ou liste « [a, b, c] ». Volontairement minimal :
// partagé avec les scripts de vérification (scripts/docs-lib.mjs applique la même grammaire).

export interface ParsedDocument {
  data: Record<string, string | number | string[]>;
  body: string;
}

const unquote = (value: string): string => {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
};

export function parseFrontmatter(source: string): ParsedDocument {
  const text = source.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text };
  const end = text.indexOf('\n---', 4);
  if (end < 0) return { data: {}, body: text };
  const header = text.slice(4, end);
  const body = text.slice(text.indexOf('\n', end + 1) + 1);
  const data: ParsedDocument['data'] = {};
  for (const line of header.split('\n')) {
    const match = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    const value = raw.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => unquote(item))
        .filter((item) => item.length > 0);
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
    } else {
      data[key] = unquote(value);
    }
  }
  return { data, body };
}
