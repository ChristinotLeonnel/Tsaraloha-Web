import React, { useState } from 'react';
import { Box, Grid3X3, Cpu, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const EngineeringWorkflow: React.FC = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      titleEn: '1. Physical Structural Model',
      titleFr: '1. Modèle Physique 3D',
      icon: <Box className="w-5 h-5" />,
      descEn: 'Model 3D parametric nodes, beams, columns, slabs, shear walls, and foundation springs using intuitive WorkPlanes and CAD snaps.',
      descFr: 'Modélisation des nœuds 3D, poutres, poteaux, dalles, voiles et appuis de fondation via les plans de travail paramétriques.',
      detailsEn: [
        'Centralized structural object model (src/Model/Model.h)',
        'Parametric section profiles (IPE, HEA, Rectangular, Pipes)',
        'Hot-reloadable material libraries (TSALib)',
      ],
      detailsFr: [
        'Modèle objet structural unifié (src/Model/Model.h)',
        'Sections paramétriques (IPE, HEA, Rectangulaires, Tubes)',
        'Bibliothèques de matériaux dynamiques (TSALib)',
      ],
    },
    {
      id: 1,
      titleEn: '2. Discretization & Meshing',
      titleFr: '2. Discrétisation & Maillage',
      icon: <Grid3X3 className="w-5 h-5" />,
      descEn: 'Automatic division of linear frame elements and Delaunay advancing front surface meshing for plate and shell diaphragms.',
      descFr: 'Division automatique des barres et maillage Delaunay / front montant des dalles et voiles en coques triangulaires et quadrilatérales.',
      detailsEn: [
        '1D Timoshenko & Euler-Bernoulli beam subdivisions',
        '2D Plate and Shell elements with drilling degrees of freedom',
        'Local mesh refinement around column heads and openings',
      ],
      detailsFr: [
        'Sous-division des barres Timoshenko & Euler-Bernoulli',
        'Coques 2D avec prise en compte du degré de liberté de forage',
        'Raffinement local automatique aux têtes de poteaux et trémies',
      ],
    },
    {
      id: 2,
      titleEn: '3. OpenSees Model Assembly',
      titleFr: '3. Assemblage OpenSees',
      icon: <Cpu className="w-5 h-5" />,
      descEn: 'Algorithmic compilation into the OpenSees finite element framework, establishing stiffness matrices [K] and boundary restraints.',
      descFr: 'Compilation algorithmique vers le moteur OpenSees, assemblage des matrices de rigidité [K] et conditions aux limites.',
      detailsEn: [
        'ElasticBeamColumn & ShellMITC4 analytical elements',
        'Direct stiffness matrix formulation [K]{U} = {F}',
        'Automated Eurocode EN 1990 action combination matrices',
      ],
      detailsFr: [
        'Éléments d\'analyse ElasticBeamColumn et ShellMITC4',
        'Formulation matricielle directe [K]{U} = {F}',
        'Matrices de combinaisons d\'actions selon l\'Eurocode 0',
      ],
    },
    {
      id: 3,
      titleEn: '4. High-Precision Solve',
      titleFr: '4. Résolution Haute Précision',
      icon: <Activity className="w-5 h-5" />,
      descEn: 'Execution of sparse matrix linear solvers, eigenvalue modal decomposition, and nonlinear iteration algorithms.',
      descFr: 'Exécution des solveurs creux haute performance, analyse spectrale modale et algorithmes itératifs non-linéaires.',
      detailsEn: [
        'Linear Static Solver (BandGeneral / UmfPack)',
        'Modal Eigenvalue Analysis (Lanczos / Subspace)',
        'Geometric Nonlinearity (P-Delta & Large Displacements)',
      ],
      detailsFr: [
        'Solveur statique linéaire (BandGeneral / UmfPack)',
        'Analyse modale spectrale (Lanczos / Sous-espace)',
        'Non-linéarités géométriques (P-Delta et grands déplacements)',
      ],
    },
    {
      id: 4,
      titleEn: '5. Results & Equilibrium Audit',
      titleFr: '5. Résultats & Contrôle d\'Équilibre',
      icon: <CheckCircle className="w-5 h-5" />,
      descEn: 'Interactive GPU-accelerated visualization of deformation fields, N-V-M diagrams, and automated equilibrium checks (∑F = 0).',
      descFr: 'Visualisation GPU interactive des champs de déplacement, diagrammes N-V-M et contrôle automatisé d\'équilibre statique (∑F = 0).',
      detailsEn: [
        'High-resolution Bending Moment (My, Mz) curves',
        'Axial Force (N) tension/compression gradient overlays',
        'Automated static balance verification (∑F_ext = ∑Reactions)',
      ],
      detailsFr: [
        'Tracés vectoriels haute résolution des moments (My, Mz)',
        'Dégradés colorés d\'efforts normaux (N) traction/compression',
        'Bilan d\'équilibre statique automatisé (∑Actions = ∑Réactions)',
      ],
    },
  ];

  return (
    <div className="w-full my-8">
      {/* Step Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 ${
                isActive
                  ? 'bg-tsa-blue-600/10 dark:bg-tsa-blue-600/20 border-tsa-blue-500 text-tsa-blue-600 dark:text-tsa-cyan-300 shadow-md'
                  : 'bg-white dark:bg-tsa-surface-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg w-fit ${isActive ? 'bg-tsa-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {step.icon}
              </div>
              <span className="text-xs font-semibold line-clamp-1">
                {language === 'fr' ? step.titleFr : step.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 font-semibold mb-1">
              {language === 'fr' ? `Étape ${activeStep + 1} sur 5` : `Step ${activeStep + 1} of 5`}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'fr' ? steps[activeStep].titleFr : steps[activeStep].titleEn}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium disabled:opacity-30"
            >
              {language === 'fr' ? 'Précédent' : 'Previous'}
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white text-xs font-medium disabled:opacity-30"
            >
              {language === 'fr' ? 'Suivant' : 'Next'}
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'fr' ? steps[activeStep].descFr : steps[activeStep].descEn}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {language === 'fr' ? 'Caractéristiques Techniques :' : 'Technical Specifications :'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(language === 'fr' ? steps[activeStep].detailsFr : steps[activeStep].detailsEn).map((detail, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-tsa-navy-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <ArrowRight className="w-3.5 h-3.5 text-tsa-blue-500 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
