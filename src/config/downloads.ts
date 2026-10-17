// Téléchargements : versions publiées lues dans src/generated/releases.json (scripts/fetch-releases.mjs, à la
// construction) et faits de distribution vérifiés dans les dépôts des logiciels (docs/DEPLOYMENT.md). Aucune version,
// taille ni empreinte n'est écrite à la main ici.
import productsConfig from './products.json';
import releasesData from '../generated/releases.json';

type Localized = { fr: string; en: string };

export type ProductId = 'tsa' | 'tsalab';
export type ReleaseChannel = 'stable' | 'prerelease' | 'experimental';
export type AssetOs = 'windows' | 'linux' | 'macos';
export type AssetFormat = 'installer' | 'portable-zip' | 'appimage' | 'dmg';

export interface ReleaseAsset {
  name: string;
  size: number;
  url: string;
  sha256: string;
  os: AssetOs;
  arch: string;
  format: AssetFormat;
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
  /** Dépôt public du code source (MIT ; exigé par la GPL de Gmsh, livré avec le logiciel). */
  sourceRepo: string;
  /** Dépôt public de diffusion : GitHub Releases (installateur, archive, SHA256SUMS.txt) et tickets. */
  releaseRepo: string;
  /** Préfixe d'étiquette des versions du produit dans releaseRepo (tsa-v, tsalab-v). */
  tagPrefix: string;
  /** Dossier des réglages de l'utilisateur (ProductIdentity.h : organisationpplication). */
  dataDir: string;
}

export const products = productsConfig.products as Product[];
export const productById = (id: ProductId) => products.find((p) => p.id === id)!;

const data = releasesData as { generatedAt: string; products: Record<string, ProductReleases> };

export function releasesOf(id: ProductId): ProductReleases {
  return data.products[id] ?? { repo: productById(id).releaseRepo, checkedAt: null, stale: true, releases: [] };
}

/** Dernière version stable, sinon null : une préversion n'est jamais présentée comme « dernière version ». */
export const latestStable = (id: ProductId) => releasesOf(id).releases.find((r) => r.channel === 'stable') ?? null;

/** Faits de distribution vérifiés (TSA/docs/DEPLOYMENT.md), communs aux deux logiciels. */
export const distribution = {
  formats: {
    installer: {
      fr: 'Installateur pour l’utilisateur courant : menu Démarrer, association des fichiers, désinstallation depuis les Paramètres ; aucun droit administrateur',
      en: 'Per-user installer: Start menu, file association, uninstall from Settings; no administrator rights',
    },
    'portable-zip': {
      fr: 'Archive ZIP d’un dossier portable : à extraire, sans installation',
      en: 'ZIP archive of a portable folder: extract and run, no installation',
    },
    appimage: {
      fr: 'AppImage : un seul fichier exécutable, sans installation ni droits administrateur',
      en: 'AppImage: a single executable file, no installation or administrator rights',
    },
    dmg: {
      fr: 'Image disque contenant l’application, à glisser dans le dossier Applications',
      en: 'Disk image containing the application, to drag into the Applications folder',
    },
  } as Record<AssetFormat, Localized>,
  bundled: {
    fr: 'Qt, OpenCASCADE, le mailleur Gmsh et le runtime Microsoft Visual C++ sont livrés, ainsi qu’OpenSees si le fichier MANIFEST.json l’indique : rien d’autre à installer',
    en: 'Qt, OpenCASCADE, the Gmsh mesher and the Microsoft Visual C++ runtime are bundled, plus OpenSees when MANIFEST.json says so: nothing else to install',
  } as Localized,
  graphics: {
    fr: 'Carte graphique avec un pilote OpenGL à jour (vue 3D OpenCASCADE)',
    en: 'Graphics card with an up-to-date OpenGL driver (OpenCASCADE 3D view)',
  } as Localized,
  notMeasured: {
    fr: 'Aucune configuration matérielle minimale ou recommandée n’a encore été mesurée : les besoins en mémoire dépendent surtout de la taille du modèle et du maillage.',
    en: 'No minimum or recommended hardware configuration has been measured yet: memory needs depend mostly on model and mesh size.',
  } as Localized,
  /** Système sans fichier dans la version affichée. */
  inPreparation: {
    fr: 'version en préparation : elle apparaîtra ici dès qu’elle aura été compilée et testée',
    en: 'build in preparation: it will appear here once it has been compiled and tested',
  } as Localized,
};

/** Par système : nom, empreinte à calculer, installation, avertissement de signature. */
export const platforms: Record<AssetOs, {
  label: string;
  system: Localized;
  checksum: (file: string) => { code: string; shell: string };
  install: Localized;
  unsigned: Localized;
}> = {
  windows: {
    label: 'Windows',
    system: { fr: 'Windows 10 ou Windows 11, 64 bits (x64)', en: 'Windows 10 or Windows 11, 64-bit (x64)' },
    checksum: (file) => ({ code: `(Get-FileHash -Algorithm SHA256 .\\${file}).Hash.ToLower()`, shell: 'PowerShell' }),
    install: {
      fr: 'Installateur : lancez-le et suivez l’assistant (installation pour votre compte, dans %LOCALAPPDATA%\\Programs, sans droit administrateur). Version portable : extrayez l’archive, puis lancez l’exécutable.',
      en: 'Installer: run it and follow the wizard (per-account install in %LOCALAPPDATA%\\Programs, no administrator rights). Portable version: extract the archive, then run the executable.',
    },
    unsigned: {
      fr: 'Fichiers non signés : Windows SmartScreen peut afficher « Windows a protégé votre ordinateur » ; cliquez sur « Informations complémentaires », puis « Exécuter quand même ».',
      en: 'Unsigned files: Windows SmartScreen may show “Windows protected your PC”; click “More info”, then “Run anyway”.',
    },
  },
  linux: {
    label: 'Linux',
    system: { fr: 'Linux 64 bits (x86_64)', en: '64-bit Linux (x86_64)' },
    checksum: (file) => ({ code: `sha256sum ${file}`, shell: 'Terminal' }),
    install: {
      fr: 'Rendez le fichier exécutable (chmod +x <fichier>.AppImage), puis lancez-le. Aucune installation : supprimez le fichier pour désinstaller.',
      en: 'Make the file executable (chmod +x <file>.AppImage), then run it. No installation: delete the file to uninstall.',
    },
    unsigned: {
      fr: 'Fichier non signé : vérifiez l’empreinte SHA-256 avant de le rendre exécutable.',
      en: 'Unsigned file: verify the SHA-256 checksum before making it executable.',
    },
  },
  macos: {
    label: 'macOS',
    system: { fr: 'macOS sur processeur Apple (M1 ou plus récent)', en: 'macOS on Apple silicon (M1 or later)' },
    checksum: (file) => ({ code: `shasum -a 256 ${file}`, shell: 'Terminal' }),
    install: {
      fr: 'Ouvrez l’image disque, puis glissez l’application dans le dossier Applications.',
      en: 'Open the disk image, then drag the application into the Applications folder.',
    },
    unsigned: {
      fr: 'Application non notariée par Apple : au premier lancement, macOS la bloque. Ouvrez Réglages Système > Confidentialité et sécurité, puis cliquez sur « Ouvrir quand même » à côté du nom de l’application.',
      en: 'Application not notarized by Apple: macOS blocks it on first launch. Open System Settings > Privacy & Security, then click “Open Anyway” next to the application name.',
    },
  },
};
export const osOrder: AssetOs[] = ['windows', 'linux', 'macos'];

export const formatBytes = (n: number, language: 'fr' | 'en') =>
  new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 1 }).format(n / (1024 * 1024)) +
  (language === 'fr' ? ' Mo' : ' MB');
