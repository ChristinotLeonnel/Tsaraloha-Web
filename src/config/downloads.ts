import { DownloadPlatform } from '../types';

// Configuration requise, traduite (fr / en).
type Localized = { fr: string; en: string };
type Requirements = Record<'os' | 'cpu' | 'ram' | 'gpu' | 'disk' | 'display', Localized>;

export const systemRequirements: { minimum: Requirements; recommended: Requirements } = {
  minimum: {
    os: { fr: 'Windows 10 (64 bits)', en: 'Windows 10 (64-bit)' },
    cpu: { fr: 'Intel Core i5 (4 cœurs, 2,5 GHz) ou AMD Ryzen 5', en: 'Intel Core i5 (4 cores, 2.5 GHz) or AMD Ryzen 5' },
    ram: { fr: '8 Go DDR4', en: '8 GB DDR4' },
    gpu: { fr: 'Carte graphique compatible OpenGL 3.3, 2 Go de mémoire vidéo', en: 'OpenGL 3.3 compatible graphics card with 2 GB VRAM' },
    disk: { fr: '5 Go libres sur SSD', en: '5 GB free SSD storage' },
    display: { fr: 'Résolution 1920 × 1080', en: '1920 × 1080 resolution' },
  },
  recommended: {
    os: { fr: 'Windows 11 (64 bits)', en: 'Windows 11 (64-bit)' },
    cpu: { fr: 'Intel Core i7/i9 (8 cœurs ou plus) ou AMD Ryzen 7/9', en: 'Intel Core i7/i9 (8+ cores) or AMD Ryzen 7/9' },
    ram: { fr: '16 à 32 Go DDR4/DDR5', en: '16 to 32 GB DDR4/DDR5' },
    gpu: {
      fr: 'Carte NVIDIA GeForce / Quadro ou AMD Radeon dédiée, 6 Go de mémoire vidéo ou plus (OpenGL 4.5+)',
      en: 'Dedicated NVIDIA GeForce / Quadro or AMD Radeon with 6+ GB VRAM (OpenGL 4.5+)',
    },
    disk: { fr: '15 Go libres sur SSD NVMe', en: '15 GB free NVMe SSD storage' },
    display: { fr: '2560 × 1440 ou 4K, plusieurs écrans possibles', en: '2560 × 1440 or 4K with multi-monitor support' },
  },
};

export const downloadPlatforms: DownloadPlatform[] = [
  {
    id: 'windows',
    name: 'Windows',
    os: 'windows',
    statusEn: 'Coming Soon — In Active Development',
    statusFr: 'Bientôt disponible — En développement actif',
    badgeEn: 'Primary Development Platform',
    badgeFr: 'Plateforme Principale',
    version: 'v0.1.0-dev',
    architecture: 'x86_64 (64-bit)',
    githubReleaseUrl: 'https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis/releases',
    requirementsEn: [
      'Windows 10 / 11 64-bit',
      'Microsoft Visual C++ 2022 Redistributable (x64)',
      'DirectX 11 / OpenGL 3.3+',
    ],
    requirementsFr: [
      'Windows 10 / 11 64 bits',
      'Microsoft Visual C++ 2022 Redistributable (x64)',
      'Support DirectX 11 / OpenGL 3.3+',
    ],
  },
  {
    id: 'linux',
    name: 'Linux',
    os: 'linux',
    statusEn: 'Coming Soon — Planned',
    statusFr: 'Bientôt disponible — Prévu',
    badgeEn: 'Secondary Platform',
    badgeFr: 'Plateforme Secondaire',
    version: 'v0.1.0-dev',
    architecture: 'x86_64 (AppImage / Flatpak)',
    githubReleaseUrl: 'https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis/releases',
    requirementsEn: [
      'Ubuntu 22.04+, Debian 12+, Fedora 38+',
      'Mesa OpenGL 3.3+ drivers',
      'Qt 6 runtime libraries',
    ],
    requirementsFr: [
      'Ubuntu 22.04+, Debian 12+, Fedora 38+',
      'Pilotes Mesa OpenGL 3.3+',
      'Bibliothèques d\'exécution Qt 6',
    ],
  },
  {
    id: 'source',
    name: 'Source Code',
    os: 'source',
    statusEn: 'Available on GitHub for Developers',
    statusFr: 'Disponible sur GitHub pour Développeurs',
    badgeEn: 'C++20 / CMake / Ninja',
    badgeFr: 'C++20 / CMake / Ninja',
    version: 'main branch',
    architecture: 'Universal Source',
    githubReleaseUrl: 'https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis',
    commandSnippet: `git clone https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis.git
cd Tsaraloha-Structural-Analysis
cmake --preset ninja-debug
cmake --build --preset ninja-debug`,
    requirementsEn: [
      'Git and CMake 3.25+',
      'MSVC v143 (Visual Studio 2022+) or GCC 13+ / Clang 16+',
      'Ninja build generator',
      'OpenCASCADE Technology 7.7+ & Qt 6.5+',
    ],
    requirementsFr: [
      'Git et CMake 3.25+',
      'MSVC v143 (Visual Studio 2022+) ou GCC 13+ / Clang 16+',
      'Générateur de build Ninja',
      'OpenCASCADE Technology 7.7+ & Qt 6.5+',
    ],
  },
];
