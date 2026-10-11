// Catégories du catalogue des fonctions : libellé traduit et icône, partagés par la page Fonctionnalités et
// l'aperçu de l'accueil (jamais l'identifiant brut à l'écran).
import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, Boxes, Move3D, Activity, Grid3X3, ChartColumn } from 'lucide-react';
import type { FeatureCategory, Language } from '../types';

export interface FeatureCategoryInfo {
  id: FeatureCategory | 'all';
  label: Record<Language, string>;
  icon: LucideIcon;
}

export const featureCategories: FeatureCategoryInfo[] = [
  { id: 'all', label: { fr: 'Toutes les catégories', en: 'All categories' }, icon: LayoutGrid },
  { id: 'modeling', label: { fr: 'Modélisation 3D', en: '3D modeling' }, icon: Boxes },
  { id: 'cad', label: { fr: 'CAO & manipulation', en: 'CAD & manipulation' }, icon: Move3D },
  { id: 'analysis', label: { fr: 'Analyse & solveurs', en: 'Analysis & solvers' }, icon: Activity },
  { id: 'meshing', label: { fr: 'Maillage éléments finis', en: 'Finite element meshing' }, icon: Grid3X3 },
  { id: 'results', label: { fr: 'Résultats & post-traitement', en: 'Results & post-processing' }, icon: ChartColumn },
];

export const featureCategory = (id: FeatureCategory) => featureCategories.find((c) => c.id === id)!;
