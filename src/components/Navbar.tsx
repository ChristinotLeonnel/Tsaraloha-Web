import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { siteConfig } from '../config/site';
import { primaryNav, secondaryNav, isActivePath } from '../config/navigation';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { Menu, X, Sun, Moon, Laptop, ChevronDown, Download, Languages } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath } = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  // Menus ouverts pour une page donnée : ils se referment d'eux-mêmes quand la page change.
  const [mobileOpenFor, setMobileOpenFor] = useState<string | null>(null);
  const [dropdownOpenFor, setDropdownOpenFor] = useState<string | null>(null);
  const mobileMenuOpen = mobileOpenFor === currentPath;
  const dropdownOpen = dropdownOpenFor === currentPath;
  const setMobileMenuOpen = (open: boolean | ((o: boolean) => boolean)) =>
    setMobileOpenFor((typeof open === 'function' ? open(mobileMenuOpen) : open) ? currentPath : null);
  const setDropdownOpen = (open: boolean | ((o: boolean) => boolean)) =>
    setDropdownOpenFor((typeof open === 'function' ? open(dropdownOpen) : open) ? currentPath : null);
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 20);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu « Plus » : fermeture par Échap (focus rendu au bouton) et par clic à l'extérieur
  useEffect(() => {
    if (!dropdownOpen && !mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (dropdownOpen) moreButtonRef.current?.focus();
      setDropdownOpenFor(null);
      setMobileOpenFor(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (dropdownOpen && moreRef.current && !moreRef.current.contains(e.target as Node)) setDropdownOpenFor(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  const fr = language === 'fr';
  const toggleLanguage = () => setLanguage(fr ? 'en' : 'fr');
  const cycleTheme = () => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
  const themeLabel = {
    dark: fr ? 'Thème sombre' : 'Dark theme',
    light: fr ? 'Thème clair' : 'Light theme',
    system: fr ? 'Thème du système' : 'System theme',
  }[theme];
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Laptop;
  const moreActive = secondaryNav.some((item) => isActivePath(currentPath, item.href));

  const iconButton =
    'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-tsa-navy-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-md'
          : 'bg-white/70 dark:bg-tsa-navy-950/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo et nom */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label={fr ? 'TSA — accueil' : 'TSA — home'}>
            <BrandLogo size="md" decorative className="group-hover:scale-105 transition-transform duration-200" />
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">TSA</span>
                <span className="text-[10px] font-mono px-1.5 rounded bg-tsa-blue-500/10 text-tsa-blue-700 dark:text-tsa-cyan-300 border border-tsa-blue-500/20 font-semibold">
                  v0.1.0
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block 2xl:block xl:hidden tracking-tight font-medium">
                Tsaraloha Structural Analysis
              </span>
            </span>
          </Link>

          {/* Navigation principale (écrans larges) */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
            {primaryNav.map(({ href, key, icon: Icon }) => {
              const active = isActivePath(currentPath, href);
              return (
                <Link
                  key={href}
                  to={href}
                  aria-current={active ? 'page' : undefined}
                  className={`${href === '/' ? 'hidden 2xl:inline-flex' : 'inline-flex'} items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'text-tsa-blue-700 dark:text-tsa-cyan-300 bg-tsa-blue-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden />
                  <span>{t.nav[key]}</span>
                </Link>
              );
            })}

            {/* Menu « Plus » */}
            <div className="relative" ref={moreRef}>
              <button
                ref={moreButtonRef}
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="nav-more-menu"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  moreActive
                    ? 'text-tsa-blue-700 dark:text-tsa-cyan-300 bg-tsa-blue-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{fr ? 'Plus' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              {dropdownOpen && (
                <div
                  id="nav-more-menu"
                  role="menu"
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50"
                >
                  {secondaryNav.map(({ href, key, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      to={href}
                      role="menuitem"
                      aria-current={isActivePath(currentPath, href) ? 'page' : undefined}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
                      <span>
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{t.nav[key]}</span>
                        {desc && <span className="block text-xs text-slate-500 dark:text-slate-400">{desc[language]}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions : langue, thème, GitHub, téléchargements, menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-tsa-blue-500 dark:hover:border-tsa-cyan-400 transition-colors"
              aria-label={fr ? 'Switch to English' : 'Passer en français'}
              title={fr ? 'Switch to English' : 'Passer en français'}
            >
              <Languages className="w-4 h-4 hidden sm:block" aria-hidden />
              <span className="text-tsa-blue-700 dark:text-tsa-cyan-300 font-bold">{language.toUpperCase()}</span>
            </button>

            <button type="button" onClick={cycleTheme} className={`${iconButton} hidden sm:inline-flex`} aria-label={themeLabel} title={themeLabel}>
              <ThemeIcon className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500' : theme === 'dark' ? 'text-tsa-cyan-400' : ''}`} aria-hidden />
            </button>

            <a
              href={siteConfig.urls.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconButton} hidden sm:inline-flex`}
              aria-label={fr ? 'Dépôt GitHub (nouvel onglet)' : 'GitHub repository (new tab)'}
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <Link
              to="/downloads"
              title={t.nav.downloads}
              className="hidden md:inline-flex items-center justify-center gap-1.5 h-9 min-w-9 px-3.5 xl:px-0 xl:w-9 2xl:w-auto 2xl:px-3.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden />
              <span className="xl:sr-only 2xl:not-sr-only">{t.nav.downloads}</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className={`${iconButton} xl:hidden`}
              aria-label={mobileMenuOpen ? (fr ? 'Fermer le menu' : 'Close menu') : fr ? 'Ouvrir le menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu des écrans étroits */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label={fr ? 'Navigation' : 'Navigation'}
          className="xl:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-tsa-navy-950"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {primaryNav.map(({ href, key, icon: Icon }) => {
                const active = isActivePath(currentPath, href);
                return (
                  <Link
                    key={href}
                    to={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-tsa-blue-500/10 text-tsa-blue-700 dark:text-tsa-cyan-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden />
                    {t.nav[key]}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 pb-1 uppercase tracking-wider">
                {fr ? 'Autres rubriques' : 'More sections'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {secondaryNav.map(({ href, key, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    aria-current={isActivePath(currentPath, href) ? 'page' : undefined}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden />
                    {t.nav[key]}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={cycleTheme}
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <ThemeIcon className="w-4 h-4" aria-hidden />
                <span>{themeLabel}</span>
              </button>
              <a
                href={siteConfig.urls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <Link
                to="/downloads"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-sm font-semibold"
              >
                <Download className="w-4 h-4" aria-hidden />
                <span>{t.nav.downloads}</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
