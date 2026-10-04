import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/Button';
import { SEOHead } from '../components/SEOHead';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-20 px-4">
      <SEOHead title="404 — Page Not Found" />

      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-400 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <span className="font-mono text-xs font-bold text-tsa-blue-600 dark:text-tsa-cyan-400 uppercase tracking-widest">
          ERROR 404
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4">
          {language === 'fr' ? 'Page Introuvable' : 'Coordinate Not Found'}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {language === 'fr'
            ? 'La page ou la ressource que vous recherchez semble inexistante ou a été déplacée.'
            : 'The spatial coordinates or documentation article you requested could not be located.'}
        </p>

        <Button href="/" variant="primary" icon={<Home className="w-4 h-4" />}>
          {language === 'fr' ? 'Retour à l\'Accueil' : 'Return to Home'}
        </Button>
      </div>
    </div>
  );
};
