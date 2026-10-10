// Rendu Markdown → éléments React, sans HTML brut (aucun dangerouslySetInnerHTML) : un contenu
// malformé ne peut pas injecter de balises. Sous-ensemble utilisé par la documentation :
// intertitres ##/###/####, paragraphes, listes, tableaux, blocs de code, encadrés « > [!NOTE] »,
// citations, règles, code en ligne, gras, italique, liens et images.

import React from 'react';
import { AlertTriangle, Info, Lightbulb, AlertOctagon } from 'lucide-react';
import { Link } from '../router/RouterContext';
import { CodeBlock } from '../components/CodeBlock';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export const slugifyHeading = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[`*_]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const stripInline = (text: string): string => text.replace(/[`*_]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export function extractToc(markdown: string): TocEntry[] {
  const toc: TocEntry[] = [];
  let inCode = false;
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) inCode = !inCode;
    if (inCode) continue;
    const m = line.match(/^(##|###) (.+)$/);
    if (m) toc.push({ id: slugifyHeading(stripInline(m[2])), text: stripInline(m[2]), level: m[1] === '##' ? 2 : 3 });
  }
  return toc;
}

/** Lien sûr : route interne, ancre, ou HTTPS externe ; tout autre schéma est rendu en texte. */
function renderLink(label: React.ReactNode, href: string, key: string): React.ReactNode {
  if (href.startsWith('/')) {
    return (
      <Link key={key} to={href} className="text-tsa-blue-600 dark:text-tsa-cyan-400 underline underline-offset-2 hover:no-underline">
        {label}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a key={key} href={href} className="text-tsa-blue-600 dark:text-tsa-cyan-400 underline underline-offset-2">
        {label}
      </a>
    );
  }
  if (href.startsWith('https://')) {
    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-tsa-blue-600 dark:text-tsa-cyan-400 underline underline-offset-2">
        {label}
      </a>
    );
  }
  return <span key={key}>{label}</span>;
}

/** Éléments en ligne : `code`, **gras**, *italique*, [lien](url), ![image](src). */
export function renderInline(text: string, keyPrefix = 'i'): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /(`[^`]+`)|(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${n++}`;
    if (token.startsWith('`')) {
      out.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[0.9em] font-mono text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('![')) {
      const m = token.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      const src = m?.[2] ?? '';
      if (src.startsWith('https://') || src.startsWith('/')) {
        out.push(
          <img key={key} src={src} alt={m?.[1] ?? ''} loading="lazy" className="rounded-xl border border-slate-200 dark:border-slate-800 my-4 max-w-full" />,
        );
      }
    } else if (token.startsWith('[')) {
      const m = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (m) out.push(renderLink(renderInline(m[1], key), m[2], key));
    } else if (token.startsWith('**')) {
      out.push(
        <strong key={key} className="font-semibold text-slate-900 dark:text-white">
          {renderInline(token.slice(2, -2), key)}
        </strong>,
      );
    } else {
      out.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const calloutStyles: Record<string, { icon: React.ReactNode; className: string; label: { fr: string; en: string } }> = {
  NOTE: {
    icon: <Info className="w-4 h-4" aria-hidden />,
    className: 'border-tsa-blue-600 bg-blue-500/10 dark:border-tsa-cyan-400',
    label: { fr: 'Note', en: 'Note' },
  },
  TIP: {
    icon: <Lightbulb className="w-4 h-4" aria-hidden />,
    className: 'border-emerald-500 bg-emerald-500/10',
    label: { fr: 'Astuce', en: 'Tip' },
  },
  WARNING: {
    icon: <AlertTriangle className="w-4 h-4" aria-hidden />,
    className: 'border-amber-500 bg-amber-500/10',
    label: { fr: 'Attention', en: 'Warning' },
  },
  IMPORTANT: {
    icon: <AlertOctagon className="w-4 h-4" aria-hidden />,
    className: 'border-red-500 bg-red-500/10',
    label: { fr: 'Important', en: 'Important' },
  },
};

const splitRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

export function Markdown({ source, language = 'fr' }: { source: string; language?: 'fr' | 'en' }): React.ReactElement {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `b-${k++}`;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Bloc de code
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text';
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={key()} language={lang} code={code.join('\n')} />);
      continue;
    }

    // Intertitres (le titre de page est rendu par la mise en page : « # » ignoré)
    const heading = line.match(/^(#{1,4}) (.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = slugifyHeading(stripInline(text));
      if (level === 2)
        blocks.push(
          <h2 key={key()} id={id} className="scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-1">
            {renderInline(text)}
          </h2>,
        );
      else if (level === 3)
        blocks.push(
          <h3 key={key()} id={id} className="scroll-mt-24 text-lg font-bold text-slate-900 dark:text-white pt-3">
            {renderInline(text)}
          </h3>,
        );
      else if (level === 4)
        blocks.push(
          <h4 key={key()} className="font-semibold text-slate-900 dark:text-white pt-2">
            {renderInline(text)}
          </h4>,
        );
      i++;
      continue;
    }

    // Règle horizontale
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push(<hr key={key()} className="my-6 border-slate-200 dark:border-slate-800" />);
      i++;
      continue;
    }

    // Encadré ou citation
    if (line.startsWith('>')) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) quoted.push(lines[i++].replace(/^>\s?/, ''));
      const kind = quoted[0]?.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*$/)?.[1];
      const content = kind ? quoted.slice(1) : quoted;
      const style = kind ? calloutStyles[kind] : undefined;
      blocks.push(
        <div
          key={key()}
          role={style ? 'note' : undefined}
          className={`my-4 p-4 rounded-xl border-l-4 text-sm text-slate-700 dark:text-slate-300 ${style ? style.className : 'border-slate-300 dark:border-slate-700 bg-slate-500/5'}`}
        >
          {style && (
            <div className="flex items-center gap-2 font-semibold mb-1 text-slate-900 dark:text-white">
              {style.icon}
              <span>{style.label[language]}</span>
            </div>
          )}
          {content
            .join('\n')
            .split(/\n{2,}/)
            .map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {renderInline(para.replace(/\n/g, ' '), `q${k}-${idx}`)}
              </p>
            ))}
        </div>,
      );
      continue;
    }

    // Tableau
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(splitRow(lines[i++]));
      blocks.push(
        <div key={key()} className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
              <tr>
                {header.map((cell, c) => (
                  <th key={c} scope="col" className="px-3 py-2 font-semibold">
                    {renderInline(cell, `th${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-t border-slate-200 dark:border-slate-800">
                  {row.map((cell, c) => (
                    <td key={c} className="px-3 py-2 align-top">
                      {renderInline(cell, `td${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Listes
    const bullet = /^\s*[-*] (.+)$/;
    const numbered = /^\s*\d+\. (.+)$/;
    if (bullet.test(line) || numbered.test(line)) {
      const ordered = numbered.test(line);
      const pattern = ordered ? numbered : bullet;
      const items: string[] = [];
      while (i < lines.length && pattern.test(lines[i])) {
        let item = lines[i].match(pattern)![1];
        i++;
        // Ligne de continuation indentée
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !bullet.test(lines[i]) && !numbered.test(lines[i]))
          item += ' ' + lines[i++].trim();
        items.push(item);
      }
      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag key={key()} className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1.5 my-3`}>
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `l${k}-${idx}`)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    // Paragraphe (lignes consécutives)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,4} |```|>|\s*[-*] |\s*\d+\. )/.test(lines[i]) &&
      !lines[i].trim().startsWith('|')
    )
      para.push(lines[i++].trim());
    blocks.push(
      <p key={key()} className="leading-relaxed my-3">
        {renderInline(para.join(' '), `p${k}`)}
      </p>,
    );
  }

  return <>{blocks}</>;
}
