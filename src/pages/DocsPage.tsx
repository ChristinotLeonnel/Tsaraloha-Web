// Portail de documentation : une adresse stable par article (/docs/<catégorie>/<page>), menu latéral,
// fil d'Ariane, sommaire, recherche (synonymes, accents), page précédente / suivante, état de la
// fonction, version, date de mise à jour, repli de langue signalé et lien « Signaler une erreur ».

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Flag,
  Calendar,
  Tag,
  Languages,
  FileQuestion,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link, useRouter } from '../router/RouterContext';
import { SEOHead } from '../components/SEOHead';
import { siteConfig } from '../config/site';
import { docCategories, categoryById } from '../docs/categories';
import { findPage, pagesOfCategory, neighbours } from '../docs/catalog';
import { searchDocs } from '../docs/search';
import { Markdown, extractToc } from '../docs/Markdown';
import { documentedVersion, requestedVersion } from '../docs/versions';
import type { DocLanguage, DocPage, DocStatus } from '../docs/types';

const ui = {
  fr: {
    docs: 'Documentation',
    search: 'Rechercher (ex. : charge répartie, Ctrl+clic, IFC)…',
    noResult: 'Aucun résultat. Essayez un autre terme ou parcourez les catégories.',
    results: 'résultats',
    toc: 'Sur cette page',
    previous: 'Précédent',
    next: 'Suivant',
    updated: 'Mise à jour',
    version: 'Version TSA',
    report: 'Signaler une erreur sur cette page',
    menu: 'Sommaire de la documentation',
    fallback: 'Cette page n’est pas encore traduite : la version française est affichée.',
    notFoundTitle: 'Page de documentation introuvable',
    notFoundText: 'Cette adresse ne correspond à aucune page. Elle a peut-être été déplacée.',
    backToDocs: 'Retour à la documentation',
    intro: 'Guide d’utilisation de TSA : modélisation, charges, analyse, résultats et dépannage.',
    pages: 'pages',
    versionNotice: (v: string, d: string) =>
      `Vous consultez l’aide depuis TSA ${v}. Cette documentation décrit TSA ${d} ; certaines fonctions peuvent différer.`,
  },
  en: {
    docs: 'Documentation',
    search: 'Search (e.g. distributed load, Ctrl+click, IFC)…',
    noResult: 'No result. Try another term or browse the categories.',
    results: 'results',
    toc: 'On this page',
    previous: 'Previous',
    next: 'Next',
    updated: 'Updated',
    version: 'TSA version',
    report: 'Report an error on this page',
    menu: 'Documentation contents',
    fallback: 'This page is not translated yet: the French version is shown.',
    notFoundTitle: 'Documentation page not found',
    notFoundText: 'This address does not match any page. It may have moved.',
    backToDocs: 'Back to documentation',
    intro: 'TSA user guide: modeling, loads, analysis, results and troubleshooting.',
    pages: 'pages',
    versionNotice: (v: string, d: string) =>
      `You opened help from TSA ${v}. This documentation describes TSA ${d}; some features may differ.`,
  },
};

const statusLabel: Record<DocStatus, { fr: string; en: string; className: string }> = {
  available: {
    fr: 'Disponible',
    en: 'Available',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  },
  experimental: {
    fr: 'Expérimental',
    en: 'Experimental',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  },
  planned: {
    fr: 'Prévu',
    en: 'Planned',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
  },
};

const StatusBadge: React.FC<{ status: DocStatus; language: DocLanguage }> = ({ status, language }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${statusLabel[status].className}`}>
    {statusLabel[status][language]}
  </span>
);

/** Ticket pré-rempli sur le dépôt du site : seule l'adresse publique de la page est transmise. */
const reportUrl = (page: DocPage) => {
  const title = `[Docs] ${page.path}`;
  const body = `Page : ${page.path} (${page.language}, TSA ${page.version || documentedVersion})\n\nErreur constatée :\n\nCorrection proposée :\n`;
  return `${siteConfig.urls.github}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
};

const formatDate = (iso: string, language: DocLanguage) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
};

// ─── Recherche ───────────────────────────────────────────────────────────────

const DocSearch: React.FC<{ language: DocLanguage; onNavigate?: () => void }> = ({ language, onNavigate }) => {
  const t = ui[language];
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => searchDocs(query, language), [query, language]);

  // « / » ou Ctrl+K place le curseur dans la recherche.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (page: DocPage) => {
    setQuery('');
    navigate(page.path);
    onNavigate?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault();
      go(hits[active].page);
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  const showResults = query.trim().length >= 2;
  return (
    <div className="relative" role="search">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={t.search}
        aria-label={t.search}
        role="combobox"
        aria-controls="doc-search-results"
        aria-expanded={showResults}
        aria-activedescendant={showResults && hits[active] ? `doc-hit-${active}` : undefined}
        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-tsa-surface-dark border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
      />
      {showResults && (
        <div
          id="doc-search-results"
          role="listbox"
          className="absolute z-30 mt-2 w-full lg:w-[28rem] max-h-96 overflow-y-auto rounded-xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          {hits.length === 0 ? (
            <p className="p-3 text-sm text-slate-500">{t.noResult}</p>
          ) : (
            <>
              <p className="px-3 pt-2 text-[11px] text-slate-400">
                {hits.length} {t.results}
              </p>
              {hits.map((hit, i) => (
                <button
                  type="button"
                  key={hit.page.path}
                  id={`doc-hit-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(hit.page)}
                  className={`block w-full text-left px-3 py-2 text-sm ${i === active ? 'bg-tsa-blue-600/10 dark:bg-tsa-blue-600/20' : ''}`}
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">{hit.page.title}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {categoryById(hit.page.category)?.title[language]} · {hit.page.description}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Menu latéral ────────────────────────────────────────────────────────────

const Sidebar: React.FC<{ language: DocLanguage; currentPath: string; onNavigate?: () => void }> = ({
  language,
  currentPath,
  onNavigate,
}) => (
  <nav aria-label={ui[language].menu} className="space-y-4">
    {docCategories.map((cat) => {
      const pages = pagesOfCategory(cat.id, language);
      if (pages.length === 0) return null;
      return (
        <div key={cat.id}>
          <Link
            to={`/docs/${cat.id}`}
            onClick={onNavigate}
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {cat.title[language]}
          </Link>
          <ul className="space-y-0.5">
            {pages
              .filter((p) => p.slug !== 'index')
              .map((p) => {
                const active = p.path === currentPath;
                return (
                  <li key={p.path}>
                    <Link
                      to={p.path}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                        active
                          ? 'bg-tsa-blue-600/10 dark:bg-tsa-blue-600/20 text-tsa-blue-600 dark:text-tsa-cyan-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{p.title}</span>
                      {p.status !== 'available' && (
                        <span className="text-[10px] uppercase text-slate-400">{statusLabel[p.status][language]}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      );
    })}
  </nav>
);

// ─── Contenus ────────────────────────────────────────────────────────────────

const Breadcrumb: React.FC<{ items: { label: string; to?: string }[]; label: string }> = ({ items, label }) => (
  <nav aria-label={label} className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight className="w-3 h-3" aria-hidden />}
        {item.to ? (
          <Link to={item.to} className="hover:text-tsa-blue-600 dark:hover:text-tsa-cyan-400">
            {item.label}
          </Link>
        ) : (
          <span aria-current="page" className="text-slate-700 dark:text-slate-200">
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

const DocsHome: React.FC<{ language: DocLanguage }> = ({ language }) => {
  const t = ui[language];
  return (
    <>
      <SEOHead title={t.docs} description={t.intro} />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
        {t.docs}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t.intro}</p>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {docCategories.map((cat) => {
          const count = pagesOfCategory(cat.id, language).filter((p) => p.slug !== 'index').length;
          return (
            <Link
              key={cat.id}
              to={`/docs/${cat.id}`}
              className="block p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card hover:border-tsa-blue-500 transition-colors"
            >
              <span className="block font-bold text-slate-900 dark:text-white">{cat.title[language]}</span>
              <span className="block mt-1 text-sm text-slate-600 dark:text-slate-400">{cat.description[language]}</span>
              <span className="block mt-2 text-xs text-slate-400">
                {count} {t.pages}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

const CategoryList: React.FC<{ category: string; language: DocLanguage }> = ({ category, language }) => (
  <ul className="mt-6 grid gap-3">
    {pagesOfCategory(category, language)
      .filter((p) => p.slug !== 'index')
      .map((p) => (
        <li key={p.path}>
          <Link
            to={p.path}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card hover:border-tsa-blue-500 transition-colors"
          >
            <span>
              <span className="block font-semibold text-slate-900 dark:text-white">{p.title}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{p.description}</span>
            </span>
            <StatusBadge status={p.status} language={language} />
          </Link>
        </li>
      ))}
  </ul>
);

const DocArticleView: React.FC<{ page: DocPage; fallback: boolean; language: DocLanguage }> = ({ page, fallback, language }) => {
  const t = ui[language];
  const category = categoryById(page.category);
  const toc = useMemo(() => extractToc(page.body), [page.body]);
  const { previous, next } = neighbours(page.path, language);
  const isCategoryIndex = page.slug === 'index';
  const opened = requestedVersion();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_14rem] gap-8">
      <article className="min-w-0">
        <SEOHead title={`${page.title} — ${t.docs}`} description={page.description} />
        <Breadcrumb
          label={language === 'fr' ? 'Fil d’Ariane' : 'Breadcrumb'}
          items={[
            { label: t.docs, to: '/docs' },
            ...(isCategoryIndex ? [] : [{ label: category?.title[language] ?? page.category, to: `/docs/${page.category}` }]),
            { label: isCategoryIndex ? (category?.title[language] ?? page.title) : page.title },
          ]}
        />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{page.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{page.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <StatusBadge status={page.status} language={language} />
          {page.version && (
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" aria-hidden /> {t.version} {page.version}
            </span>
          )}
          {page.updated && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden /> {t.updated} :{' '}
              <time dateTime={page.updated}>{formatDate(page.updated, language)}</time>
            </span>
          )}
        </div>

        {fallback && (
          <p className="mt-4 p-3 rounded-xl text-sm bg-blue-500/10 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Languages className="w-4 h-4 shrink-0" aria-hidden /> {t.fallback}
          </p>
        )}
        {opened && opened !== documentedVersion && (
          <p className="mt-4 p-3 rounded-xl text-sm bg-amber-500/10 text-slate-700 dark:text-slate-300">
            {t.versionNotice(opened, documentedVersion)}
          </p>
        )}

        <div className="mt-6 text-[15px] text-slate-700 dark:text-slate-300" lang={page.language}>
          <Markdown source={page.body} language={page.language} />
        </div>

        {isCategoryIndex && <CategoryList category={page.category} language={language} />}

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 justify-between">
          {previous ? (
            <Link
              to={previous.path}
              rel="prev"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-tsa-blue-500 text-sm"
            >
              <ArrowLeft className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
              <span>
                <span className="block text-[10px] uppercase text-slate-400">{t.previous}</span>
                <span className="font-semibold">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={next.path}
              rel="next"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-tsa-blue-500 text-sm text-right ml-auto"
            >
              <span>
                <span className="block text-[10px] uppercase text-slate-400">{t.next}</span>
                <span className="font-semibold">{next.title}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
            </Link>
          )}
        </div>
        <p className="mt-6">
          <a
            href={reportUrl(page)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-tsa-blue-600 dark:hover:text-tsa-cyan-400"
          >
            <Flag className="w-4 h-4" aria-hidden /> {t.report}
          </a>
        </p>
      </article>

      {toc.length > 1 && (
        <aside className="hidden xl:block">
          <nav aria-label={t.toc} className="sticky top-24 text-sm">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">{t.toc}</p>
            <ul className="space-y-1.5 border-l border-slate-200 dark:border-slate-800">
              {toc.map((entry) => (
                <li key={entry.id} className={entry.level === 3 ? 'pl-6' : 'pl-3'}>
                  <a
                    href={`#${entry.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth' });
                      history.replaceState(history.state, '', `#${entry.id}`);
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-tsa-blue-600 dark:hover:text-tsa-cyan-400"
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
};

const DocNotFound: React.FC<{ language: DocLanguage }> = ({ language }) => {
  const t = ui[language];
  return (
    <div className="py-12 text-center">
      <SEOHead title={t.notFoundTitle} description={t.notFoundText} />
      <FileQuestion className="w-12 h-12 mx-auto text-slate-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{t.notFoundTitle}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t.notFoundText}</p>
      <Link to="/docs" className="inline-block mt-6 px-4 py-2 rounded-xl bg-tsa-blue-600 text-white font-semibold">
        {t.backToDocs}
      </Link>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const DocsPage: React.FC = () => {
  const { language } = useLanguage();
  const lang: DocLanguage = language === 'en' ? 'en' : 'fr';
  const { currentPath } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const path = currentPath.replace(/\/+$/, '') || '/docs';
  const found = path === '/docs' ? undefined : findPage(path, lang);

  // Ancre présente dans l'adresse (#section) : défilement après rendu.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && !id.startsWith('/')) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    setMenuOpen(false);
  }, [path]);

  return (
    <div className="w-full py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="docs-sidebar"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
          >
            {menuOpen ? <X className="w-4 h-4" aria-hidden /> : <Menu className="w-4 h-4" aria-hidden />}
            {ui[lang].menu}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-8 items-start">
          <aside id="docs-sidebar" className={`${menuOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 space-y-4`}>
            <DocSearch language={lang} onNavigate={() => setMenuOpen(false)} />
            <div className="p-3 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 lg:max-h-[calc(100vh-180px)] overflow-y-auto">
              <Sidebar language={lang} currentPath={path} onNavigate={() => setMenuOpen(false)} />
            </div>
          </aside>
          <div className="min-w-0">
            {path === '/docs' ? (
              <DocsHome language={lang} />
            ) : found ? (
              <DocArticleView page={found.page} fallback={found.fallback} language={lang} />
            ) : (
              <DocNotFound language={lang} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
