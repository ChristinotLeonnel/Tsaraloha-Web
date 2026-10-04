import React from 'react';
import { Link } from '../router/RouterContext';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { GithubIcon } from './GithubIcon';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-slate-900 dark:bg-tsa-navy-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand & Tagline */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-gradient-to-br from-tsa-blue-600 to-tsa-cyan-400">
                <img
                  src="./assets/branding/TSA.svg"
                  alt="TSA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                TSA
              </span>
            </Link>
            <p className="text-sm text-slate-300 font-medium mb-3">
              {siteConfig.name}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              {language === 'fr' ? siteConfig.descriptionFr : siteConfig.descriptionEn}
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-tsa-cyan-400 font-mono border border-slate-700">
                {siteConfig.version}
              </span>
              <span className="text-slate-500">•</span>
              <span>C++20 & OpenCASCADE</span>
              <span className="text-slate-500">•</span>
              <span>OpenSees FEM</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.product}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  {t.nav.features}
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-white transition-colors">
                  {t.nav.analysis}
                </Link>
              </li>
              <li>
                <Link to="/bim" className="hover:text-white transition-colors">
                  {t.nav.bim}
                </Link>
              </li>
              <li>
                <Link to="/co-engineering" className="hover:text-white transition-colors">
                  {t.nav.coEngineering}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-white transition-colors">
                  {t.nav.downloads}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Docs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/docs" className="hover:text-white transition-colors">
                  {t.nav.docs}
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-white transition-colors">
                  {t.nav.roadmap}
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="hover:text-white transition-colors">
                  {t.nav.changelog}
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.urls.opensees}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>OpenSees Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.urls.occt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>OpenCASCADE OCCT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Community */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/licensing" className="hover:text-white transition-colors">
                  {t.nav.licensing}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.urls.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.urls.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Issue Tracker
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.urls.discussions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Discussions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span>
              © {new Date().getFullYear()} {siteConfig.author}. {t.footer.rights}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              {language === 'fr' ? 'Conçu pour le Génie Civil' : 'Designed for Civil Engineering'}
            </span>
          </div>

          <div className="text-center md:text-right max-w-xl text-[11px] leading-normal text-slate-500">
            {t.footer.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};
