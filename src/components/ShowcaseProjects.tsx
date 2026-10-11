import React from 'react';
import { Download, FileText, TriangleAlert } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { exampleFileUrl, noteUrl, showcaseProjects } from '../config/showcase';
import { ScreenshotFigure } from './ScreenshotFigure';
import { TsaIcon } from './TsaIcon';

const fmt = (n: number, lang: 'fr' | 'en', digits = 0) =>
  n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Quatre projets complets réalisés dans TSA : captures réelles, inventaire, résultats du calcul, limites, fichiers. */
export const ShowcaseProjects: React.FC = () => {
  const { language } = useLanguage();
  const fr = language === 'fr';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {showcaseProjects.map((p) => {
        const inventory: [string, string][] = [
          [fr ? 'Nœuds' : 'Nodes', fmt(p.nodes, language)],
          [fr ? 'Barres' : 'Members', fmt(p.members, language)],
          ...(p.cables ? ([[fr ? 'Câbles' : 'Cables', fmt(p.cables, language)]] as [string, string][]) : []),
          ...(p.slabs || p.walls
            ? ([[fr ? 'Dalles / voiles' : 'Slabs / walls', `${fmt(p.slabs, language)} / ${fmt(p.walls, language)}`]] as [string, string][])
            : []),
          [fr ? 'Semelles' : 'Footings', fmt(p.footings, language)],
        ];
        return (
          <article
            key={p.id}
            aria-labelledby={`showcase-${p.id}`}
            className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card p-4 sm:p-5 shadow-sm"
          >
            <ScreenshotFigure id={p.shots[0]} gallery={p.shots} sizes="(min-width: 1024px) 50vw, 100vw" captionClassName="sr-only" />
            <h3 id={`showcase-${p.id}`} className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {p.title[language]}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.description[language]}</p>

            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {inventory.map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="font-mono font-semibold text-slate-900 dark:text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-3 text-xs text-slate-700 dark:text-slate-300">
              <p className="flex items-start gap-2 font-semibold text-slate-900 dark:text-white">
                <TsaIcon name="analysisRun" size={16} className="mt-0.5" />
                {fr ? 'Calcul OpenSees réel (combinaison ELU)' : 'Real OpenSees analysis (ULS combination)'}
              </p>
              <ul className="mt-1.5 ml-6 list-disc space-y-0.5">
                <li>
                  {fr
                    ? `Charges verticales ${fmt(p.eluLoadKN, language)} kN, équilibre des réactions vérifié.`
                    : `Vertical loads ${fmt(p.eluLoadKN, language)} kN, reaction equilibrium verified.`}
                </li>
                <li>
                  {fr
                    ? `Déplacement maximal ${fmt(p.maxDisplacementMm, language, 1)} mm (${p.maxDisplacementWhere.fr}).`
                    : `Maximum displacement ${fmt(p.maxDisplacementMm, language, 1)} mm (${p.maxDisplacementWhere.en}).`}
                </li>
                <li>{p.extra[language]}</li>
              </ul>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" aria-hidden />
              <span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{fr ? 'Limites : ' : 'Limits: '}</span>
                {p.limits[language]}
              </span>
            </p>

            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
              <a
                href={exampleFileUrl(p.file)}
                download={p.file}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-xs font-semibold"
              >
                <Download className="w-4 h-4" aria-hidden />
                {fr ? 'Projet .tsa' : '.tsa project'}
              </a>
              <a
                href={noteUrl(p.noteSimplified)}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                <FileText className="w-4 h-4" aria-hidden />
                {fr ? 'Note simplifiée (PDF)' : 'Simplified report (PDF, French)'}
              </a>
              <a
                href={noteUrl(p.noteDetailed)}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                <FileText className="w-4 h-4" aria-hidden />
                {fr ? 'Note détaillée (PDF)' : 'Detailed report (PDF, French)'}
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
};
