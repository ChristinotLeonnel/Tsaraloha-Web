import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { docSections } from '../config/docs';
import { DocArticle } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { SEOHead } from '../components/SEOHead';
import {
  BookOpen,
  Search,
  ChevronRight,
  Clock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  const { language } = useLanguage();

  // Find all articles flattened
  const allArticles = useMemo(() => {
    return docSections.flatMap((s) => s.articles);
  }, []);

  const [activeArticleId, setActiveArticleId] = useState<string>(allArticles[0]?.id || 'intro');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeArticle = useMemo(() => {
    return allArticles.find((a) => a.id === activeArticleId) || allArticles[0];
  }, [allArticles, activeArticleId]);

  // Current section of active article
  const currentSection = useMemo(() => {
    return docSections.find((s) => s.articles.some((a) => a.id === activeArticleId));
  }, [activeArticleId]);

  // Next / Previous article navigation
  const currentIndex = allArticles.findIndex((a) => a.id === activeArticleId);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return docSections;
    const query = searchQuery.toLowerCase();

    return docSections
      .map((section) => ({
        ...section,
        articles: section.articles.filter((art) => {
          const title = (language === 'fr' ? art.titleFr : art.titleEn).toLowerCase();
          const desc = (language === 'fr' ? art.descriptionFr : art.descriptionEn).toLowerCase();
          return title.includes(query) || desc.includes(query);
        }),
      }))
      .filter((section) => section.articles.length > 0);
  }, [searchQuery, language]);

  return (
    <div className="w-full py-8 lg:py-12">
      <SEOHead
        title={`${language === 'fr' ? activeArticle.titleFr : activeArticle.titleEn} — Documentation`}
        description={language === 'fr' ? activeArticle.descriptionFr : activeArticle.descriptionEn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Navigation & Search */}
          <aside className="lg:col-span-3 sticky top-24 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher dans la doc...' : 'Search documentation...'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-tsa-surface-dark border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
              />
            </div>

            {/* Navigation Tree */}
            <nav className="p-3 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
              {filteredSections.map((section) => (
                <div key={section.id}>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
                    {language === 'fr' ? section.titleFr : section.titleEn}
                  </div>
                  <ul className="space-y-0.5">
                    {section.articles.map((art) => {
                      const isActive = art.id === activeArticleId;
                      return (
                        <li key={art.id}>
                          <button
                            onClick={() => {
                              setActiveArticleId(art.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                              isActive
                                ? 'bg-tsa-blue-600/10 dark:bg-tsa-blue-600/20 text-tsa-blue-600 dark:text-tsa-cyan-300 font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span>{language === 'fr' ? art.titleFr : art.titleEn}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Right Column: Article Content */}
          <main className="lg:col-span-9 p-6 sm:p-10 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-sm min-h-[600px]">
            {/* Breadcrumb & Metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-4">
              <span>Docs</span>
              <span>/</span>
              <span>{language === 'fr' ? currentSection?.titleFr : currentSection?.titleEn}</span>
              <span>/</span>
              <span className="text-tsa-blue-600 dark:text-tsa-cyan-400 font-semibold">
                {language === 'fr' ? activeArticle.titleFr : activeArticle.titleEn}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              {language === 'fr' ? activeArticle.titleFr : activeArticle.titleEn}
            </h1>

            {/* Article Description & Reading time */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? activeArticle.descriptionFr : activeArticle.descriptionEn}
              </span>
            </div>

            {/* Formatted Content */}
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              {(language === 'fr' ? activeArticle.contentFr : activeArticle.contentEn)
                .split('\n\n')
                .map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h2 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white pt-4 pb-1">
                        {paragraph.replace('### ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                        {paragraph.replace('#### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const match = paragraph.match(/```(\w*)\n([\s\S]*?)```/);
                    if (match) {
                      return (
                        <CodeBlock
                          key={idx}
                          language={match[1] || 'bash'}
                          code={match[2]}
                          showLineNumbers
                        />
                      );
                    }
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-tsa-blue-600 dark:border-tsa-cyan-400 text-xs sm:text-sm text-slate-700 dark:text-slate-300 my-4"
                      >
                        {paragraph.replace('> ', '')}
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
            </div>

            {/* Bottom Next / Previous Article Navigation */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              {prevArticle ? (
                <button
                  onClick={() => {
                    setActiveArticleId(prevArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-normal uppercase">
                      {language === 'fr' ? 'Précédent' : 'Previous'}
                    </span>
                    <span>{language === 'fr' ? prevArticle.titleFr : prevArticle.titleEn}</span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticle && (
                <button
                  onClick={() => {
                    setActiveArticleId(nextArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors ml-auto"
                >
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-normal uppercase">
                      {language === 'fr' ? 'Suivant' : 'Next'}
                    </span>
                    <span>{language === 'fr' ? nextArticle.titleFr : nextArticle.titleEn}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
