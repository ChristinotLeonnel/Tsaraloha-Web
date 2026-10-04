import { DownloadPlatform } from '../types';

export const systemRequirements = {
  minimum: {
    os: 'Windows 10 (64-bit) / Ubuntu 22.04 LTS (64-bit)',
    cpu: 'Intel Core i5 (4 cores, 2.5 GHz) or AMD Ryzen 5',
    ram: '8 GB DDR4',
    gpu: 'OpenGL 3.3 compatible graphics card with 2 GB VRAM',
    disk: '5 GB free SSD storage',
    display: '1920 × 1080 resolution',
  },
  recommended: {
    os: 'Windows 11 (64-bit) / Ubuntu 24.04 LTS (64-bit)',
    cpu: 'Intel Core i7/i9 (8+ cores) or AMD Ryzen 7/9',
    ram: '16 to 32 GB DDR4/DDR5',
    gpu: 'Dedicated NVIDIA GeForce / Quadro or AMD Radeon with 6+ GB VRAM (OpenGL 4.5+)',
    disk: '15 GB free NVMe SSD storage',
    display: '2560 × 1440 or 4K with multi-monitor support',
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
