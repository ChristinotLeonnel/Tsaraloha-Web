import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { downloadPlatforms, systemRequirements } from '../config/downloads';
import { siteConfig } from '../config/site';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CodeBlock } from '../components/CodeBlock';
import { SEOHead } from '../components/SEOHead';
import { GithubIcon } from '../components/GithubIcon';
import {
  Download,
  Monitor,
  Terminal,
  Cpu,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const DownloadsPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Téléchargements' : 'Downloads'}
        description={
          language === 'fr'
            ? 'Téléchargements officiels de Tsaraloha Structural Analysis pour Windows, Linux et code source C++20.'
            : 'Official downloads for Tsaraloha Structural Analysis for Windows, Linux, and C++20 source code.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Binaires & Code Source' : 'Binaries & Source Code'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.downloads}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'TSA est un logiciel desktop natif développé pour Windows et Linux. Les installateurs pré-packagés seront publiés sur GitHub Releases dès la finalisation du jalon v0.1.0 public.'
              : 'TSA is a native desktop software engineered for Windows and Linux workstations. Standalone installers will be released on GitHub Releases upon milestone completion.'}
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {downloadPlatforms.map((platform) => {
            const isSource = platform.os === 'source';

            return (
              <Card
                key={platform.id}
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-400 flex items-center justify-center">
                        {isSource ? (
                          <Terminal className="w-5 h-5" />
                        ) : (
                          <Monitor className="w-5 h-5" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {platform.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {platform.version}
                    </span>
                  </div>

                  {/* Status Banner */}
                  <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{language === 'fr' ? platform.statusFr : platform.statusEn}</span>
                  </div>

                  {/* Requirements List */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'fr' ? 'Configuration Requise :' : 'Prerequisites :'}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {(language === 'fr' ? platform.requirementsFr : platform.requirementsEn).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Command Snippet for Source */}
                  {platform.commandSnippet && (
                    <div className="mb-6">
                      <CodeBlock
                        code={platform.commandSnippet}
                        language="bash"
                        filename="build_instructions.sh"
                      />
                    </div>
                  )}
                </div>

                {/* Download / GitHub Release Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={platform.githubReleaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>
                      {isSource
                        ? language === 'fr'
                          ? 'Dépôt GitHub C++20'
                          : 'C++20 GitHub Repository'
                        : language === 'fr'
                        ? 'Consulter GitHub Releases'
                        : 'View GitHub Releases'}
                    </span>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>

        {/* System Requirements Table */}
        <div className="p-8 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-tsa-blue-600 dark:text-tsa-cyan-400" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {language === 'fr' ? 'Spécifications Matérielles Conseillées' : 'System Hardware Requirements'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'fr'
                  ? 'Pour une fluidité optimale lors de la manipulation de grands modèles 3D et du maillage surfacique.'
                  : 'Recommended configuration for smooth 3D viewport navigation and high-density surface meshing.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase">
                  <th className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Composant' : 'Component'}</th>
                  <th className="py-3 px-4 font-semibold">{language === 'fr' ? 'Configuration Minimale' : 'Minimum Requirements'}</th>
                  <th className="py-3 pl-4 font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400">{language === 'fr' ? 'Recommandée (Ingénierie)' : 'Recommended (Engineering)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Système d\'exploitation' : 'Operating System'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.os}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.os}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Processeur (CPU)' : 'Processor (CPU)'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.cpu}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.cpu}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Mémoire Vive (RAM)' : 'System Memory (RAM)'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.ram}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.ram}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Carte Graphique (GPU)' : 'Graphics (GPU)'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.gpu}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.gpu}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Stockage' : 'Disk Storage'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.disk}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.disk}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">{language === 'fr' ? 'Affichage' : 'Display'}</td>
                  <td className="py-3 px-4">{systemRequirements.minimum.display}</td>
                  <td className="py-3 pl-4 font-medium">{systemRequirements.recommended.display}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
