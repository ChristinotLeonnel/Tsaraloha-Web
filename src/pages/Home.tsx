import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { featureItems } from '../config/features';
import { InteractiveViewport } from '../components/InteractiveViewport';
import { EngineeringWorkflow } from '../components/EngineeringWorkflow';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { Link } from '../router/RouterContext';
import { GithubIcon } from '../components/GithubIcon';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  Zap,
  Download,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();

  const previewFeatures = featureItems.slice(0, 6);

  return (
    <div className="w-full">
      <SEOHead
        title={language === 'fr' ? 'Accueil' : 'Home'}
        description={language === 'fr' ? siteConfig.descriptionFr : siteConfig.descriptionEn}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-radial-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Pre-release Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 border border-tsa-blue-500/20 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-300">
                <span className="w-2 h-2 rounded-full bg-tsa-cyan-400 animate-pulse" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {siteConfig.shortName} —{' '}
                <span className="bg-gradient-to-r from-tsa-blue-600 via-blue-500 to-tsa-cyan-400 bg-clip-text text-transparent">
                  {language === 'fr' ? 'Analyse Structurale' : 'Structural Analysis'}
                </span>
              </h1>

              {/* Tagline & Subtitle */}
              <p className="text-lg sm:text-xl font-medium text-tsa-blue-600 dark:text-tsa-cyan-300 tracking-wide font-mono">
                {language === 'fr' ? siteConfig.taglineFr : siteConfig.taglineEn}
              </p>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t.hero.description}
              </p>

              {/* 4 Main CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button href="/features" variant="glow" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                  {t.hero.ctaDiscover}
                </Button>
                <Button href="/downloads" variant="primary" size="lg" icon={<Download className="w-4 h-4" />}>
                  {t.hero.ctaDownload}
                </Button>
                <Button href="/docs" variant="outline" size="lg" icon={<BookOpen className="w-4 h-4" />}>
                  {t.hero.ctaDocs}
                </Button>
                <Button
                  href={siteConfig.urls.github}
                  variant="secondary"
                  size="lg"
                  icon={<GithubIcon className="w-4 h-4" />}
                >
                  {t.hero.ctaGithub}
                </Button>
              </div>

              {/* Technical Specifications Bar */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">●</span>
                  <span>Kernel: OpenCASCADE (B-Rep)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-tsa-blue-500">●</span>
                  <span>Solver: OpenSees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-tsa-cyan-400">●</span>
                  <span>Language: C++20</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Structural Viewport */}
            <div className="lg:col-span-6 w-full">
              <div className="relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-tsa-blue-600/30 to-tsa-cyan-400/20 blur-xl opacity-75" />
                <InteractiveViewport />
              </div>
              <p className="mt-2 text-center text-xs text-slate-400 font-mono">
                {language === 'fr'
                  ? 'Simulation interactive du portique spatial : déformée {U}, moments fléchissants My et réactions.'
                  : 'Interactive portal frame simulation: deformed shape {U}, bending moments My and reactions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Highlights Section */}
      <section className="py-16 sm:py-24 bg-slate-100/50 dark:bg-tsa-navy-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.highlights.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              {t.highlights.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Highlight 1: C++20 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-tsa-blue-600 dark:text-tsa-blue-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.highlights.cplusplus}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.highlights.cplusplusDesc}
              </p>
            </Card>

            {/* Highlight 2: OpenSees */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-tsa-cyan-500 dark:text-tsa-cyan-300 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.highlights.opensees}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.highlights.openseesDesc}
              </p>
            </Card>

            {/* Highlight 3: OpenCASCADE */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-5">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.highlights.cadKernel}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.highlights.cadKernelDesc}
              </p>
            </Card>

            {/* Highlight 4: TSALib */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t.highlights.tsalib}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.highlights.tsalibDesc}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Engineering Workflow Interactive Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Méthodologie Déterministe' : 'Deterministic Methodology'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.workflow.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t.workflow.subtitle}
          </p>
        </div>

        <EngineeringWorkflow />
      </section>

      {/* Features Overview Preview */}
      <section className="py-16 sm:py-24 bg-slate-100/50 dark:bg-tsa-navy-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 mb-2">
                {language === 'fr' ? 'Modules & Capacités' : 'Modules & Capabilities'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === 'fr' ? 'Conçu pour tous les types d\'ouvrages' : 'Engineered for Every Structure'}
              </h2>
            </div>
            <Button href="/features" variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              {language === 'fr' ? 'Voir toutes les fonctionnalités' : 'Explore All Features'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewFeatures.map((feat) => (
              <Card key={feat.id} hoverEffect className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono uppercase font-semibold text-slate-500">
                      {feat.category}
                    </span>
                    <Badge status={feat.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {language === 'fr' ? feat.nameFr : feat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'fr' ? feat.descriptionFr : feat.descriptionEn}
                  </p>
                </div>
                {feat.tags && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                    {feat.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Co-Engineering AI Teaser Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-slate-900 via-tsa-navy-900 to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden tech-glow">
            {/* Background vector lines */}
            <div className="absolute inset-0 bg-cad-grid opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-xs font-semibold text-tsa-cyan-300 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.coEngineeringTeaser.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                {t.coEngineeringTeaser.title}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                {t.coEngineeringTeaser.description}
              </p>

              <div className="space-y-3 mb-8">
                {[
                  t.coEngineeringTeaser.bullet1,
                  t.coEngineeringTeaser.bullet2,
                  t.coEngineeringTeaser.bullet3,
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-tsa-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="/co-engineering" variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  {t.coEngineeringTeaser.cta}
                </Button>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'fr'
                      ? 'L\'ingénieur reste le seul signataire légal et responsable'
                      : 'Licensed engineer remains the sole legal decision maker'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Release Downloads & GitHub Call to Action */}
      <section className="py-16 bg-slate-50 dark:bg-tsa-navy-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'fr'
              ? 'Prêt à Découvrir Tsaraloha Structural Analysis ?'
              : 'Ready to Experience Tsaraloha Structural Analysis?'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
            {language === 'fr'
              ? 'Consultez la feuille de route, explorez les sources C++20 sur GitHub ou rejoignez le programme de test pré-release.'
              : 'Review the development roadmap, inspect the C++20 sources on GitHub, or join the pre-release testing program.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/downloads" variant="primary" size="lg" icon={<Download className="w-4 h-4" />}>
              {language === 'fr' ? 'Accéder aux Téléchargements' : 'Go to Downloads'}
            </Button>
            <Button href="/roadmap" variant="outline" size="lg" icon={<TrendingUp className="w-4 h-4" />}>
              {language === 'fr' ? 'Consulter la Roadmap' : 'Explore Roadmap'}
            </Button>
            <a
              href={siteConfig.urls.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
