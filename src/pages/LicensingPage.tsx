import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SEOHead } from '../components/SEOHead';
import { siteConfig } from '../config/site';
import {
  Scale,
  ShieldCheck,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const LicensingPage: React.FC = () => {
  const { language } = useLanguage();

  const thirdPartyLicenses = [
    {
      name: 'OpenSees (PEER / UC Berkeley)',
      role: 'Finite Element Analysis Solver',
      license: 'OpenSees Software License (University of California Regents)',
      url: 'https://opensees.berkeley.edu/',
      summaryEn: 'Open-source scientific simulation engine. Used for solving linear and nonlinear structural matrices.',
      summaryFr: 'Moteur de calcul scientifique open source. Utilisé pour la résolution matricielle linéaire et non-linéaire.',
    },
    {
      name: 'OpenCASCADE Technology (OCCT)',
      role: '3D CAD & Geometric Modeling Kernel',
      license: 'GNU Lesser General Public License (LGPL 2.1) with Open CASCADE Exception',
      url: 'https://dev.opencascade.org/',
      summaryEn: 'Industrial 3D B-Rep solid modeling and AIS/V3d visualization framework.',
      summaryFr: 'Noyau géométrique volumique B-Rep et moteur d\'affichage 3D AIS/V3d.',
    },
    {
      name: 'Qt Framework',
      role: 'Desktop GUI and Windowing Framework',
      license: 'GNU LGPLv3 / Commercial Qt License',
      url: 'https://www.qt.io/',
      summaryEn: 'Cross-platform native user interface widgets and event loop infrastructure.',
      summaryFr: 'Composants graphiques natifs, fenêtrage et gestion événementielle multiplateforme.',
    },
    {
      name: 'Eigen Template Library',
      role: 'Linear Algebra & Matrix Operations',
      license: 'Mozilla Public License 2.0 (MPL2)',
      url: 'https://eigen.tuxfamily.org/',
      summaryEn: 'High-performance C++ matrix algebra, vectorization, and dense/sparse solvers.',
      summaryFr: 'Algèbre linéaire C++, vectorisation et solveurs denses/creux.',
    },
    {
      name: 'Lucide Icons',
      role: 'Iconography & UI Symbols',
      license: 'ISC License',
      url: 'https://lucide.dev/',
      summaryEn: 'Open-source SVG symbol library for modern user interfaces.',
      summaryFr: 'Bibliothèque de symboles graphiques vectoriels pour interfaces modernes.',
    },
  ];

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Licences & Mentions Légales' : 'Licensing & Legal Notices'}
        description={
          language === 'fr'
            ? 'Licences de Tsaraloha Structural Analysis et des bibliothèques tierces intégrées : OpenSees, OpenCASCADE, Qt, Eigen.'
            : 'Licenses for Tsaraloha Structural Analysis and integrated third-party frameworks: OpenSees, OpenCASCADE, Qt, Eigen.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Cadre Juridique & Propriété Intellectuelle' : 'Legal Framework & Intellectual Property'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'fr' ? 'Licences du Logiciel & Composants Tiers' : 'Software Licensing & Third-Party Terms'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'TSA respecte rigoureusement les droits de propriété intellectuelle des fondations, universités et auteurs des bibliothèques scientifiques intégrées.'
              : 'TSA strictly adheres to the intellectual property and licensing terms of the academic institutions and open-source foundations whose libraries power our software.'}
          </p>
        </div>

        {/* TSA Software License Policy */}
        <div className="p-8 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? '1. Licence du Logiciel TSA' : '1. TSA Software License'}
            </h2>
            <span className="px-3 py-1 rounded-full bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-400 text-xs font-mono font-semibold">
              v0.1.0-dev
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {language === 'fr'
              ? 'Tsaraloha Structural Analysis est actuellement en phase de développement actif par Christinot Leonnel Tsaraloha. Le modèle de distribution prévoit une édition Communautaire ouverte pour l\'apprentissage et la recherche, et des licences professionnelles pour les usages commerciaux en ingénierie de production.'
              : 'Tsaraloha Structural Analysis is currently in active pre-release development by Christinot Leonnel Tsaraloha. The release strategy encompasses an open Community edition for academic exploration, alongside licensed Professional editions for certified production design offices.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'fr' ? 'Usage Académique' : 'Academic & Education'}
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {language === 'fr'
                  ? 'Libre d\'utilisation pour l\'enseignement, la recherche et les projets d\'études.'
                  : 'Free access for students, researchers, and structural mechanics courses.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'fr' ? 'Redistribution' : 'Redistribution'}
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {language === 'fr'
                  ? 'Les binaires doivent conserver les mentions légales et attributions des bibliothèques tierces.'
                  : 'Official binaries retain all third-party notices, disclaimers, and copyrights.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'fr' ? 'Responsabilité Légale' : 'Professional Liability'}
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {language === 'fr'
                  ? 'La validation des calculs réglementaires relève exclusivement de l\'ingénieur certifié.'
                  : 'Structural approvals remain the exclusive legal responsibility of the licensed engineer.'}
              </p>
            </div>
          </div>
        </div>

        {/* Third-Party Attributions */}
        <div className="mb-12">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 mb-2">
            {language === 'fr' ? 'Composants Tiers Intégrés' : 'Integrated Third-Party Frameworks'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            {language === 'fr' ? '2. Attributions Scientifiques & Logicielles' : '2. Scientific & Software Attributions'}
          </h2>

          <div className="space-y-4">
            {thirdPartyLicenses.map((item, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">({item.role})</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-tsa-blue-600 dark:text-tsa-cyan-400 hover:underline font-mono"
                  >
                    <span>{item.license}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {language === 'fr' ? item.summaryFr : item.summaryEn}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Link to LICENSES.md file in repository */}
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-tsa-surface-dark border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-tsa-blue-600 dark:text-tsa-cyan-400" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                LICENSES.md
              </div>
              <div className="text-xs text-slate-500">
                {language === 'fr'
                  ? 'Consultez le fichier brut des licences au format Markdown dans le dépôt.'
                  : 'View the raw Markdown license notice document in the repository.'}
              </div>
            </div>
          </div>
          <a
            href={`${siteConfig.urls.github}/blob/main/LICENSES.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            {language === 'fr' ? 'Ouvrir LICENSES.md sur GitHub' : 'Open LICENSES.md on GitHub'}
          </a>
        </div>
      </div>
    </div>
  );
};
