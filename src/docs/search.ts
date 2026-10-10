// Recherche dans la documentation : titres, descriptions, mots-clés (commandes, fenêtres, synonymes),
// intertitres et texte. Insensible à la casse et aux accents ; synonymes français / anglais.

import { navigationPages } from './catalog';
import type { DocLanguage, DocPage } from './types';

/** Groupes de synonymes : un terme de la requête cherche aussi les autres termes de son groupe. */
const synonymGroups: string[][] = [
  ['charge repartie', 'charge lineique', 'charge uniforme', 'distributed load', 'udl', 'line load'],
  ['charge trapezoidale', 'charge triangulaire', 'charge variable', 'trapezoidal load', 'triangular load', 'linear load'],
  ['charge ponctuelle', 'force ponctuelle', 'force concentree', 'point load', 'concentrated load'],
  ['charge nodale', 'force et couple', 'nodal load', 'nodal force', 'moment nodal', 'couple'],
  ['barre', 'poutre', 'poteau', 'element filaire', 'member', 'beam', 'column', 'bar'],
  ['noeud', 'node', 'point'],
  ['appui', 'encastrement', 'articulation', 'support', 'fixed', 'pinned', 'boundary condition', 'condition aux limites'],
  ['dalle', 'voile', 'surface', 'slab', 'wall', 'shell', 'element surfacique'],
  ['selection', 'select', 'ctrl clic', 'ctrl click', 'selection multiple', 'multi selection'],
  ['accrochage', 'snap', 'snapping', 'osnap', 'magnetisme'],
  ['maillage', 'mesh', 'meshing', 'elements finis', 'finite element'],
  ['analyse', 'calcul', 'analysis', 'solver', 'solveur', 'opensees', 'custom2d'],
  ['resultat', 'results', 'deformee', 'deformed', 'diagramme', 'diagram', 'efforts', 'reactions'],
  ['note de calcul', 'rapport', 'report', 'calculation report', 'ndc', 'pdf'],
  ['cas de charge', 'combinaison', 'load case', 'load combination', 'elu', 'els', 'uls', 'sls'],
  ['poids propre', 'self weight', 'self-weight', 'gravite', 'gravity'],
  ['ifc', 'bim', 'import', 'export', 'interoperabilite', 'interoperability'],
  ['erreur', 'bug', 'crash', 'plantage', 'probleme', 'error', 'problem', 'depannage', 'troubleshooting'],
  ['enregistrer', 'sauvegarder', 'save', 'ouvrir', 'open', 'fichier', 'file', 'tsa'],
  ['annuler', 'retablir', 'undo', 'redo', 'ctrl z'],
  ['grille', 'axe', 'grid', 'niveau', 'level', 'plan de travail', 'workplane'],
];

export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim();

/** Variantes d'un terme : lui-même et ses synonymes (comparaison sur le texte normalisé). */
function expand(term: string): string[] {
  const variants = new Set([term]);
  for (const group of synonymGroups) {
    if (group.some((entry) => entry === term || entry.split(' ').includes(term) || term.includes(entry)))
      group.forEach((entry) => variants.add(entry));
  }
  return [...variants];
}

interface IndexedPage {
  page: DocPage;
  title: string;
  description: string;
  keywords: string;
  headings: string;
  body: string;
}

const indexCache = new Map<DocLanguage, IndexedPage[]>();

function indexFor(language: DocLanguage): IndexedPage[] {
  const cached = indexCache.get(language);
  if (cached) return cached;
  const indexed = navigationPages(language).map((page) => ({
    page,
    title: normalize(page.title),
    description: normalize(page.description),
    keywords: normalize(page.keywords.join(' ')),
    headings: normalize((page.body.match(/^#{2,4} .+$/gm) ?? []).join(' ')),
    body: normalize(page.body.replace(/```[\s\S]*?```/g, ' ')),
  }));
  indexCache.set(language, indexed);
  return indexed;
}

export interface SearchHit {
  page: DocPage;
  score: number;
}

/**
 * Pages correspondant à la requête : chaque terme (ou l'un de ses synonymes) doit apparaître ; la
 * pertinence privilégie le titre, puis les mots-clés, les intertitres, la description et le texte.
 */
export function searchDocs(query: string, language: DocLanguage, limit = 12): SearchHit[] {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];
  // La requête entière est essayée comme expression (« charge repartie »), puis mot à mot.
  const terms = normalized.split(' ').filter((t) => t.length >= 2);
  const groups = [expand(normalized), ...terms.map(expand)];
  const hits: SearchHit[] = [];
  for (const entry of indexFor(language)) {
    let score = 0;
    let matchedAllTerms = true;
    terms.forEach((term, i) => {
      let best = 0;
      for (const v of groups[i + 1]) {
        // Le terme saisi compte plus que ses synonymes : « IFC » classe d'abord la page IFC.
        const weight = v === term ? 1 : 0.6;
        let s = 0;
        if (entry.title.includes(v)) s = 10;
        else if (entry.keywords.includes(v)) s = 8;
        else if (entry.headings.includes(v)) s = 5;
        else if (entry.description.includes(v)) s = 4;
        else if (entry.body.includes(v)) s = 1;
        best = Math.max(best, s * weight);
      }
      if (best === 0) matchedAllTerms = false;
      score += best;
    });
    if (entry.title.includes(normalized)) score += 15;
    else if (entry.keywords.includes(normalized)) score += 10;
    const phrase = groups[0].some((v) => entry.title.includes(v) || entry.keywords.includes(v));
    if (phrase) score += 5;
    if ((matchedAllTerms && score > 0) || phrase) hits.push({ page: entry.page, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title)).slice(0, limit);
}
