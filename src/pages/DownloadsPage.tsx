import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/RouterContext';
import { Card } from '../components/Card';
import { DemoProjects } from '../components/DemoProjects';
import { ShowcaseProjects } from '../components/ShowcaseProjects';
import { SEOHead } from '../components/SEOHead';
import { GithubIcon } from '../components/GithubIcon';
import { latestStable, products, releasesOf } from '../config/downloads';
import { ArrowRight, Download } from 'lucide-react';

export const DownloadsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const fr = language === 'fr';

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={fr ? 'Téléchargements' : 'Downloads'}
        description={
          fr
            ? 'Versions officielles de TSA et de TSALab pour Windows x64, empreintes SHA-256 et projets d’exemple.'
            : 'Official TSA and TSALab builds for Windows x64, SHA-256 checksums and example projects.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.nav.downloads}</h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {fr
              ? 'TSA et TSALab sont publiés séparément, chacun avec ses versions, ses notes et ses empreintes. Le téléchargement se fait directement depuis ces pages : le fichier provient de la publication officielle du dépôt.'
              : 'TSA and TSALab are released separately, each with its own versions, notes and checksums. Downloads start directly from these pages: the file comes from the official repository release.'}
          </p>
          <p className="mt-3 text-sm text-slate-500">{fr ? 'Windows (installateur ou version portable), Linux (AppImage), macOS sur processeur Apple (DMG) : chaque système apparaît dès que sa version a été compilée, testée et publiée.' : 'Windows (installer or portable), Linux (AppImage), macOS on Apple silicon (DMG): each system appears once its build has been compiled, tested and published.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {products.map((product) => {
            const stable = latestStable(product.id);
            const count = releasesOf(product.id).releases.length;
            return (
              <Card key={product.id} className="p-6 sm:p-8 flex flex-col min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
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
                        ? 'Aucune version publiée pour l’instant.'
                        : 'No release published yet.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/downloads/${product.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-sm font-semibold"
                  >
                    {stable ? <Download className="w-4 h-4" aria-hidden="true" /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
                    {fr ? `Page de téléchargement de ${product.name}` : `${product.name} download page`}
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

        {/* Projets d'exemple : fichiers .tsa réels, ouvrables dans TSA */}
        <section className="mb-16" aria-labelledby="example-projects">
          <h2 id="example-projects" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {fr ? 'Projets d’exemple' : 'Example projects'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-3xl">
            {fr
              ? 'Sept projets au format natif .tsa, construits avec TSA et vérifiés par sa suite de tests (connexions, calcul OpenSees, équilibre, relecture) : quatre projets complets avec leurs notes de calcul PDF, puis trois modèles filaires. Ouvrez-les avec le bouton Ouvrir du ruban (Ctrl+O).'
              : 'Seven projects in the native .tsa format, built with TSA and checked by its test suite (connections, OpenSees analysis, equilibrium, reload): four complete projects with their PDF design reports, then three wireframe models. Open them with the Open button of the ribbon (Ctrl+O).'}
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
