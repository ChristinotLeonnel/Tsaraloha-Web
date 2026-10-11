import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ExternalLink, Bug, Cpu, Box, Grid3X3 } from 'lucide-react';
import { Link } from '../router/RouterContext';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { primaryNav, secondaryNav, type NavItem } from '../config/navigation';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { NavIcon } from './NavIcon';

const currentYear = new Date().getFullYear();

const byKey = (key: NavItem['key']) => [...primaryNav, ...secondaryNav].find((item) => item.key === key)!;

interface ExternalItem {
  href: string;
  label: string;
  icon: LucideIcon | typeof GithubIcon;
}

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const fr = language === 'fr';
  const newTab = fr ? '(nouvel onglet)' : '(new tab)';

  const product = (['features', 'analysis', 'bim', 'coEngineering', 'pricing', 'downloads'] as const).map(byKey);
  const resources = (['docs', 'support', 'roadmap', 'changelog'] as const).map(byKey);
  const legal = (['licensing', 'about'] as const).map(byKey);

  const technologies: ExternalItem[] = [
    { href: siteConfig.urls.opensees, label: 'OpenSees', icon: Cpu },
    { href: siteConfig.urls.occt, label: 'OpenCASCADE', icon: Box },
    { href: siteConfig.urls.gmsh, label: 'Gmsh', icon: Grid3X3 },
  ];
  const community: ExternalItem[] = [
    { href: siteConfig.urls.softwareGithub, label: fr ? 'Code source de TSA' : 'TSA source code', icon: GithubIcon },
    { href: siteConfig.urls.issues, label: fr ? 'Signaler un bug' : 'Report a bug', icon: Bug },
    { href: siteConfig.urls.github, label: fr ? 'Code source du site' : 'Website source code', icon: GithubIcon },
  ];

  const linkClass = 'inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors';
  const internal = (items: NavItem[]) =>
    items.map((item) => (
      <li key={item.href}>
        <Link to={item.href} className={linkClass}>
          <NavIcon item={item} size={14} className="text-slate-500" />
          {t.nav[item.key]}
        </Link>
      </li>
    ));
  const external = (items: ExternalItem[]) =>
    items.map(({ href, label, icon: Icon }) => (
      <li key={href}>
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Icon className="w-3.5 h-3.5 shrink-0 text-slate-500" aria-hidden />
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 opacity-60" aria-hidden />
          <span className="sr-only">{newTab}</span>
        </a>
      </li>
    ));
  const heading = 'text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4';

  return (
    <footer className="w-full bg-slate-900 dark:bg-tsa-navy-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Identité */}
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4" aria-label={fr ? 'TSA — accueil' : 'TSA — home'}>
              <BrandLogo size="lg" surface="dark" decorative />
              <span className="flex flex-col leading-tight">
                <span className="font-extrabold text-lg text-white tracking-tight">TSA</span>
                <span className="text-xs text-slate-300 font-medium">{siteConfig.name}</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              {fr ? siteConfig.descriptionFr : siteConfig.descriptionEn}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-tsa-cyan-300 font-mono border border-slate-700">
                {siteConfig.version}
              </span>
              <span className="text-slate-400">C++20 · Qt 6 · OpenCASCADE · OpenSees · Gmsh</span>
            </div>
          </div>

          <nav aria-label={t.footer.product}>
            <h2 className={heading}>{t.footer.product}</h2>
            <ul className="space-y-2.5 text-xs">{internal(product)}</ul>
          </nav>

          <nav aria-label={t.footer.resources}>
            <h2 className={heading}>{t.footer.resources}</h2>
            <ul className="space-y-2.5 text-xs">{internal(resources)}</ul>
          </nav>

          <nav aria-label={fr ? 'Technologies' : 'Technologies'}>
            <h2 className={heading}>{fr ? 'Technologies' : 'Technologies'}</h2>
            <ul className="space-y-2.5 text-xs">{external(technologies)}</ul>
          </nav>

          <nav aria-label={t.footer.community}>
            <h2 className={heading}>{t.footer.legal}</h2>
            <ul className="space-y-2.5 text-xs">
              {internal(legal)}
              {external(community)}
            </ul>
          </nav>
        </div>

        {/* Mentions */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>
              © {currentYear} {siteConfig.author}. {t.footer.rights}
            </span>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <span>{fr ? 'Conçu pour le génie civil' : 'Designed for civil engineering'}</span>
          </div>
          <p className="md:text-right max-w-xl text-[11px] leading-normal text-slate-400">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
};
