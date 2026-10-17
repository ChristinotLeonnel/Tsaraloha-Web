export const siteConfig = {
  name: 'Tsaraloha Structural Analysis',
  shortName: 'TSA',
  taglineEn: 'Model. Analyze. Understand. Engineer.',
  taglineFr: 'Modéliser. Analyser. Comprendre. Concevoir.',
  descriptionEn: 'Professional desktop structural engineering software powered by OpenCASCADE Technology & OpenSees finite element analysis.',
  descriptionFr: 'Logiciel professionnel de modélisation et d\'analyse structurale propulsé par OpenCASCADE Technology et le moteur d\'éléments finis OpenSees.',
  author: 'Christinot Leonnel Tsaraloha',
  version: '0.1.0-dev',
  urls: {
    github: 'https://github.com/ChristinotLeonnel/Tsaraloha-Web',
    // Code source de TSA et TSALab : dépôts privés, jamais liés. Tickets : dépôt public de diffusion
    // (src/config/products.json, releaseRepo), seul lieu public des versions et des retours.
    issues: 'https://github.com/ChristinotLeonnel/Setup-Livrable/issues',
    newIssue: 'https://github.com/ChristinotLeonnel/Setup-Livrable/issues/new',
    docs: '/docs',
    opensees: 'https://opensees.berkeley.edu/',
    occt: 'https://dev.opencascade.org/',
    qt: 'https://www.qt.io/',
    gmsh: 'https://gmsh.info/',
  },
  techStack: {
    language: 'C++20',
    gui: 'Qt 6 (Widgets)',
    cadKernel: 'OpenCASCADE Technology (AIS/V3d)',
    solver: 'OpenSees FEM Solver',
    buildSystem: 'CMake + Ninja',
    extensionSystem: 'TSALib (Dynamic library loading)',
  },
  disclaimerEn: 'TSA is an engineering software in active development. Calculations and structural verifications must always be supervised and verified by a licensed professional engineer.',
  disclaimerFr: 'TSA est un logiciel d\'ingénierie en développement actif. Les calculs et vérifications réglementaires doivent impérativement être validés par un ingénieur structure qualifié.',
};
