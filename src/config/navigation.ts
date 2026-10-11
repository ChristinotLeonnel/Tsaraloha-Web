// Rubriques du site : une seule définition (route, libellé traduit, icône, description) partagée par l'en-tête,
// le menu mobile et le pied de page. `tsa` : icône officielle du logiciel pour la même fonction (tsaIcons.ts) ;
// sinon l'icône Lucide sert de repère, sans être présentée comme une icône de TSA.
import type { LucideIcon } from 'lucide-react';
import {
  House,
  LayoutGrid,
  Activity,
  Building2,
  Sparkles,
  BookOpen,
  LifeBuoy,
  Download,
  Tag,
  Scale,
  Milestone,
  History,
  Info,
} from 'lucide-react';
import type { Language } from '../types';
import type { TsaIconKey } from './tsaIcons';
import type { fr } from '../i18n/translations/fr';

type NavKey = keyof typeof fr.nav;

export interface NavItem {
  href: string;
  key: NavKey;
  icon: LucideIcon;
  tsa?: TsaIconKey;
  desc?: Record<Language, string>;
}

/** Rubriques principales (barre de navigation). */
export const primaryNav: NavItem[] = [
  { href: '/', key: 'home', icon: House },
  { href: '/features', key: 'features', icon: LayoutGrid, tsa: 'view3d' },
  { href: '/analysis', key: 'analysis', icon: Activity, tsa: 'analysisRun' },
  { href: '/bim', key: 'bim', icon: Building2, tsa: 'exportIfc' },
  { href: '/co-engineering', key: 'coEngineering', icon: Sparkles },
  { href: '/docs', key: 'docs', icon: BookOpen, tsa: 'help' },
];

/** Rubriques secondaires (menu « Plus »). */
export const secondaryNav: NavItem[] = [
  { href: '/support', key: 'support', icon: LifeBuoy, desc: { fr: 'FAQ, dépannage et signalement de bugs', en: 'FAQ, troubleshooting and bug reports' } },
  { href: '/downloads', key: 'downloads', icon: Download, desc: { fr: 'Versions et code source', en: 'Releases and source code' } },
  { href: '/pricing', key: 'pricing', icon: Tag, desc: { fr: 'Éditions et conditions', en: 'Editions and terms' } },
  { href: '/licensing', key: 'licensing', icon: Scale, desc: { fr: 'Licences de TSA et composants tiers', en: 'TSA and third-party licenses' } },
  { href: '/roadmap', key: 'roadmap', icon: Milestone, desc: { fr: 'Feuille de route et jalons', en: 'Development milestones' } },
  { href: '/changelog', key: 'changelog', icon: History, desc: { fr: 'Historique des versions', en: 'Release notes' } },
  { href: '/about', key: 'about', icon: Info, tsa: 'about', desc: { fr: 'Vision et contact', en: 'Vision and contact' } },
];

/** Rubrique active : la route elle-même ou l'une de ses sous-pages (/docs/mesh/display → /docs). */
export const isActivePath = (current: string, href: string) =>
  href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`);
