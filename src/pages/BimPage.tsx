import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import {
  Layers,
  Box,
  Share2,
  FileCheck,
  Grid,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const BimPage: React.FC = () => {
  const { language } = useLanguage();

  const bimPillars = [
    {
      titleEn: '3D Geometry',
      titleFr: 'Géométrie 3D',
      descEn: 'Exact B-Rep volume representations and topological connectivity.',
      descFr: 'Représentation volumique B-Rep exacte et connectivité topologique.',
      status: 'AVAILABLE' as const,
    },
    {
      titleEn: 'Structural Semantics',
      titleFr: 'Sémantique Structurale',
      descEn: 'Classification of members (Beams, Columns, Slabs, Walls, Footings).',
      descFr: 'Classification des composants (Poutres, Poteaux, Dalles, Voiles, Semelles).',
      status: 'AVAILABLE' as const,
    },
    {
      titleEn: 'Materials & Grades',
      titleFr: 'Matériaux & Nuances',
      descEn: 'Constitutive mechanical properties, density, and design strengths.',
      descFr: 'Propriétés mécaniques, densités et résistances caractéristiques.',
      status: 'AVAILABLE' as const,
    },
    {
      titleEn: 'Standard Cross-Sections',
      titleFr: 'Sections Transversales',
      descEn: 'Steel profiles (IPE, HEA), RC parametric shapes, and hollow sections.',
      descFr: 'Profilés normalisés (IPE, HEA), formes béton armé et profils creux.',
      status: 'AVAILABLE' as const,
    },
    {
      titleEn: 'Loads & Combinations',
      titleFr: 'Charges & Combinaisons',
      descEn: 'Dead loads, live actions, lateral wind, and Eurocode combination sets.',
      descFr: 'Charges permanentes, d\'exploitation, vent et combinaisons d\'actions.',
      status: 'AVAILABLE' as const,
    },
    {
      titleEn: 'IFC 4.3 Structural Model',
      titleFr: 'Modèle IFC 4.3 Structural',
      descEn: 'IfcStructuralAnalysisModel export and round-trip BIM synchronization.',
      descFr: 'Export IfcStructuralAnalysisModel et synchronisation bidirectionnelle.',
      status: 'IN_DEVELOPMENT' as const,
    },
  ];

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'BIM & CAO' : 'BIM & CAD'}
        description={
          language === 'fr'
            ? 'Positionnement BIM et interopérabilité de Tsaraloha Structural Analysis : IFC 4.3 Structural Analysis Model, plans de travail et géométrie.'
            : 'BIM positioning and interoperability for Tsaraloha Structural Analysis: IFC 4.3 Structural Analysis Model, WorkPlanes, and CAD geometry.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tsa-blue-500/10 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Interopérabilité & Modélisation de l\'Information' : 'Interoperability & Building Information Modeling'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'fr' ? 'Positionnement BIM & Outils CAO' : 'Structural BIM & CAD Positioning'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'Le BIM ne se résume pas à une simple maquette 3D. Pour TSA, le BIM structural associe la géométrie précise, les données de matériaux, les conditions d\'appuis, les cas de charges et les résultats analytiques au sein d\'un modèle d\'information cohérent.'
              : 'BIM is far more than a 3D visualization. For TSA, Structural BIM synthesizes exact CAD geometry, material properties, structural boundary restraints, load actions, and analytical results into a unified source of structural truth.'}
          </p>
        </div>

        {/* BIM Formula / Equation Card */}
        <div className="p-8 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 mb-3">
            {language === 'fr' ? 'La Formulation du BIM Structural dans TSA' : 'The TSA Structural BIM Formulation'}
          </div>

          <div className="p-6 rounded-xl bg-slate-50 dark:bg-tsa-navy-950/80 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-sm sm:text-lg text-slate-800 dark:text-slate-200 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded bg-blue-500/10 text-tsa-blue-600 dark:text-tsa-blue-400">Geometry</span>
              <span>+</span>
              <span className="px-3 py-1 rounded bg-cyan-500/10 text-tsa-cyan-600 dark:text-tsa-cyan-300">Semantics</span>
              <span>+</span>
              <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Materials</span>
              <span>+</span>
              <span className="px-3 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">Sections</span>
              <span>+</span>
              <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">Loads</span>
              <span>+</span>
              <span className="px-3 py-1 rounded bg-red-500/10 text-red-500">Analysis Results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bimPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'fr' ? pillar.titleFr : pillar.titleEn}
                  </h4>
                  <Badge status={pillar.status} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'fr' ? pillar.descFr : pillar.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CAD Drafting Excellence: WorkPlanes & Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-tsa-blue-600 dark:text-tsa-cyan-300 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'fr' ? 'Plans de Travail Paramétriques (WorkPlanes)' : 'Parametric WorkPlanes'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {language === 'fr'
                ? 'Les plans de travail 3D de TSA permettent de dessiner des ossatures complexes, toitures en pente, treillis tridimensionnels ou passerelles directement dans le plan incliné adéquat sans calcul de coordonnées fastidieux.'
                : 'TSA 3D WorkPlanes empower engineers to draft complex roof geometries, inclined truss systems, and curved bridges directly within the active drafting plane without tedious trigonometric manual projections.'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold font-mono">
              <Badge status="AVAILABLE" size="sm" />
              <span>{language === 'fr' ? 'Intégré au Viewer 3D' : 'Integrated in 3D Viewport'}</span>
            </div>
          </Card>

          <Card className="p-8">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-tsa-cyan-500 dark:text-tsa-cyan-300 flex items-center justify-center mb-4">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'fr' ? 'Grilles Cartésiennes & Cylindriques' : 'Cartesian & Cylindrical Grids'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {language === 'fr'
                ? 'Système de grilles spatiales multi-niveaux avec accrochage magnétique instantané aux intersections, étiquettes paramétriques d\'axes et gestion des hauteurs d\'étages architecturales.'
                : 'Multi-level spatial grid systems featuring magnetic intersection snapping, parametric axis bubble labels, and architectural story elevation coordination.'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold font-mono">
              <Badge status="AVAILABLE" size="sm" />
              <span>{language === 'fr' ? 'Intégré au Modèle' : 'Integrated in Core Model'}</span>
            </div>
          </Card>
        </div>

        {/* Clear Development Transparency Box */}
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold block mb-1">
              {language === 'fr' ? 'Transparence sur l\'état du support IFC' : 'Transparency Notice on IFC Support'}
            </span>
            {language === 'fr'
              ? 'L\'export et l\'import direct des fichiers IFC 4.3 (IfcStructuralAnalysisModel) sont actuellement en cours de développement et de spécification sur la feuille de route. Ils ne sont pas présentés comme officiellement achevés dans la version pré-release actuelle.'
              : 'Direct import and export of IFC 4.3 (IfcStructuralAnalysisModel) files are currently in active development on the development roadmap. They are not presented as completed in the current pre-release build.'}
          </div>
        </div>
      </div>
    </div>
  );
};
