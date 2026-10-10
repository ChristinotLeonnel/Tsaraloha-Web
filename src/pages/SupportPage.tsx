// Page Support : accès à l'aide, questions fréquentes, procédure de signalement d'un bug et canaux
// officiels (dépôt GitHub de TSA). Aucune adresse de contact n'est inventée.

import React from 'react';
import { LifeBuoy, BookOpen, Bug, MessageSquare, HelpCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/RouterContext';
import { SEOHead } from '../components/SEOHead';
import { siteConfig } from '../config/site';

type Lang = 'fr' | 'en';

const faq: { q: Record<Lang, string>; a: Record<Lang, string>; to?: string }[] = [
  {
    q: { fr: 'Sur quels systèmes TSA fonctionne-t-il ?', en: 'Which systems does TSA run on?' },
    a: {
      fr: 'Windows 10 et 11 en 64 bits. Aucune version Linux ou macOS n’est publiée.',
      en: 'Windows 10 and 11, 64-bit. No Linux or macOS version is published.',
    },
    to: '/docs/getting-started/system-requirements',
  },
  {
    q: { fr: 'Où télécharger TSA ?', en: 'Where can I download TSA?' },
    a: {
      fr: 'Aucun installateur public n’est encore publié. Les versions publiées apparaîtront sur la page Téléchargements.',
      en: 'No public installer has been published yet. Published versions will appear on the Downloads page.',
    },
    to: '/downloads',
  },
  {
    q: { fr: 'Les dalles et les voiles sont-ils calculés ?', en: 'Are slabs and walls analysed?' },
    a: {
      fr: 'Non. Ils sont modélisés mais exclus du calcul ; TSA le signale avant chaque analyse.',
      en: 'No. They can be modeled but are excluded from the analysis; TSA warns before each run.',
    },
    to: '/docs/modeling/surfaces',
  },
  {
    q: { fr: 'Quel moteur de calcul TSA utilise-t-il ?', en: 'Which analysis engine does TSA use?' },
    a: {
      fr: 'OpenSees 3.8.0 pour le calcul 3D, et un moteur expérimental d’ossatures planes (Custom2D).',
      en: 'OpenSees 3.8.0 for 3D analysis, plus an experimental plane frame engine (Custom2D).',
    },
    to: '/docs/analysis/engines',
  },
  {
    q: { fr: 'Le calcul échoue : que vérifier ?', en: 'The analysis fails: what should I check?' },
    a: {
      fr: 'Les appuis, les sections et matériaux, les barres de longueur nulle et la présence d’OpenSees.',
      en: 'Supports, sections and materials, zero-length members and whether OpenSees is installed.',
    },
    to: '/docs/troubleshooting/analysis-failures',
  },
  {
    q: { fr: 'Les résultats peuvent-ils être utilisés tels quels ?', en: 'Can results be used as is?' },
    a: {
      fr: 'Non. TSA est en développement actif : un ingénieur qualifié doit vérifier tout résultat.',
      en: 'No. TSA is under active development: a qualified engineer must check every result.',
    },
  },
];

const text = {
  fr: {
    title: 'Support',
    intro: 'Trouver de l’aide sur TSA : documentation, questions fréquentes et signalement de bugs.',
    docsTitle: 'Documentation',
    docsText: 'Guides d’utilisation, de la modélisation aux résultats.',
    troubleTitle: 'Dépannage',
    troubleText: 'Problèmes courants et solutions.',
    issuesTitle: 'Signaler un bug',
    issuesText: 'Ouvrir un ticket sur le dépôt GitHub de TSA.',
    discussTitle: 'Discussions',
    discussText: 'Questions et échanges avec la communauté.',
    faq: 'Questions fréquentes',
    more: 'En savoir plus',
    procedure: 'Signaler un bug efficacement',
    steps: [
      'Vérifiez dans la documentation de dépannage que le problème n’est pas déjà décrit.',
      'Cherchez parmi les tickets existants pour éviter un doublon.',
      'Indiquez la version de TSA (Aide > À propos) et la version de Windows.',
      'Décrivez les étapes exactes, le résultat attendu et le résultat obtenu.',
      'Joignez si possible un fichier .tsa minimal, sans données confidentielles.',
    ],
    guide: 'Guide complet du signalement',
  },
  en: {
    title: 'Support',
    intro: 'Get help with TSA: documentation, frequently asked questions and bug reports.',
    docsTitle: 'Documentation',
    docsText: 'User guides, from modeling to results.',
    troubleTitle: 'Troubleshooting',
    troubleText: 'Common problems and solutions.',
    issuesTitle: 'Report a bug',
    issuesText: 'Open an issue on the TSA GitHub repository.',
    discussTitle: 'Discussions',
    discussText: 'Questions and community exchanges.',
    faq: 'Frequently asked questions',
    more: 'Learn more',
    procedure: 'Reporting a bug effectively',
    steps: [
      'Check the troubleshooting pages in case the problem is already described.',
      'Search existing issues to avoid duplicates.',
      'Give the TSA version (Help > About) and the Windows version.',
      'Describe the exact steps, the expected result and the actual result.',
      'If possible, attach a minimal .tsa file without confidential data.',
    ],
    guide: 'Full bug reporting guide',
  },
};

const cardClass =
  'flex items-start gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card hover:border-tsa-blue-500 transition-colors';

export const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'fr';
  const t = text[lang];

  const cards = [
    { icon: BookOpen, title: t.docsTitle, body: t.docsText, to: '/docs' },
    { icon: HelpCircle, title: t.troubleTitle, body: t.troubleText, to: '/docs/troubleshooting' },
    { icon: Bug, title: t.issuesTitle, body: t.issuesText, href: siteConfig.urls.issues },
    { icon: MessageSquare, title: t.discussTitle, body: t.discussText, href: siteConfig.urls.discussions },
  ];

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead title={t.title} description={t.intro} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <LifeBuoy className="w-9 h-9 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
          {t.title}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{t.intro}</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {cards.map((c) => {
            const content = (
              <>
                <c.icon className="w-5 h-5 mt-0.5 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0" aria-hidden />
                <span>
                  <span className="block font-bold text-slate-900 dark:text-white">{c.title}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-400">{c.body}</span>
                </span>
              </>
            );
            return c.to ? (
              <Link key={c.title} to={c.to} className={cardClass}>
                {content}
              </Link>
            ) : (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                {content}
              </a>
            );
          })}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-slate-900 dark:text-white">{t.faq}</h2>
        <div className="mt-4 space-y-3">
          {faq.map((item) => (
            <details
              key={item.q.fr}
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-surface-card"
            >
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                {item.q[lang]}
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" aria-hidden />
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.a[lang]}</p>
              {item.to && (
                <Link to={item.to} className="inline-block mt-2 text-sm text-tsa-blue-600 dark:text-tsa-cyan-400 underline">
                  {t.more}
                </Link>
              )}
            </details>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-slate-900 dark:text-white">{t.procedure}</h2>
        <ol className="mt-4 list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          {t.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="mt-4">
          <Link to="/docs/troubleshooting/reporting-bugs" className="text-tsa-blue-600 dark:text-tsa-cyan-400 underline">
            {t.guide}
          </Link>
        </p>
      </div>
    </div>
  );
};
