import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SEOHead } from '../components/SEOHead';
import { GithubIcon } from '../components/GithubIcon';
import {
  User,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'À propos & Contact' : 'About & Contact'}
        description={
          language === 'fr'
            ? 'À propos de Tsaraloha Structural Analysis (TSA) : vision, concepteur, communauté et contact.'
            : 'About Tsaraloha Structural Analysis (TSA): vision, creator, community, and contact.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Vision & About */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
                <User className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Vision & Origine' : 'Vision & Origin'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === 'fr' ? 'À propos de TSA' : 'About TSA'}
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                <strong>{siteConfig.name} (TSA)</strong> {language === 'fr'
                  ? 'est né de la volonté de doter les ingénieurs civils et les bureaux d\'études d\'un environnement moderne, transparent et rigoureux pour la modélisation et l\'analyse des structures.'
                  : 'was created from the ambition to provide civil engineers and design consulting offices with a modern, transparent, and mathematically rigorous environment for structural modeling and analysis.'}
              </p>
              <p>
                {language === 'fr'
                  ? 'Conçu et architecturé par Christinot Leonnel Tsaraloha, TSA associe la haute performance du C++20, la puissance du noyau géométrique OpenCASCADE et la précision du solveur d\'éléments finis OpenSees.'
                  : 'Engineered and architected by Christinot Leonnel Tsaraloha, TSA synthesizes high-performance C++20, OpenCASCADE geometric modeling, and UC Berkeley\'s OpenSees finite element analysis.'}
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {language === 'fr' ? 'Rigueur Scientifique' : 'Scientific Rigor'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Aucun calcul opaque. Tous les équilibres sont vérifiables et auditables.'
                    : 'No black-box calculations. Equilibrium checks and matrices are auditable.'}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {language === 'fr' ? 'Indépendance Technologique' : 'Native Desktop Freedom'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Logiciel natif fonctionnant localement pour la confidentialité absolue de vos projets.'
                    : 'Native desktop application running locally for complete design confidentiality.'}
                </p>
              </div>
            </div>

            {/* Community Links */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'fr' ? 'Rejoindre la Communauté' : 'Join the Community'}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={siteConfig.urls.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href={siteConfig.urls.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Issue Tracker</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-5">
            <Card className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-tsa-blue-600 dark:text-tsa-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'fr' ? 'Contacter l\'Équipe' : 'Contact the Team'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {language === 'fr'
                  ? 'Pour toute question sur la recherche, les partenariats, les licences entreprise ou les tests pré-release.'
                  : 'For research inquiries, academic partnerships, enterprise licensing, or pre-release beta access.'}
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <div className="font-bold text-sm">
                    {language === 'fr' ? 'Message Pris en Compte !' : 'Message Received!'}
                  </div>
                  <p className="text-xs">
                    {language === 'fr'
                      ? 'Merci pour votre intérêt envers Tsaraloha Structural Analysis. Notre équipe vous répondra dans les meilleurs délais.'
                      : 'Thank you for your interest in Tsaraloha Structural Analysis. We will respond to your message promptly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', organization: '', message: '' });
                    }}
                    className="text-xs underline font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    {language === 'fr' ? 'Envoyer un autre message' : 'Send another inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'fr' ? 'Nom complet' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'fr' ? 'Adresse Email' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
                      placeholder="engineer@consulting.com"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'fr' ? 'Organisme / Entreprise / Université' : 'Organization / University'}
                    </label>
                    <input
                      type="text"
                      value={formState.organization}
                      onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
                      placeholder="e.g. Structural Engineering Bureau"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'fr' ? 'Message' : 'Message'} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
                      placeholder={language === 'fr' ? 'Votre demande ou projet...' : 'Tell us about your project or question...'}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<Send className="w-4 h-4" />}
                  >
                    {language === 'fr' ? 'Envoyer le Message' : 'Submit Inquiry'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
