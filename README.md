# Tsaraloha Structural Analysis (TSA) — Official Website

> **Official public website and documentation portal for Tsaraloha Structural Analysis (TSA)** — an advanced civil engineering desktop software for 3D structural modeling, OpenSees finite element analysis, and structural BIM.

[![GitHub Pages Deployment](https://github.com/ChristinotLeonnel/Tsaraloha-Web/actions/workflows/deploy.yml/badge.svg)](https://github.com/ChristinotLeonnel/Tsaraloha-Web/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/badge/TSA%20Version-0.1.0--dev-0072FF.svg)](https://github.com/ChristinotLeonnel/Tsaraloha-Structural-Analysis)
[![License: MIT](https://img.shields.io/badge/License-MIT-00F2FE.svg)](./LICENSES.md)

---

## 1. Overview & Architecture

This website serves as the official public portal for **TSA (Tsaraloha Structural Analysis)**. It is engineered with modern web standards, scientific accuracy, and an engineering aesthetic inspired by leading CAD/FEM software.

### Key Capabilities
- **Interactive 3D Viewport Simulator**: Canvas-based interactive portal frame simulation allowing live toggling of undeformed geometry, deformed shape $\{U\}$, bending moment diagrams ($M_y$), axial force tension/compression ($N$), and dynamic modal vibration.
- **Finite Element Pipeline Explorer**: Step-by-step walkthrough of the structural modeling to OpenSees solver translation.
- **Complete Module Catalog**: Full list of 3D modeling, CAD manipulation, finite element meshing, and result extraction features labeled with real-time status badges (`AVAILABLE`, `BETA`, `IN_DEVELOPMENT`, `PLANNED`).
- **Co-Engineering AI Showcase**: Demonstration of how AI acts as an engineering co-pilot without compromising human engineering responsibility.
- **Multilingual (i18n)**: Instant switching between **Français** and **English** with persistent user preference.
- **Adaptive Dark / Light / System Mode**: Deep engineering dark theme (`#060913`, `#0A101D`) and high-contrast drafting light theme.
- **Static Hosting Optimized**: 100% compatible with GitHub Pages, zero server cost, zero database dependencies, and ready for custom domain binding.

---

## 2. Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with custom engineering color palette and CAD grid patterns
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [GitHub Actions](https://github.com/features/actions) + [GitHub Pages](https://pages.github.com/)

---

## 3. Directory Structure

```text
TSA Web/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions build & deploy to Pages
├── public/
│   ├── assets/
│   │   ├── branding/             # Official TSA SVGs, PNGs, and ICOs
│   │   └── icons/                # Genuine structural/CAD action icons
│   ├── 404.html                  # SPA client-side routing fallback for GitHub Pages
│   ├── favicon.svg               # Official TSA vector favicon
│   ├── robots.txt                # Search engine crawler configuration
│   └── sitemap.xml               # SEO sitemap
├── src/
│   ├── components/               # Reusable engineering design system components
│   │   ├── Badge.tsx             # Status badges (Available, Beta, In Dev, Planned)
│   │   ├── Button.tsx            # Variant buttons (Primary, Glow, Secondary, Outline)
│   │   ├── Card.tsx              # Glassmorphism cards with border glow
│   │   ├── CodeBlock.tsx         # Code snippets with syntax highlighting and copy
│   │   ├── EngineeringWorkflow.tsx # Interactive 5-step computational pipeline
│   │   ├── Footer.tsx            # Footer with legal attributions and links
│   │   ├── GithubIcon.tsx        # Vector SVG GitHub icon
│   │   ├── InteractiveViewport.tsx # 3D structural frame simulation canvas
│   │   ├── Navbar.tsx            # Responsive navigation header with FR/EN & theme toggles
│   │   ├── SEOHead.tsx           # Dynamic page title and meta description manager
│   │   └── Tabs.tsx              # Tab switcher controls
│   ├── config/                   # Centralized configurable data files
│   │   ├── changelog.ts          # Release versions and change logs
│   │   ├── docs.ts               # Structured documentation articles
│   │   ├── downloads.ts          # Operating systems, source code, and prerequisites
│   │   ├── features.ts           # Classified engineering features with badges
│   │   ├── pricing.ts            # Pricing tiers (Community, Pro, Enterprise)
│   │   ├── roadmap.ts            # Completed, In Dev, Planned, and Research milestones
│   │   └── site.ts               # Global metadata, URLs, and legal notices
│   ├── i18n/                     # Internationalization subsystem
│   │   ├── translations/
│   │   │   ├── en.ts             # Complete English translation dictionary
│   │   │   └── fr.ts             # Complete French translation dictionary
│   │   └── LanguageContext.tsx   # React context provider for active language
│   ├── pages/                    # Application views
│   │   ├── AboutPage.tsx         # Vision, creator info, and contact form
│   │   ├── AnalysisPage.tsx      # OpenSees solver integration & code generator
│   │   ├── BimPage.tsx           # Structural BIM positioning & WorkPlanes
│   │   ├── ChangelogPage.tsx     # Version history
│   │   ├── CoEngineeringPage.tsx # AI co-pilot philosophy & interactive simulator
│   │   ├── DocsPage.tsx          # Technical documentation and guides
│   │   ├── DownloadsPage.tsx     # Binaries, releases, and source build instructions
│   │   ├── FeaturesPage.tsx      # Filterable and searchable features catalog
│   │   ├── Home.tsx              # Landing page with hero, 3D viewport, and highlights
│   │   ├── LicensingPage.tsx     # TSA and third-party software licenses
│   │   ├── NotFoundPage.tsx      # 404 handler
│   │   ├── PricingPage.tsx       # Tiers, matrices, and disclaimer
│   │   └── RoadmapPage.tsx       # Development roadmap
│   ├── router/                   # Lightweight SPA router supporting GitHub Pages subpaths
│   │   └── RouterContext.tsx
│   ├── styles/
│   │   └── index.css             # Tailwind base and custom CAD grid patterns
│   ├── theme/                    # Light / Dark / System theme management
│   │   └── ThemeContext.tsx
│   ├── types/                    # TypeScript interfaces and data definitions
│   │   └── index.ts
│   ├── App.tsx                   # Main component tree
│   └── main.tsx                  # Application bootstrap entry point
├── LICENSES.md                   # Complete third-party licenses and legal attributions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Getting Started Locally

### Prerequisites
- **Node.js**: v18.0+ or v20.0+ (Tested with Node v24.21.0)
- **npm**: v9.0+ or v11.0+

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/ChristinotLeonnel/Tsaraloha-Web.git
cd Tsaraloha-Web
npm install
```

### Development Server
Launch Vite's hot-reloading development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### Production Build
Compile TypeScript and bundle the static distribution:

```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

### Preview Production Build
Locally preview the built static site:

```bash
npm run preview
```

---

## 5. Deployment to GitHub Pages

The repository contains an automated GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Automated Setup
1. Push your commits to the `main` branch:
   ```bash
   git push origin main
   ```
2. In your GitHub repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The workflow will automatically:
   - Check out the repository.
   - Install dependencies.
   - Build the static bundle (`npm run build`).
   - Publish to GitHub Pages at:
     **`https://christinotleonnel.github.io/Tsaraloha-Web/`**

### Custom Domain Support
To configure a custom domain (e.g., `tsaraloha.org`):
1. In GitHub repository **Settings** > **Pages** > **Custom domain**, enter your domain name.
2. In [`vite.config.ts`](vite.config.ts), set `base: '/'` or configure the `VITE_BASE_PATH` environment variable.

---

## 6. Configurable Data & Editing Content

All technical content and editions are separated from presentation code:
- **Pricing & Editions**: Edit [`src/config/pricing.ts`](src/config/pricing.ts) to adjust tier descriptions, features, or announce pricing.
- **Features & Badges**: Edit [`src/config/features.ts`](src/config/features.ts) to add features or update status (`AVAILABLE`, `BETA`, `IN_DEVELOPMENT`, `PLANNED`).
- **Roadmap**: Edit [`src/config/roadmap.ts`](src/config/roadmap.ts) to update development milestones.
- **Downloads & Requirements**: Edit [`src/config/downloads.ts`](src/config/downloads.ts) to update releases and hardware requirements.
- **Documentation**: Edit [`src/config/docs.ts`](src/config/docs.ts) to add or edit user guides and tutorials.
- **Translations**: Edit [`src/i18n/translations/fr.ts`](src/i18n/translations/fr.ts) and [`src/i18n/translations/en.ts`](src/i18n/translations/en.ts).

---

## 7. Legal & Attributions

- **TSA Software**: © 2026 Christinot Leonnel Tsaraloha.
- **OpenSees**: Open System for Earthquake Engineering Simulation developed by UC Berkeley / PEER Center.
- **OpenCASCADE Technology**: 3D geometric modeling kernel by OPEN CASCADE SAS (LGPL 2.1).
- **Qt Framework**: The Qt Company (LGPLv3).
- See [`LICENSES.md`](LICENSES.md) for full legal text and third-party notices.
