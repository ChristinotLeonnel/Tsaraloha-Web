// Catalogue de la documentation : pages Markdown chargées à la construction (Vite), navigation et
// repli de langue. Source unique : les fichiers de src/content/docs ; aucune copie du contenu ailleurs.

import { parseFrontmatter } from './frontmatter';
import { docCategories } from './categories';
import type { DocLanguage, DocPage, DocStatus } from './types';

const sources = import.meta.glob('../content/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const asList = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);
const asStatus = (value: unknown): DocStatus =>
  value === 'experimental' || value === 'planned' ? value : 'available';

function buildPages(): DocPage[] {
  const pages: DocPage[] = [];
  for (const [file, source] of Object.entries(sources)) {
    const match = file.match(/content\/docs\/(fr|en)\/([\w-]+)\/([\w-]+)\.md$/);
    if (!match) continue;
    const [, language, category, slug] = match;
    const { data, body } = parseFrontmatter(source);
    pages.push({
      language: language as DocLanguage,
      category,
      slug,
      path: slug === 'index' ? `/docs/${category}` : `/docs/${category}/${slug}`,
      title: String(data.title ?? slug),
      description: String(data.description ?? ''),
      order: typeof data.order === 'number' ? data.order : 100,
      status: asStatus(data.status),
      version: String(data.version ?? ''),
      updated: String(data.updated ?? ''),
      keywords: asList(data.keywords),
      helpIds: asList(data.helpIds),
      body,
    });
  }
  const categoryOrder = (id: string) => docCategories.find((c) => c.id === id)?.order ?? 99;
  return pages.sort(
    (a, b) =>
      categoryOrder(a.category) - categoryOrder(b.category) ||
      (a.slug === 'index' ? -1 : b.slug === 'index' ? 1 : a.order - b.order) ||
      a.title.localeCompare(b.title),
  );
}

export const allDocPages: DocPage[] = buildPages();

/** Langue de référence : chaque page existe au moins en français. */
export const referenceLanguage: DocLanguage = 'fr';

/** Page d'une route dans la langue demandée, sinon dans la langue de référence (repli signalé). */
export function findPage(path: string, language: DocLanguage): { page: DocPage; fallback: boolean } | undefined {
  const normalized = path.replace(/\/+$/, '');
  const exact = allDocPages.find((p) => p.path === normalized && p.language === language);
  if (exact) return { page: exact, fallback: false };
  const other = allDocPages.find((p) => p.path === normalized && p.language === referenceLanguage);
  return other ? { page: other, fallback: true } : undefined;
}

/** Pages de navigation (langue de référence pour la structure, titre traduit si disponible). */
export function navigationPages(language: DocLanguage): DocPage[] {
  return allDocPages
    .filter((p) => p.language === referenceLanguage)
    .map((p) => findPage(p.path, language)?.page ?? p);
}

export function pagesOfCategory(category: string, language: DocLanguage): DocPage[] {
  return navigationPages(language).filter((p) => p.category === category);
}

/** Pages précédente et suivante dans l'ordre de lecture global. */
export function neighbours(path: string, language: DocLanguage): { previous?: DocPage; next?: DocPage } {
  const pages = navigationPages(language);
  const index = pages.findIndex((p) => p.path === path);
  if (index < 0) return {};
  return { previous: pages[index - 1], next: pages[index + 1] };
}

/** Routes connues (vérification des liens internes, sitemap). */
export const knownDocPaths = new Set(['/docs', ...allDocPages.map((p) => p.path)]);
