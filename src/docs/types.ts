// Modèle de la documentation en ligne (contenu Markdown dans src/content/docs/<langue>/<catégorie>/<page>.md).

export type DocLanguage = 'fr' | 'en';

/** État réel de la fonctionnalité décrite : jamais « disponible » pour une fonction prévue. */
export type DocStatus = 'available' | 'experimental' | 'planned';

export interface DocMeta {
  title: string;
  description: string;
  category: string;          // identifiant de catégorie (dossier)
  slug: string;              // nom du fichier sans extension ; « index » = page d'accueil de la catégorie
  order: number;             // ordre dans la catégorie
  status: DocStatus;
  version: string;           // version de TSA décrite (ex. 0.1.0)
  updated: string;           // AAAA-MM-JJ
  keywords: string[];        // commandes, fenêtres, synonymes (recherche)
  helpIds: string[];         // identifiants d'aide de TSA qui ouvrent cette page
}

export interface DocPage extends DocMeta {
  language: DocLanguage;
  path: string;              // route : /docs/<catégorie>/<page>, ou /docs/<catégorie> pour « index »
  body: string;              // Markdown sans l'en-tête
}

export interface DocCategory {
  id: string;
  order: number;
  title: Record<DocLanguage, string>;
  description: Record<DocLanguage, string>;
}
