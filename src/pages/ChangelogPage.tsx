import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { changelogItems } from '../config/changelog';
import { Card } from '../components/Card';
import { SEOHead } from '../components/SEOHead';
import {
  History,
  Tag,
  Calendar,
  PlusCircle,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Changelog — Historique' : 'Changelog — Release Notes'}
        description={
          language === 'fr'
            ? 'Historique des versions et modifications de Tsaraloha Structural Analysis : ajouts, modifications, corrections et points connus.'
            : 'Version history and release notes for Tsaraloha Structural Analysis: additions, changes, bug fixes, and known issues.'
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <History className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Traçabilité des Versions' : 'Release Notes & Commits'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.changelog}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'Toutes les évolutions, refactorisations et correctifs du logiciel TSA sont documentés de manière transparente.'
              : 'Every architectural evolution, refactoring, and bug fix in TSA is systematically recorded.'}
          </p>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-12">
          {changelogItems.map((item) => (
            <Card key={item.version} className="p-8">
              {/* Version & Date Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-tsa-blue-600 text-white font-mono font-bold text-sm">
                    v{item.version}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {language === 'fr' ? 'Développement Interne' : 'Pre-Release Development'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-6">
                {language === 'fr' ? item.titleFr : item.titleEn}
              </h2>

              <div className="space-y-6 text-xs sm:text-sm">
                {/* Added */}
                <div>
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                    <PlusCircle className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Fonctionnalités Ajoutées' : 'Added Features'}</span>
                  </div>
                  <ul className="space-y-2 pl-6 list-disc text-slate-600 dark:text-slate-300">
                    {(language === 'fr' ? item.addedFr : item.addedEn).map((entry, idx) => (
                      <li key={idx}>{entry}</li>
                    ))}
                  </ul>
                </div>

                {/* Changed */}
                {item.changedEn && (
                  <div>
                    <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 mb-3">
                      <RefreshCw className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Modifications & Optimisations' : 'Changed & Refactored'}</span>
                    </div>
                    <ul className="space-y-2 pl-6 list-disc text-slate-600 dark:text-slate-300">
                      {(language === 'fr' ? item.changedFr : item.changedEn)?.map((entry, idx) => (
                        <li key={idx}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixed */}
                {item.fixedEn && (
                  <div>
                    <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>{language === 'fr' ? 'Corrections de Bugs' : 'Fixed Issues'}</span>
                    </div>
                    <ul className="space-y-2 pl-6 list-disc text-slate-600 dark:text-slate-300">
                      {(language === 'fr' ? item.fixedFr : item.fixedEn)?.map((entry, idx) => (
                        <li key={idx}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Known Issues */}
                {item.knownIssuesEn && (
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-500 mb-3">
                      <AlertTriangle className="w-4 h-4 text-slate-400" />
                      <span>{language === 'fr' ? 'Points Connus & En Cours' : 'Known Issues'}</span>
                    </div>
                    <ul className="space-y-2 pl-6 list-disc text-slate-500 dark:text-slate-400">
                      {(language === 'fr' ? item.knownIssuesFr : item.knownIssuesEn)?.map((entry, idx) => (
                        <li key={idx}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
