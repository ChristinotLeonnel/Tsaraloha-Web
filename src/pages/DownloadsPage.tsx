import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/RouterContext';
import { Card } from '../components/Card';
import { BrandLogo } from '../components/BrandLogo';
import { DemoProjects } from '../components/DemoProjects';
import { ShowcaseProjects } from '../components/ShowcaseProjects';
import { SEOHead } from '../components/SEOHead';
import { GithubIcon } from '../components/GithubIcon';
import { latestStable, products, releasesOf, formatBytes } from '../config/downloads';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  HardDrive,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DownloadsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const fr = language === 'fr';
  const tsaStable = latestStable('tsa');
  const tsaInstaller = tsaStable?.assets.find((a) => a.format === 'installer' && a.os === 'windows');
  const [hashCopied, setHashCopied] = useState(false);

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    } catch {
      setHashCopied(false);
    }
  };

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={fr ? 'Téléchargement officiel de TSA' : 'Official TSA Downloads'}
        description={
          fr
            ? 'Téléchargez Tsaraloha Structural Analysis (TSA) pour Windows x64 : installateur officiel autonome, calcul par éléments finis, modélisation 3D OpenCASCADE.'
            : 'Download Tsaraloha Structural Analysis (TSA) for Windows x64: official standalone installer, finite element analysis, OpenCASCADE 3D CAD.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-400 border border-tsa-blue-500/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{fr ? 'Plateforme Officielle de Distribution Tsaraloha' : 'Official Tsaraloha Distribution Platform'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.downloads}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {fr
              ? 'Téléchargez directement le logiciel d’ingénierie structurelle TSA sans intermédiaire. Aucun compte ni compilation requis : l’installateur officiel Windows autonome installe l’ensemble des bibliothèques nécessaires.'
              : 'Download TSA structural engineering software directly without third-party services. No account or compilation required: the official standalone Windows installer deploys all required runtime libraries.'}
          </p>
        </div>

        {/* HERO FLAGSHIP : TSA (Inspiré des installateurs professionnels Autodesk) */}
        <div className="mb-14 rounded-2xl p-6 sm:p-10 border border-tsa-blue-500/30 bg-gradient-to-br from-slate-50 via-white to-tsa-blue-50/50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-tsa-blue-950/40 shadow-xl relative overflow-hidden backdrop-blur-sm">
          {/* Accent d'ambiance visuelle */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-bl from-tsa-cyan-400/10 to-tsa-blue-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Colonne d'identité et présentation */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <BrandLogo size="lg" surface="auto" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Tsaraloha Structural Analysis
                    </h2>
                  </div>
                  <p className="text-sm font-medium text-tsa-blue-600 dark:text-tsa-cyan-400">
                    {fr ? 'Éditeur : Tsaraloha Software' : 'Publisher: Tsaraloha Software'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {fr ? `Version Stable ${tsaStable?.version ?? '0.1.0'}` : `Stable Release ${tsaStable?.version ?? '0.1.0'}`}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Windows 10 / 11 (64 bits)
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-tsa-blue-500/10 text-tsa-blue-700 dark:text-tsa-cyan-300 border border-tsa-blue-500/20">
                  {fr ? 'Hébergement Direct HTTPS' : 'Direct HTTPS Hosting'}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {fr
                  ? 'Suite complète de modélisation géométrique 3D (OpenCASCADE) et d’analyse des structures aux éléments finis (OpenSees, Gmsh). Conçue pour les ingénieurs en génie civil, bureaux d’études et chercheurs.'
                  : 'Complete suite for 3D CAD modeling (OpenCASCADE) and finite element structural analysis (OpenSees, Gmsh). Engineered for structural engineers, design offices and researchers.'}
              </p>

              {/* Spécifications rapides */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 mb-6 text-xs">
                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{fr ? 'Taille du package' : 'Package size'}</span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {tsaInstaller ? formatBytes(tsaInstaller.size, language) : '66.5 Mo'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{fr ? 'Espace disque' : 'Disk space'}</span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">~600 Mo</div>
                </div>
                <div>
                  <div className="text-slate-500 flex items-center gap-1 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{fr ? 'Moteurs intégrés' : 'Engines'}</span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">OCCT, OpenSees, Gmsh</div>
                </div>
              </div>

              {/* Bouton d'action principal */}
              <div className="flex flex-wrap items-center gap-4">
                {tsaInstaller ? (
                  <a
                    href={tsaInstaller.url}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-base font-bold shadow-lg shadow-tsa-blue-600/25 transition-all transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsa-blue-500"
                  >
                    <Download className="w-5 h-5" aria-hidden="true" />
                    <span>
                      {fr
                        ? `Télécharger TSA pour Windows (${formatBytes(tsaInstaller.size, language)})`
                        : `Download TSA for Windows (${formatBytes(tsaInstaller.size, language)})`}
                    </span>
                  </a>
                ) : (
                  <Link
                    to="/downloads/tsa"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-base font-bold shadow-lg shadow-tsa-blue-600/25 transition-all"
                  >
                    <Download className="w-5 h-5" aria-hidden="true" />
                    <span>{fr ? 'Page de téléchargement TSA' : 'TSA Download Page'}</span>
                  </Link>
                )}

                <Link
                  to="/downloads/tsa"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{fr ? 'Détails, SHA-256 & Prérequis' : 'Details, SHA-256 & Specs'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Colonne latérale d'intégrité et de sécurité */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {fr ? 'Intégrité du package' : 'Package Integrity'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SHA-256
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg break-all select-all border border-slate-200/60 dark:border-slate-800">
                  {tsaInstaller?.sha256 ?? '81036c519627198715ee415c8528f579528fab8feadd9e81742805d5d2840e31'}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyHash(tsaInstaller?.sha256 ?? '81036c519627198715ee415c8528f579528fab8feadd9e81742805d5d2840e31')
                  }
                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {hashCopied
                      ? fr
                        ? 'Empreinte copiée dans le presse-papiers'
                        : 'Checksum copied to clipboard'
                      : fr
                        ? 'Copier l’empreinte SHA-256'
                        : 'Copy SHA-256 checksum'}
                  </span>
                </button>
              </div>

              {/* Raccourcis vers la documentation */}
              <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <Sparkles className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" />
                  <span>{fr ? 'Points clés de l’installateur TSA' : 'Key TSA Installer Features'}</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc">
                  <li>{fr ? 'Assistant moderne en français et anglais' : 'Modern wizard in English and French'}</li>
                  <li>{fr ? 'Aucun privilège administrateur imposé' : 'No mandatory administrator privileges'}</li>
                  <li>{fr ? 'Association native des fichiers .tsa et aperçus 3D' : 'Native .tsa file association and 3D thumbnails'}</li>
                  <li>{fr ? 'Préservation absolue des projets utilisateur' : 'Guaranteed preservation of user projects'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Autres produits de l'écosystème Tsaraloha */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {fr ? 'Autres logiciels de l’écosystème Tsaraloha' : 'Other Tsaraloha Ecosystem Software'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products
              .filter((p) => p.id !== 'tsa')
              .map((product) => {
                const stable = latestStable(product.id);
                const count = releasesOf(product.id).releases.length;
                return (
                  <Card key={product.id} className="p-6 sm:p-8 flex flex-col min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{product.fullName}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 flex-1">
                      {stable
                        ? fr
                          ? `Dernière version stable : ${stable.version}.`
                          : `Latest stable release: ${stable.version}.`
                        : count
                          ? fr
                            ? `Aucune version stable ; ${count} préversion(s) disponible(s) pour les essais.`
                            : `No stable release; ${count} pre-release(s) available for testing.`
                          : fr
                            ? 'Logiciel en cours de développement. Les packages d’installation seront disponibles prochainement.'
                            : 'Software currently in development. Installation packages will be published soon.'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/downloads/${product.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 text-sm font-semibold"
                      >
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        {fr ? `Page de ${product.name}` : `${product.name} Page`}
                      </Link>
                      <a
                        href={`https://github.com/${product.sourceRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <GithubIcon className="w-4 h-4" />
                        {fr ? 'Code source (MIT)' : 'Source code (MIT)'}
                      </a>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Projets d'exemple : fichiers .tsa réels, ouvrables dans TSA */}
        <section className="mb-16" aria-labelledby="example-projects">
          <h2 id="example-projects" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {fr ? 'Projets d’exemple prêts à l’analyse' : 'Ready-to-analyze example projects'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-3xl">
            {fr
              ? 'Sept projets au format natif .tsa, construits avec TSA et vérifiés par sa suite de tests (connexions, calcul OpenSees, équilibre, relecture) : quatre projets complets avec leurs notes de calcul PDF, puis trois modèles filaires. Ouvrez-les directement dans TSA avec Ctrl+O.'
              : 'Seven projects in native .tsa format, created with TSA and validated by its test suite (connections, OpenSees solver, equilibrium, reload): four complete projects with PDF reports, and three wireframe models. Open them in TSA with Ctrl+O.'}
          </p>
          <ShowcaseProjects />
          <div className="mt-8">
            <DemoProjects />
          </div>
        </section>
      </div>
    </div>
  );
};
