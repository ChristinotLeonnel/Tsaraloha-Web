import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SEOHead } from '../components/SEOHead';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  MessageSquare,
  ArrowRight,
  Send,
} from 'lucide-react';

export const CoEngineeringPage: React.FC = () => {
  const { language } = useLanguage();

  // Interactive Co-Engineering Assistant Demo Simulation (zero API keys needed)
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);

  const samplePrompts = [
    {
      titleEn: 'Detect Load Path Discontinuities',
      titleFr: 'Détecter les discontinuités de descente de charges',
      queryEn: 'Check the transfer floor at Level 2 for column load path interruptions and high shear concentration.',
      queryFr: 'Vérifie le plancher de reprise au Niveau 2 pour déceler les discontinuités de descente de charge et les pics de cisaillement.',
      responseEn: `[TSA Co-Engineering Diagnostic Report]
• Finding: Column C14 transfers onto Girder B208 (IPE 450) without a direct vertical support below.
• Analytical check: Girder B208 experiences a midspan concentrated shear force of 480 kN and a deflection of L/310 (Serviceability limit: L/350).
• Engineering Recommendation: Consider adding a stiffened web bracket or increasing the girder section to HEB 400.
• Compliance Notice: Verification must be validated by the licensed engineer against EN 1993-1-1 §6.2.6.`,
      responseFr: `[Rapport de Diagnostic Co-Engineering TSA]
• Constat : Le poteau C14 repose en reprise sur la poutre maîtresse B208 (IPE 450) sans appui vertical direct à l'étage inférieur.
• Contrôle analytique : La poutre B208 subit une charge ponctuelle de 480 kN à mi-portée avec une flèche de L/310 (Tolérance ELS : L/350).
• Recommandation : Envisager un renfort d'âme ou le surdimensionnement du profilé vers un HEB 400.
• Mention légale : Cette suggestion doit obligatoirement être validée par l'ingénieur selon l'Eurocode 3 (EN 1993-1-1).`,
    },
    {
      titleEn: 'Mesh Sensitivity Evaluation',
      titleFr: 'Évaluation de sensibilité du maillage',
      queryEn: 'Analyze the slab mesh around column heads. Is local refinement necessary?',
      queryFr: 'Analyse le maillage de la dalle autour des têtes de poteaux. Un raffinement local est-il nécessaire ?',
      responseEn: `[TSA Mesh Quality Analysis]
• Aspect Ratio Check: 4.2% of shell elements exceed an aspect ratio of 3.5:1 near Column C03.
• Stress Gradient: A 42% shear jump between adjacent elements indicates discretization discretization error.
• Recommendation: Apply adaptive mesh refinement (H-refinement) within a 1.2 m radius around column heads. Expected convergence error reduction: ~65%.`,
      responseFr: `[Analyse Qualité du Maillage TSA]
• Ratio d'aspect : 4,2% des éléments coques dépassent un ratio de 3,5:1 à proximité du poteau C03.
• Gradient de contraintes : Un saut d'effort tranchant de 42% entre éléments voisins révèle une sensibilité au maillage.
• Recommandation : Appliquer un raffinement adaptatif (raffinement H) dans un rayon de 1,2 m autour des têtes de poteaux. Gain de convergence estimé : ~65%.`,
    },
    {
      titleEn: 'Automated Calculation Note Synthesis',
      titleFr: 'Synthèse automatique de note de calcul',
      queryEn: 'Generate an executive summary of wind combinations and foundation reactions for the geotechnical consultant.',
      queryFr: 'Génère une synthèse des combinaisons de vent et des réactions d\'appuis pour le bureau géotechnique.',
      responseEn: `[Geotechnical Handover Summary]
• Governing Combination: 1.35 G + 1.50 Q + 0.90 W_x (ULS Envelope)
• Maximum Foundation Downward Thrust: F_z,max = 1420 kN (Support S01)
• Maximum Foundation Uplift: F_z,min = -85 kN (Tension on windward base S06, requires tie-down anchor check)
• Resultant Overturning Moment: M_y,tot = 3850 kNm.`,
      responseFr: `[Synthèse pour le Bureau Géotechnique]
• Combinaison dimensionnante : 1,35 G + 1,50 Q + 0,90 W_x (Enveloppe ELU)
• Descente de charge maximale : F_z,max = 1420 kN (Appui S01)
• Soulèvement maximal : F_z,min = -85 kN (Traction au vent sur l'appui S06, ancrage requis)
• Moment de renversement global : M_y,tot = 3850 kNm.`,
    },
  ];

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={language === 'fr' ? 'Co-Engineering IA' : 'Co-Engineering AI'}
        description={
          language === 'fr'
            ? 'L\'ingénierie des structures assistée par IA avec TSA : copilote d\'analyse, contrôle de maillage, détection d\'anomalies et respect du jugement humain.'
            : 'AI-assisted structural engineering with TSA: analysis co-pilot, mesh quality diagnostics, anomaly detection, and human responsibility.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-xs font-semibold text-tsa-cyan-500 dark:text-tsa-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Copilote d\'Ingénierie Structurale' : 'Structural Engineering Co-Pilot'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Co-Engineering —{' '}
            <span className="bg-gradient-to-r from-tsa-blue-600 to-tsa-cyan-400 bg-clip-text text-transparent">
              {language === 'fr' ? 'L\'IA au Service de l\'Ingénieur' : 'AI-Assisted Engineering'}
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'fr'
              ? 'TSA développe une vision pionnière : intégrer une intelligence artificielle spécialisée dans le domaine de la mécanique des structures pour assister le concepteur dans les tâches complexes, sans jamais remplacer la signature et la responsabilité légale de l\'ingénieur.'
              : 'TSA pioneers an engineering co-pilot designed specifically for structural mechanics—empowering the professional engineer with advanced diagnostics, verification checks, and drafting automation without replacing human judgment.'}
          </p>
        </div>

        {/* Fundamental Ethical & Legal Rule Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-tsa-navy-950 border border-slate-700/80 shadow-2xl text-white mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-tsa-cyan-400 mb-1">
                {language === 'fr' ? 'Principe Fondamental & Responsabilité' : 'Core Engineering Principle'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {language === 'fr'
                  ? 'Une Assistance Dédiée — Jamais un Remplacement Automatique'
                  : 'An Engineering Assistant — Never an Automatic Substitute'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {language === 'fr'
                  ? 'La sécurité des ouvrages et des personnes exige une imputabilité juridique absolue. L\'IA Co-Engineering ne valide aucun document de manière autonome : elle formule des observations techniques, signale des incohérences et propose des scénarios d\'optimisation que l\'ingénieur qualifié valide ou rejette souverainement.'
                  : 'Civil structures impact public safety and require unambiguous legal accountability. TSA Co-Engineering will never automatically sign off or approve structural designs: it serves as an analytical assistant, surfacing anomalies, mesh deficiencies, and optimization suggestions for the licensed engineer\'s authoritative review.'}
              </p>
            </div>
          </div>
        </div>

        {/* The 4 Core Pillars */}
        <div className="mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 mb-2">
            {language === 'fr' ? 'Les 4 Piliers du Co-Engineering' : 'The 4 Co-Engineering Pillars'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {language === 'fr' ? 'Comment l\'IA Intervient dans TSA' : 'How AI Enhances the TSA Workflow'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-tsa-blue-600 dark:text-tsa-blue-400 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? '1. Assistant de Modélisation 3D' : '1. 3D Modeling Assistant'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {language === 'fr'
                  ? 'Assistance à la saisie de géométries complexes (portiques réguliers, treillis spatiaux, toitures sheds), attribution automatique de sections standards et explication en clair des erreurs de topologie.'
                  : 'Assisted generation of complex structural layouts, parametric trusses, shed roofs, automatic cross-section suggestions, and plain-language explanation of geometry errors.'}
              </p>
              <div className="text-xs font-mono text-slate-500">
                Status: <span className="text-amber-500 font-semibold">Planned in v0.2.0</span>
              </div>
            </Card>

            {/* Pillar 2 */}
            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-tsa-cyan-500 dark:text-tsa-cyan-300 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? '2. Diagnostic & Analyse Structurale' : '2. Engineering Diagnostics'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {language === 'fr'
                  ? 'Audit des résultats OpenSees : détection des singularités de rigidité, localisation des concentrations de contraintes, vérification des dérives d\'étages et contrôle du conditionnement matriciel.'
                  : 'In-depth audit of OpenSees results: identification of singular stiffness degrees of freedom, stress concentrations, story drift violations, and ill-conditioned structural systems.'}
              </p>
              <div className="text-xs font-mono text-slate-500">
                Status: <span className="text-amber-500 font-semibold">In Development</span>
              </div>
            </Card>

            {/* Pillar 3 */}
            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? '3. Aide à la Décision & Variantes' : '3. Decision Support & Variants'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {language === 'fr'
                  ? 'Comparaison multicritère de variantes structurelles (acier vs béton armé, profilés optimisés en poids carbone), suggestion de raffinement du maillage et mise en évidence des incohérences de descente de charge.'
                  : 'Multi-criteria comparison of structural design variants (embodied carbon, steel vs concrete), mesh refinement suggestions, and detection of load path discontinuities.'}
              </p>
              <div className="text-xs font-mono text-slate-500">
                Status: <span className="text-amber-500 font-semibold">Research & Roadmap</span>
              </div>
            </Card>

            {/* Pillar 4 */}
            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'fr' ? '4. Rédaction de Notes de Calcul' : '4. Automated Reporting'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {language === 'fr'
                  ? 'Génération automatisée des rapports de calcul conformes aux normes : hypothèses de charges, lois de matériaux, équations d\'analyse, synthèses d\'enveloppes et extraits 3D pour le bureau de contrôle.'
                  : 'Automated synthesis of calculation reports compliant with structural standards: load assumptions, material laws, analytical formulation traces, envelopes, and 3D diagrams.'}
              </p>
              <div className="text-xs font-mono text-slate-500">
                Status: <span className="text-amber-500 font-semibold">Planned in Pro</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Interactive Co-Engineering Demo / Simulator */}
        <div className="mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-tsa-blue-600 dark:text-tsa-cyan-400 mb-2">
            {language === 'fr' ? 'Démonstrateur Interactif' : 'Interactive Concept Demo'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            {language === 'fr' ? 'Exemple de Dialogue avec l\'Assistant TSA' : 'Simulated Assistant Interactions'}
          </h2>

          <div className="rounded-2xl bg-white dark:bg-tsa-surface-card border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Prompt Selector Pills */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPrompt === idx
                      ? 'bg-tsa-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {language === 'fr' ? p.titleFr : p.titleEn}
                </button>
              ))}
            </div>

            {/* Conversation Flow */}
            <div className="p-6 space-y-6">
              {/* User message */}
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                  ENG
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-200">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {language === 'fr' ? 'Ingénieur Structure' : 'Structural Engineer'}
                  </div>
                  {language === 'fr'
                    ? samplePrompts[selectedPrompt].queryFr
                    : samplePrompts[selectedPrompt].queryEn}
                </div>
              </div>

              {/* AI Assistant Response */}
              <div className="flex items-start gap-3 max-w-2xl ml-auto">
                <div className="p-4 rounded-2xl rounded-tr-none bg-tsa-blue-600/10 dark:bg-tsa-blue-900/30 border border-tsa-blue-500/20 text-sm text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TSA Co-Engineering AI Assistant</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {language === 'fr'
                      ? samplePrompts[selectedPrompt].responseFr
                      : samplePrompts[selectedPrompt].responseEn}
                  </pre>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tsa-blue-600 to-tsa-cyan-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-center text-slate-500">
              {language === 'fr'
                ? 'Simulation conceptuelle : l\'assistant Co-Engineering s\'appuie sur le modèle structural et les résultats OpenSees.'
                : 'Conceptual simulation: the Co-Engineering assistant interfaces with the structural model and OpenSees results.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
