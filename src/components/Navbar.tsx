import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { siteConfig } from '../config/site';
import { GithubIcon } from './GithubIcon';
import {
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Download,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath } = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [currentPath]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/features', label: t.nav.features },
    { href: '/analysis', label: t.nav.analysis },
    { href: '/bim', label: t.nav.bim },
    { href: '/co-engineering', label: t.nav.coEngineering },
    { href: '/docs', label: t.nav.docs },
  ];

  const moreLinks = [
    { href: '/downloads', label: t.nav.downloads, desc: language === 'fr' ? 'Installateurs et code source' : 'Binaries and source code' },
    { href: '/pricing', label: t.nav.pricing, desc: language === 'fr' ? 'Éditions et conditions' : 'Tiers and editions' },
    { href: '/licensing', label: t.nav.licensing, desc: language === 'fr' ? 'Licences open source et tierces' : 'TSA and third-party terms' },
    { href: '/roadmap', label: t.nav.roadmap, desc: language === 'fr' ? 'Feuille de route et jalons' : 'Development milestones' },
    { href: '/changelog', label: t.nav.changelog, desc: language === 'fr' ? 'Historique des versions' : 'Release notes' },
    { href: '/about', label: t.nav.about, desc: language === 'fr' ? 'Vision et contact' : 'Vision and contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-tsa-navy-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-md'
          : 'bg-white/70 dark:bg-tsa-navy-950/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-gradient-to-br from-tsa-blue-600 to-tsa-cyan-400 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <img
                src="./assets/branding/TSA.svg"
                alt="TSA Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if SVG fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  TSA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-400 border border-tsa-blue-500/20 font-semibold">
                  v0.1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-tight font-medium">
                Tsaraloha Structural Analysis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-tsa-blue-600 dark:text-tsa-cyan-300 bg-tsa-blue-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>{language === 'fr' ? 'Plus' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {moreLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Icons: Language, Theme, GitHub, Download */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-tsa-blue-500 dark:hover:border-tsa-cyan-400 transition-colors"
              title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
            >
              <span className={language === 'fr' ? 'text-tsa-blue-600 dark:text-tsa-cyan-400 font-bold' : 'text-slate-400'}>
                FR
              </span>
              <span className="text-slate-400">|</span>
              <span className={language === 'en' ? 'text-tsa-blue-600 dark:text-tsa-cyan-400 font-bold' : 'text-slate-400'}>
                EN
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Theme: ${theme}`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-tsa-cyan-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* GitHub Repo Button */}
            <a
              href={siteConfig.urls.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {/* Download CTA */}
            <Link
              to="/downloads"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.nav.downloads}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold text-tsa-blue-600 dark:text-tsa-cyan-400 border border-slate-300 dark:border-slate-700 rounded"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 bg-white dark:bg-tsa-navy-950 border-b border-slate-200 dark:border-slate-800 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                currentPath === link.href
                  ? 'bg-tsa-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-300'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 px-3 py-1 uppercase">
              {language === 'fr' ? 'Autres rubriques' : 'More sections'}
            </div>
            {moreLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{theme.toUpperCase()}</span>
            </button>

            <a
              href={siteConfig.urls.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <Link
              to="/downloads"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tsa-blue-600 text-white text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>{t.nav.downloads}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
