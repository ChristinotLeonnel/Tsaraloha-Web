import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { featureItems } from '../config/features';
import { FeatureCategory, FeatureStatus } from '../types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { SEOHead } from '../components/SEOHead';
import {
  Search,
  Box,
  Move,
  Activity,
  Grid3X3,
  BarChart2,
  CheckCircle2,
  Clock,
  Wrench,
  Compass,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Toutes les catégories' : 'All Categories', icon: <Box className="w-4 h-4" /> },
    { id: 'modeling', label: language === 'fr' ? 'Modélisation 3D' : '3D Modeling', icon: <Box className="w-4 h-4" /> },
    { id: 'cad', label: language === 'fr' ? 'CAO & Manipulation' : 'CAD & Manipulation', icon: <Move className="w-4 h-4" /> },
    { id: 'analysis', label: language === 'fr' ? 'Analyse & Solveurs' : 'Analysis & Solvers', icon: <Activity className="w-4 h-4" /> },
    { id: 'meshing', label: language === 'fr' ? 'Maillage Éléments Finis' : 'Finite Element Meshing', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'results', label: language === 'fr' ? 'Résultats & Post-Traitement' : 'Results & Post-Processing', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const filteredFeatures = useMemo(() => {
    return featureItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (language === 'fr' ? item.nameFr : item.name).toLowerCase();
        const desc = (language === 'fr' ? item.descriptionFr : item.descriptionEn).toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        if (!name.includes(query) && !desc.includes(query) && !tags.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, selectedStatus, searchQuery, language]);

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Fonctionnalités' : 'Features'}
        description={
          language === 'fr'
            ? 'Catalogue complet des fonctionnalités de Tsaraloha Structural Analysis : modélisation 3D, CAO, solveur OpenSees, maillage et post-traitement.'
            : 'Complete features catalog for Tsaraloha Structural Analysis: 3D modeling, CAD manipulation, OpenSees solver, meshing, and results.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <span>{language === 'fr' ? 'Spécifications Techniques' : 'Technical Specifications'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.features}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'Consultez la liste détaillée des modules et outils d\'ingénierie intégrés dans TSA, avec l\'état de disponibilité en temps réel de chaque composant.'
              : 'Explore the full spectrum of structural engineering tools and modules in TSA, labeled with clear real-time development status badges.'}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-4 mb-8">
          {/* Category Tabs */}
          <Tabs
            tabs={categories}
            activeTab={activeCategory}
            onChange={setActiveCategory}
          />

          {/* Search & Status Pill Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-tsa-surface-dark border border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher un module, mot-clé, profilé...' : 'Search a module, keyword, section...'}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-tsa-blue-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
              <span className="text-slate-500 mr-1 shrink-0">{t.common.filterByStatus}:</span>
              {[
                { id: 'all', label: language === 'fr' ? 'Tous' : 'All' },
                { id: 'AVAILABLE', label: t.common.available },
                { id: 'BETA', label: t.common.beta },
                { id: 'IN_DEVELOPMENT', label: t.common.inDevelopment },
                { id: 'PLANNED', label: t.common.planned },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedStatus === st.id
                      ? 'bg-tsa-blue-600 text-white font-semibold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-base text-slate-500">
              {language === 'fr'
                ? 'Aucune fonctionnalité ne correspond à votre recherche.'
                : 'No features match your current filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feat) => (
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
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {feat.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
