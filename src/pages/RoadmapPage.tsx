import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { roadmapItems } from '../config/roadmap';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { SEOHead } from '../components/SEOHead';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Wrench,
  FlaskConical,
  Calendar,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: language === 'fr' ? 'Vue d\'ensemble' : 'All Milestones' },
    { id: 'completed', label: t.common.completed, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'in_development', label: t.common.inDevelopment, icon: <Wrench className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'planned', label: t.common.planned, icon: <Clock className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'research', label: t.common.research, icon: <FlaskConical className="w-3.5 h-3.5 text-purple-500" /> },
  ];

  const filteredItems = roadmapItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Feuille de Route' : 'Development Roadmap'}
        description={
          language === 'fr'
            ? 'Feuille de route de Tsaraloha Structural Analysis : jalons achevés, en cours de développement, planifiés et recherche.'
            : 'Tsaraloha Structural Analysis development roadmap: completed milestones, in development, planned, and research initiatives.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Vision Stratégique & Jalons' : 'Strategic Vision & Milestones'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.roadmap}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'Suivez l\'avancement transparent des développements de TSA. Seuls les éléments rigoureusement testés et validés en source sont marqués comme achevés.'
              : 'Follow the transparent progress of TSA engineering milestones. Only components thoroughly validated against code benchmarks are listed as completed.'}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Roadmap Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const statusConfig = {
              completed: {
                label: t.common.completed,
                badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
              },
              in_development: {
                label: t.common.inDevelopment,
                badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
                icon: <Wrench className="w-3.5 h-3.5 text-amber-500" />,
              },
              planned: {
                label: t.common.planned,
                badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
                icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
              },
              research: {
                label: t.common.research,
                badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
                icon: <FlaskConical className="w-3.5 h-3.5 text-purple-500" />,
              },
            }[item.status];

            return (
              <Card key={item.id} hoverEffect className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-tight bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.quarter}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {language === 'fr' ? item.titleFr : item.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'fr' ? item.descriptionFr : item.descriptionEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
