import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/Button';
import { SEOHead } from '../components/SEOHead';
import { BrandLogo } from '../components/BrandLogo';
import { House, BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const fr = language === 'fr';

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-20 px-4">
      <SEOHead title={fr ? '404 — Page introuvable' : '404 — Page not found'} />

      <div className="max-w-md mx-auto text-center">
        <BrandLogo size="xl" className="mx-auto mb-6" />

        <span className="font-mono text-xs font-bold text-tsa-blue-700 dark:text-tsa-cyan-300 uppercase tracking-widest">
          {fr ? 'Erreur 404' : 'Error 404'}
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4">
          {fr ? 'Page introuvable' : 'Page not found'}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {fr
            ? 'La page demandée n’existe pas ou a été déplacée. La documentation et l’accueil restent accessibles.'
            : 'The requested page does not exist or has moved. The documentation and home page are still available.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary" icon={<House className="w-4 h-4" />}>
            {fr ? 'Retour à l’accueil' : 'Back to home'}
          </Button>
          <Button href="/docs" variant="outline" icon={<BookOpen className="w-4 h-4" />}>
            {fr ? 'Documentation' : 'Documentation'}
          </Button>
        </div>
      </div>
    </div>
  );
};
