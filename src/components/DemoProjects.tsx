import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { demoProjects, exampleUrl, screenshots } from '../config/screenshots';
import { ScreenshotFigure } from './ScreenshotFigure';
import { TsaIcon } from './TsaIcon';

const fmt = (n: number, lang: 'fr' | 'en', digits = 0) =>
  n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Les trois projets de démonstration : capture réelle, description, valeurs relevées sur le modèle, fichier .tsa. */
export const DemoProjects: React.FC<{ headingLevel?: 'h2' | 'h3' | 'h4' }> = ({ headingLevel = 'h3' }) => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const Heading = headingLevel;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {demoProjects.map((p) => {
        const gallery = screenshots.filter((s) => s.project === p.id).map((s) => s.id);
        const stats: [string, string][] = [
          [fr ? 'Nœuds' : 'Nodes', fmt(p.nodes, language)],
          [fr ? 'Barres' : 'Members', fmt(p.bars, language)],
          [fr ? 'Appuis' : 'Supports', fmt(p.supports, language)],
          [fr ? 'Longueur de barres' : 'Member length', `${fmt(p.length, language)} m`],
        ];
        return (
          <article key={p.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card p-4 sm:p-5 shadow-sm">
            <ScreenshotFigure id={p.cover} gallery={gallery} sizes="(min-width: 1024px) 33vw, 100vw" captionClassName="sr-only" />
            <Heading className="mt-4 text-base font-bold text-slate-900 dark:text-white">{p.title[language]}</Heading>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.description[language]}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {stats.map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="font-mono font-semibold text-slate-900 dark:text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <TsaIcon name="analysisRun" size={16} className="mt-0.5" />
              <span>
                {fr
                  ? `Calcul OpenSees sous poids propre effectué : structure stable, déplacement maximal ${fmt(p.maxDisplacementMm, language, 1)} mm.`
                  : `OpenSees self-weight analysis run: stable structure, maximum displacement ${fmt(p.maxDisplacementMm, language, 1)} mm.`}
              </span>
            </p>
            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
              <a
                href={exampleUrl(p.file)}
                download={p.file}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-4 h-4" aria-hidden />
                {fr ? 'Télécharger le projet .tsa' : 'Download the .tsa project'}
              </a>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {gallery.length} {fr ? 'captures' : 'screenshots'}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
};
