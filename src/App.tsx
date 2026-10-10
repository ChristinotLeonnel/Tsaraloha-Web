import React from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { ThemeProvider } from './theme/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { FeaturesPage } from './pages/FeaturesPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { BimPage } from './pages/BimPage';
import { CoEngineeringPage } from './pages/CoEngineeringPage';
import { DocsPage } from './pages/DocsPage';
import { PricingPage } from './pages/PricingPage';
import { LicensingPage } from './pages/LicensingPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SupportPage } from './pages/SupportPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  // Route resolver
  const renderCurrentPage = () => {
    const cleanPath = currentPath.split('?')[0].split('#')[0].replace(/(.)\/+$/, '$1');

    switch (cleanPath) {
      case '/':
      case '':
        return <Home />;
      case '/features':
        return <FeaturesPage />;
      case '/analysis':
        return <AnalysisPage />;
      case '/bim':
        return <BimPage />;
      case '/co-engineering':
        return <CoEngineeringPage />;
      case '/docs':
        return <DocsPage />;
      case '/pricing':
        return <PricingPage />;
      case '/licensing':
        return <LicensingPage />;
      case '/downloads':
        return <DownloadsPage />;
      case '/roadmap':
        return <RoadmapPage />;
      case '/changelog':
        return <ChangelogPage />;
      case '/about':
        return <AboutPage />;
      case '/support':
        return <SupportPage />;
      default:
        // Pages de documentation : /docs/<catégorie> et /docs/<catégorie>/<page>
        if (cleanPath.startsWith('/docs/')) {
          return <DocsPage />;
        }
        return <NotFoundPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-tsa-navy-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
