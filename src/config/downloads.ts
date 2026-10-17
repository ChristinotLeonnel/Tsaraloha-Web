// Téléchargements : versions publiées lues dans src/generated/releases.json (scripts/fetch-releases.mjs, à la
// construction) et faits de distribution vérifiés dans les dépôts des logiciels (docs/DEPLOYMENT.md). Aucune version,
// taille ni empreinte n'est écrite à la main ici.
import productsConfig from './products.json';
import releasesData from '../generated/releases.json';

type Localized = { fr: string; en: string };

export type ProductId = 'tsa' | 'tsalab';
export type ReleaseChannel = 'stable' | 'prerelease' | 'experimental';

export interface ReleaseAsset {
  name: string;
  size: number;
  url: string;
  sha256: string;
  os: 'windows';
  arch: 'x64';
  format: 'portable-zip';
  downloads: number;
}

export interface Release {
  tag: string;
  version: string;
  channel: ReleaseChannel;
  title: string;
  publishedAt: string;
  notes: string;
  pageUrl: string;
  checksumsUrl: string;
  assets: ReleaseAsset[];
}

export interface ProductReleases {
  repo: string;
  checkedAt: string | null;
  stale: boolean;
  releases: Release[];
}

export interface Product {
  id: ProductId;
  name: string;
  fullName: string;
  repo: string;
}

export const products = productsConfig.products as Product[];
export const productById = (id: ProductId) => products.find((p) => p.id === id)!;

const data = releasesData as { generatedAt: string; products: Record<string, ProductReleases> };

export function releasesOf(id: ProductId): ProductReleases {
  return data.products[id] ?? { repo: productById(id).repo, checkedAt: null, stale: true, releases: [] };
}

/** Dernière version stable, sinon null : une préversion n'est jamais présentée comme « dernière version ». */
export const latestStable = (id: ProductId) => releasesOf(id).releases.find((r) => r.channel === 'stable') ?? null;

/** Faits de distribution vérifiés (TSA/docs/DEPLOYMENT.md), communs aux deux logiciels. */
export const distribution = {
  os: { fr: 'Windows 10 ou Windows 11, 64 bits (x64)', en: 'Windows 10 or Windows 11, 64-bit (x64)' } as Localized,
  format: {
    fr: 'Archive ZIP d’un dossier portable : aucune installation, aucun droit administrateur',
    en: 'ZIP archive of a portable folder: no installation, no administrator rights',
  } as Localized,
  bundled: {
    fr: 'Qt, OpenCASCADE et le runtime Microsoft Visual C++ sont livrés dans le dossier, ainsi qu’OpenSees si le fichier MANIFEST.json de l’archive l’indique : rien d’autre à installer',
    en: 'Qt, OpenCASCADE and the Microsoft Visual C++ runtime ship in the folder, plus OpenSees when the archive’s MANIFEST.json says so: nothing else to install',
  } as Localized,
  graphics: {
    fr: 'Carte graphique avec un pilote OpenGL à jour (vue 3D OpenCASCADE)',
    en: 'Graphics card with an up-to-date OpenGL driver (OpenCASCADE 3D view)',
  } as Localized,
  unsigned: {
    fr: 'Les exécutables ne sont pas signés : Windows SmartScreen peut afficher un avertissement au premier lancement. Vérifiez l’empreinte SHA-256 avant d’ouvrir l’archive.',
    en: 'Executables are not code-signed: Windows SmartScreen may warn on first launch. Verify the SHA-256 checksum before opening the archive.',
  } as Localized,
  notMeasured: {
    fr: 'Aucune configuration matérielle minimale ou recommandée n’a encore été mesurée : les besoins en mémoire dépendent surtout de la taille du modèle et du maillage.',
    en: 'No minimum or recommended hardware configuration has been measured yet: memory needs depend mostly on model and mesh size.',
  } as Localized,
  linux: {
    fr: 'Linux et macOS : aucune version n’est produite et aucune compilation n’a été vérifiée ; seule la chaîne Windows (MSVC) est prise en charge.',
    en: 'Linux and macOS: no build is produced and no compilation has been verified; only the Windows (MSVC) toolchain is supported.',
  } as Localized,
};

export const formatBytes = (n: number, language: 'fr' | 'en') =>
  new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 1 }).format(n / (1024 * 1024)) +
  (language === 'fr' ? ' Mo' : ' MB');
