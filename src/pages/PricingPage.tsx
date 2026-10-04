import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { pricingTiers, pricingNotice } from '../config/pricing';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import {
  Check,
  X,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Tarifs & Éditions' : 'Pricing & Editions'}
        description={
          language === 'fr'
            ? 'Découvrez les éditions de Tsaraloha Structural Analysis : Community, Professionnel et Entreprise. Structure tarifaire configurable et transparente.'
            : 'Explore Tsaraloha Structural Analysis editions: Community, Professional, and Enterprise. Transparent and configurable pricing structure.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <span>{language === 'fr' ? 'Éditions du Logiciel' : 'Software Editions'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'fr' ? 'Une Offre Adaptée à Chaque Échelle' : 'Engineered for Every Project Scale'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {language === 'fr'
              ? 'De l\'exploration académique aux projets d\'ingénierie d\'infrastructures complexes, choisissez l\'édition TSA adaptée à vos besoins.'
              : 'From academic research to large-scale infrastructure consulting, select the TSA edition that matches your engineering needs.'}
          </p>
        </div>

        {/* Regulatory Pricing Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center gap-3 max-w-4xl mx-auto mb-12">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            <strong className="font-semibold">{language === 'fr' ? 'Note importante : ' : 'Notice : '}</strong>
            {language === 'fr' ? pricingNotice.fr : pricingNotice.en}
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {pricingTiers.map((tier) => {
            const isPopular = tier.popular;

            return (
              <Card
                key={tier.id}
                hoverEffect
                className={`p-8 flex flex-col justify-between relative ${
                  isPopular
                    ? 'border-tsa-blue-500 ring-2 ring-tsa-blue-500/20 shadow-2xl tech-glow'
                    : ''
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-tsa-blue-600 to-tsa-cyan-400 text-white shadow-md">
                      {language === 'fr' ? tier.badgeFr : tier.badgeEn}
                    </span>
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {language === 'fr' ? tier.nameFr : tier.name}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] mb-6">
                    {language === 'fr' ? tier.descriptionFr : tier.descriptionEn}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                      {language === 'fr' ? tier.priceFr : tier.priceEn}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {language === 'fr' ? tier.periodFr : tier.periodEn}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 opacity-40" />
                        )}
                        <span
                          className={
                            feat.included
                              ? 'text-slate-700 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-500 line-through'
                          }
                        >
                          {language === 'fr' ? feat.textFr : feat.textEn}
                          {feat.noteEn && (
                            <span className="ml-1 text-[10px] text-tsa-blue-500 font-mono">
                              ({language === 'fr' ? feat.noteFr : feat.noteEn})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  href={tier.ctaLink}
                  variant={isPopular ? 'glow' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {language === 'fr' ? tier.ctaTextFr : tier.ctaTextEn}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Pricing FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            {language === 'fr' ? 'Questions Fréquentes sur les Licences' : 'Pricing & Licensing FAQ'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? 'L\'édition Community restera-t-elle gratuite ?' : 'Will the Community edition remain free?'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Oui. L\'édition Community est pensée pour permettre aux étudiants, enseignants et chercheurs d\'apprendre et d\'expérimenter avec TSA sans frais de licence logicielle.'
                  : 'Yes. The Community edition is designed to empower students, professors, and researchers to model and analyze frames without license barriers.'}
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? 'Comment les prix seront-ils fixés ?' : 'How will commercial pricing be established?'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'La tarification commerciale sera annoncée lors du lancement public officiel après consultation de nos partenaires bureaux d\'études.'
                  : 'Commercial pricing will be finalized and announced ahead of the general release following feedback from partner engineering offices.'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
