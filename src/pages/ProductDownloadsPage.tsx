import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/RouterContext';
import { Card } from '../components/Card';
import { CodeBlock } from '../components/CodeBlock';
import { BrandLogo } from '../components/BrandLogo';
import { SEOHead } from '../components/SEOHead';
import {
  distribution,
  formatBytes,
  latestStable,
  osOrder,
  platforms,
  productById,
  releasesOf,
  type ProductId,
  type Release,
  type ReleaseAsset,
  type ReleaseChannel,
} from '../config/downloads';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  FolderLock,
  HelpCircle,
  Info,
  Layers,
  Monitor,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const channelLabel: Record<ReleaseChannel, { fr: string; en: string; cls: string }> = {
  stable: { fr: 'Version Stable', en: 'Stable Release', cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  prerelease: { fr: 'Préversion', en: 'Pre-release', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  experimental: { fr: 'Expérimental', en: 'Experimental', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' },
};

const ChannelBadge: React.FC<{ channel: ReleaseChannel }> = ({ channel }) => {
  const { language } = useLanguage();
  const c = channelLabel[channel];
  return <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-semibold ${c.cls}`}>{c[language]}</span>;
};

const formatDate = (iso: string, language: 'fr' | 'en') =>
  new Date(iso).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

/** Empreinte SHA-256 avec bouton de copie interactif */
const Checksum: React.FC<{ value: string }> = ({ value }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 min-w-0 break-all font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
        {value}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={language === 'fr' ? 'Copier l’empreinte' : 'Copy checksum'}
        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-tsa-blue-500"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span aria-live="polite">{copied ? (language === 'fr' ? 'Copié' : 'Copied') : language === 'fr' ? 'Copier' : 'Copy'}</span>
      </button>
    </div>
  );
};

const downloadLabel = (asset: ReleaseAsset, version: string, language: 'fr' | 'en') => {
  const size = formatBytes(asset.size, language);
  const fr = language === 'fr';
  switch (asset.format) {
    case 'installer':
      return fr ? `Télécharger l’installateur ${version} (${size})` : `Download installer ${version} (${size})`;
    case 'portable-zip':
      return fr ? `Télécharger le ZIP portable ${version} (${size})` : `Download portable ZIP ${version} (${size})`;
    case 'appimage':
      return fr ? `Télécharger l’AppImage ${version} (${size})` : `Download AppImage ${version} (${size})`;
    case 'dmg':
      return fr ? `Télécharger le DMG ${version} (${size})` : `Download DMG ${version} (${size})`;
  }
};

const AssetBlock: React.FC<{ asset: ReleaseAsset; version: string; primary: boolean }> = ({ asset, version, primary }) => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  return (
    <div className="mb-6 last:mb-0 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-6 gap-y-2.5 text-sm mb-5">
        <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Fichier' : 'File'}</dt>
        <dd className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white break-all font-medium">{asset.name}</dd>
        <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Système' : 'System'}</dt>
        <dd>{platforms[asset.os].system[language]}</dd>
        <dt className="font-semibold text-slate-600 dark:text-slate-400">Format</dt>
        <dd>{distribution.formats[asset.format][language]}</dd>
        <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Taille' : 'Size'}</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{formatBytes(asset.size, language)} ({asset.size.toLocaleString()} {fr ? 'octets' : 'bytes'})</dd>
        <dt className="font-semibold text-slate-600 dark:text-slate-400">SHA-256</dt>
        <dd className="min-w-0"><Checksum value={asset.sha256} /></dd>
      </dl>
      <a
        href={asset.url}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsa-blue-500 ${
          primary
            ? 'bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white shadow-tsa-blue-600/20 transform hover:-translate-y-0.5'
            : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
        }`}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        {downloadLabel(asset, version, language)}
      </a>
    </div>
  );
};

const ReleaseCard: React.FC<{ release: Release; primary: boolean }> = ({ release, primary }) => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  return (
    <Card className="p-6 sm:p-8 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{release.title}</h3>
          <ChannelBadge channel={release.channel} />
        </div>
        <span className="text-sm text-slate-500">
          {fr ? 'Date de publication : ' : 'Published: '}
          <time dateTime={release.publishedAt} className="font-medium text-slate-700 dark:text-slate-300">
            {formatDate(release.publishedAt, language)}
          </time>
        </span>
      </div>

      {osOrder.map((os) => {
        const assets = release.assets.filter((a) => a.os === os);
        return (
          <section key={os} className="mt-6 first-of-type:mt-0" aria-label={platforms[os].label}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">{platforms[os].label}</h4>
            {assets.length ? (
              assets.map((asset) => (
                <AssetBlock key={asset.name} asset={asset} version={release.version} primary={primary && asset === release.assets[0]} />
              ))
            ) : (
              <p className="text-sm text-slate-500 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                {platforms[os].label} : {distribution.inPreparation[language]}.
              </p>
            )}
          </section>
        );
      })}

      {release.notes.trim() && (
        <details className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800" open={primary}>
          <summary className="cursor-pointer text-sm font-semibold text-tsa-blue-700 dark:text-tsa-cyan-400 hover:underline">
            {fr ? 'Notes de publication (nouveautés et détails)' : 'Release notes (new features and details)'}
          </summary>
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {release.notes}
          </div>
        </details>
      )}
    </Card>
  );
};

export const ProductDownloadsPage: React.FC<{ productId: ProductId }> = ({ productId }) => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const product = productById(productId);
  const info = releasesOf(productId);
  const stable = latestStable(productId);
  const others = info.releases.filter((r) => r !== stable);
  const installerAsset = stable?.assets.find((a) => a.format === 'installer' && a.os === 'windows');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const psCommand = installerAsset
    ? `(Get-FileHash -Algorithm SHA256 .\\${installerAsset.name}).Hash.ToLower()`
    : `(Get-FileHash -Algorithm SHA256 .\\TSA-0.1.0-windows-x64-setup.exe).Hash.ToLower()`;

  const copyPowerShell = async () => {
    try {
      await navigator.clipboard.writeText(psCommand);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      setCopiedCmd(false);
    }
  };

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={fr ? `Télécharger ${product.name} — ${product.fullName}` : `Download ${product.name} — ${product.fullName}`}
        description={
          fr
            ? `Téléchargez ${product.fullName} pour Windows : installateur officiel autonome, calcul de structure, vérification SHA-256, documentation et support.`
            : `Download ${product.fullName} for Windows: official standalone installer, structural analysis, SHA-256 integrity, documentation and support.`
        }
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fil d'Ariane */}
        <nav aria-label={fr ? 'Fil d’Ariane' : 'Breadcrumb'} className="text-sm mb-6 flex items-center gap-2 text-slate-500">
          <Link to="/downloads" className="text-tsa-blue-700 dark:text-tsa-cyan-400 hover:underline">
            {fr ? 'Téléchargements' : 'Downloads'}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        {/* HERO PRODUIT (Inspiré d'un centre de téléchargement professionnel type Autodesk) */}
        <div className="p-6 sm:p-10 rounded-2xl border border-tsa-blue-500/30 bg-gradient-to-br from-white via-slate-50 to-tsa-blue-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-tsa-blue-950/40 shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
              <BrandLogo size="lg" surface="auto" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {fr ? `${product.name} — Télécharger le logiciel` : `${product.name} — Download Software`}
                  </h1>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                  {product.fullName}
                </p>
                <p className="text-xs text-tsa-blue-600 dark:text-tsa-cyan-400 mt-0.5">
                  {fr ? 'Éditeur officiel : Tsaraloha Software' : 'Official Publisher: Tsaraloha Software'}
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
              {fr
                ? 'Un logiciel de modélisation 3D et d’analyse des structures destiné aux ingénieurs, aux bureaux d’études et aux chercheurs. Intègre le moteur géométrique OpenCASCADE et le solveur éléments finis OpenSees.'
                : 'A 3D modeling and structural analysis software engineered for civil engineers, design offices, and researchers. Features the OpenCASCADE CAD kernel and the OpenSees finite element solver.'}
            </p>

            {/* Barre de navigation rapide interne */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
              <a href="#download-action" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                {fr ? 'Télécharger' : 'Download'}
              </a>
              <a href="#verification" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                {fr ? 'Vérifier l’intégrité' : 'Verify Integrity'}
              </a>
              <a href="#requirements" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                {fr ? 'Configuration requise' : 'Requirements'}
              </a>
              <a href="#installation-guide" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                {fr ? 'Guide d’installation' : 'Install Guide'}
              </a>
              <Link to="/docs/getting-started/installation" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {fr ? 'Consulter la documentation' : 'Documentation'}
              </Link>
              <Link to="/support" className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {fr ? 'Assistance & Support' : 'Support'}
              </Link>
            </div>

            {/* Action principale de téléchargement */}
            <div id="download-action" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {installerAsset ? (
                <a
                  href={installerAsset.url}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white font-bold text-base shadow-lg shadow-tsa-blue-600/25 transition-all transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsa-blue-500"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  <span>
                    {fr
                      ? `Télécharger ${product.name} pour Windows (${formatBytes(installerAsset.size, language)})`
                      : `Download ${product.name} for Windows (${formatBytes(installerAsset.size, language)})`}
                  </span>
                </a>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                  <Info className="w-5 h-5 shrink-0" />
                  <span>{fr ? 'Préparation de l’installateur en cours.' : 'Installer packaging in progress.'}</span>
                </div>
              )}

              <div className="text-xs text-slate-500 space-y-1">
                <div>{fr ? '• Windows 10 / 11 64 bits (x64)' : '• Windows 10 / 11 64-bit (x64)'}</div>
                <div>{fr ? '• Installateur autonome officiel sans dépendance externe' : '• Standalone official installer with bundled dependencies'}</div>
                <div>{fr ? '• Téléchargement direct HTTPS Cloudflare R2' : '• Direct HTTPS download via Cloudflare R2'}</div>
              </div>
            </div>

            {/* Engagement de distribution directe */}
            <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                {fr
                  ? 'Distribution directe officielle : aucun compte GitHub, aucun abonnement et aucun outil de développement (CMake, Visual Studio) ne sont requis pour installer et exécuter TSA.'
                  : 'Official direct distribution: no GitHub account, no subscription, and no developer toolchain (CMake, Visual Studio) are required to install and run TSA.'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1 : Version Stable et Téléchargements */}
        <section className="mb-12" aria-labelledby="latest">
          <h2 id="latest" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {fr ? 'Version stable actuelle' : 'Current Stable Release'}
          </h2>
          {stable ? (
            <ReleaseCard release={stable} primary />
          ) : (
            <Card className="p-6 sm:p-8">
              <p className="flex gap-2 text-slate-700 dark:text-slate-300">
                <Info className="w-5 h-5 shrink-0 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden="true" />
                <span>
                  {fr
                    ? `Aucune version de ${product.name} n’est encore publiée. Cette page proposera les fichiers en téléchargement direct dès la première publication.`
                    : `No ${product.name} release has been published yet. This page will offer the files as direct downloads as soon as the first release is out.`}
                </span>
              </p>
            </Card>
          )}
        </section>

        {/* SECTION 2 : Vérification de l'intégrité SHA-256 & Sécurité */}
        <section id="verification" className="mb-12 scroll-mt-6" aria-labelledby="verification-heading">
          <h2 id="verification-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-tsa-blue-600 dark:text-tsa-cyan-400" />
            <span>{fr ? 'Vérifier l’intégrité du téléchargement (SHA-256)' : 'Verify Download Integrity (SHA-256)'}</span>
          </h2>

          <Card className="p-6 sm:p-8">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              {fr
                ? 'L’empreinte cryptographique SHA-256 permet de vérifier que le fichier téléchargé sur votre poste n’a subi aucune altération, corruption réseau ou modification accidentelle pendant le transfert.'
                : 'The cryptographic SHA-256 checksum guarantees that the file downloaded on your system suffered no corruption, packet loss or unauthorized tampering during transmission.'}
            </p>

            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {fr ? 'Empreinte SHA-256 officielle :' : 'Official SHA-256 Checksum:'}
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all font-semibold">
                {installerAsset?.sha256 ?? '81036c519627198715ee415c8528f579528fab8feadd9e81742805d5d2840e31'}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {fr ? 'Commande de vérification PowerShell :' : 'PowerShell Verification Command:'}
                </span>
                <button
                  type="button"
                  onClick={copyPowerShell}
                  className="inline-flex items-center gap-1 text-xs text-tsa-blue-600 dark:text-tsa-cyan-400 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCmd ? (fr ? 'Copié !' : 'Copied!') : fr ? 'Copier la commande' : 'Copy command'}</span>
                </button>
              </div>
              <CodeBlock code={psCommand} language="powershell" filename="PowerShell" />
            </div>

            {/* Note sur la signature Authenticode */}
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{fr ? 'Avertissement Windows SmartScreen (Signature Authenticode)' : 'Windows SmartScreen Notice (Authenticode Signature)'}</span>
              </div>
              <p className="leading-relaxed">
                {fr
                  ? 'Le calcul SHA-256 ci-dessus détecte toute altération accidentelle. En l’absence d’un certificat numérique payant Microsoft Authenticode (EV), Windows SmartScreen peut afficher « Windows a protégé votre ordinateur ». Il s’agit d’un comportement normal pour les logiciels d’ingénierie indépendants : cliquez sur « Informations complémentaires » puis « Exécuter quand même » après avoir validé le SHA-256.'
                  : 'The SHA-256 hash above confirms binary integrity. Without a costly Microsoft Authenticode (EV) certificate, Windows SmartScreen may show “Windows protected your PC”. This is standard for independent engineering tools: click “More info” then “Run anyway” once you verify the SHA-256 hash.'}
              </p>
            </div>
          </Card>
        </section>

        {/* SECTION 3 : Matrice de Configuration Système */}
        <section id="requirements" className="mb-12 scroll-mt-6" aria-labelledby="requirements-heading">
          <h2 id="requirements-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-tsa-blue-600 dark:text-tsa-cyan-400" />
            <span>{fr ? 'Configuration système requise' : 'System Requirements'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Configuration Minimale */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <Monitor className="w-5 h-5 text-slate-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {fr ? 'Configuration Minimale' : 'Minimum Configuration'}
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Système :</strong> Windows 10 (version 21H2+) 64 bits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Processeur :</strong> x86-64 avec 2 cœurs (Intel Core i5 / AMD Ryzen 3)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Mémoire vive :</strong> 8 Go de RAM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Carte graphique :</strong> GPU compatible OpenGL 3.3 ou supérieur</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Espace disque :</strong> 300 Mo disponible (installation de base)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Écran :</strong> 1366 × 768 pixels</span>
                </li>
              </ul>
            </Card>

            {/* Configuration Recommandée */}
            <Card className="p-6 border-tsa-blue-500/40 bg-tsa-blue-50/10 dark:bg-tsa-blue-950/20">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tsa-blue-500/20">
                <Sparkles className="w-5 h-5 text-tsa-blue-600 dark:text-tsa-cyan-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {fr ? 'Configuration Recommandée (Production)' : 'Recommended (Production)'}
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Système :</strong> Windows 11 64 bits (dernière édition)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Processeur :</strong> 4 cœurs ou plus (Intel Core i7/i9 ou AMD Ryzen 7/9)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Mémoire vive :</strong> 16 Go à 32 Go (pour calculs non-linéaires et maillages volumiques)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Carte graphique :</strong> NVIDIA GeForce RTX / Quadro ou AMD Radeon dédiée avec 4 Go+ VRAM</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Espace disque :</strong> 600 Mo sur disque SSD NVMe rapide</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Écran :</strong> 1920 × 1080 (Full HD) ou 4K avec mise à l’échelle HiDPI</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Dépendances et bibliothèques embarquées */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-tsa-blue-600 dark:text-tsa-cyan-400" />
              <span>{fr ? 'Composants et moteurs inclus dans l’installateur' : 'Included Engines & Components'}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              {fr
                ? 'L’installateur TSA est entièrement autonome : il déploie directement l’ensemble des bibliothèques d’ingénierie et de rendu nécessaires à l’exécution du logiciel sur un Windows propre.'
                : 'The TSA installer is fully self-contained: it deploys all required engineering and rendering libraries for execution on a clean Windows machine.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Qt 6.11</div>
                <div className="text-slate-500">Interface ruban, widgets 3D</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">OpenCASCADE 8.0.1</div>
                <div className="text-slate-500">Noyau géométrique volumique B-Rep</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">OpenSees 3.8.0</div>
                <div className="text-slate-500">Solveur éléments finis de structure</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Gmsh 4.15.2</div>
                <div className="text-slate-500">Mailleur automatique 1D, 2D, 3D</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">IfcOpenShell 0.9.0</div>
                <div className="text-slate-500">Interopérabilité BIM IFC 2x3/4</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Shell Thumbnail</div>
                <div className="text-slate-500">Aperçu .tsa dans l’explorateur</div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 4 : Guide d'Installation Étape par Étape */}
        <section id="installation-guide" className="mb-12 scroll-mt-6" aria-labelledby="guide-heading">
          <h2 id="guide-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-tsa-blue-600 dark:text-tsa-cyan-400" />
            <span>{fr ? 'Instructions d’installation étape par étape' : 'Step-by-Step Installation Guide'}</span>
          </h2>

          <Card className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Étape 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tsa-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {fr ? 'Télécharger l’installateur officiel' : 'Download the official installer'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {fr
                      ? 'Cliquez sur le bouton de téléchargement ci-dessus pour obtenir le package autonome TSA-0.1.0-windows-x64-setup.exe.'
                      : 'Click the download button above to get the standalone TSA-0.1.0-windows-x64-setup.exe package.'}
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tsa-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {fr ? 'Vérifier l’intégrité (recommandé)' : 'Verify checksum (recommended)'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {fr
                      ? 'Ouvrez un terminal PowerShell dans le dossier des téléchargements et exécutez la commande Get-FileHash pour vous assurer que le SHA-256 concorde parfaitement.'
                      : 'Open a PowerShell terminal in your downloads folder and execute Get-FileHash to ensure the SHA-256 matches perfectly.'}
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tsa-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {fr ? 'Lancer l’assistant d’installation Tsaraloha Software' : 'Run the Tsaraloha Software Setup Wizard'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {fr
                      ? 'Double-cliquez sur l’exécutable. L’assistant ergonomique vous accueille avec le logo et les couleurs officielles de TSA. Prenez connaissance de la licence d’utilisation.'
                      : 'Double-click the executable. The wizard welcomes you with official TSA branding. Review and accept the licensing terms.'}
                  </p>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tsa-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {fr ? 'Sélectionner le répertoire de destination' : 'Select destination folder'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {fr
                      ? 'Par défaut : C:\\Program Files\\Tsaraloha Software\\TSA (ou votre profil utilisateur %LOCALAPPDATA% si vous l’installez sans droits administrateur).'
                      : 'Default: C:\\Program Files\\Tsaraloha Software\\TSA (or your user profile %LOCALAPPDATA% if installing without administrative rights).'}
                  </p>
                </div>
              </div>

              {/* Étape 5 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tsa-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {fr ? 'Démarrer TSA et ouvrir vos projets' : 'Launch TSA and start modeling'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {fr
                      ? 'Les raccourcis Bureau et Menu Démarrer sont créés, ainsi que l’association des projets .tsa. Cliquez sur « Lancer TSA » pour commencer immédiatement.'
                      : 'Desktop and Start Menu shortcuts are created, and .tsa project files are associated. Click “Launch TSA” to start immediately.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Préservation des données utilisateur */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700">
                <FolderLock className="w-5 h-5 text-tsa-blue-600 dark:text-tsa-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {fr ? 'Garantie de préservation de vos projets et réglages' : 'Project and Settings Preservation Guarantee'}
                  </div>
                  <p>
                    {fr
                      ? `Lors d’une mise à jour vers une version plus récente ou d’une désinstallation de TSA, vos modèles (.tsa), vos notes de calcul PDF et vos préférences enregistrées dans ${product.dataDir} ne sont JAMAIS supprimés ni altérés.`
                      : `During software updates or uninstallation, your structural projects (.tsa), calculation notes and user preferences located in ${product.dataDir} are NEVER deleted or overwritten.`}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 5 : Autres versions si disponibles */}
        {others.length > 0 && (
          <section className="mb-12" aria-labelledby="other-releases">
            <h2 id="other-releases" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {fr ? 'Versions antérieures' : 'Previous Releases'}
            </h2>
            <div className="space-y-6">
              {others.map((r) => (
                <ReleaseCard key={r.tag} release={r} primary={false} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6 : Licence & Droits d'usage */}
        <section id="license" className="mb-12 scroll-mt-6" aria-labelledby="license-heading">
          <h2 id="license-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {fr ? 'Licence & Droits d’usage' : 'License & Terms of Use'}
          </h2>
          <Card className="p-6 sm:p-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="mb-4">
              {fr
                ? `Le code source de ${product.name} est sous licence MIT (LICENSE.txt, installé dans le répertoire du logiciel). Les bibliothèques redistribuées conservent leurs licences respectives :`
                : `${product.name} source code is published under the MIT license (LICENSE.txt installed in the application directory). Redistributed libraries maintain their respective licenses:`}
            </p>
            <ul className="space-y-2 mb-4 pl-5 list-disc text-xs sm:text-sm">
              <li><strong>Qt 6.11 :</strong> Licence GNU LGPL v3.</li>
              <li><strong>OpenCASCADE 8.0.1 :</strong> Licence GNU LGPL 2.1 avec exception OpenCASCADE.</li>
              <li><strong>Gmsh 4.15.2 :</strong> Licence GNU GPL v2+ (sources de distribution disponibles).</li>
              <li><strong>OpenSees 3.8.0 :</strong> Utilisation libre pour éducation, recherche et usage non lucratif.</li>
              <li><strong>Runtime Visual C++ :</strong> Composants redistribuables Microsoft officiels.</li>
            </ul>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <Link to="/licensing" className="text-tsa-blue-600 dark:text-tsa-cyan-400 font-semibold hover:underline">
                {fr ? 'Consulter le détail complet des licences →' : 'Read full licensing terms →'}
              </Link>
              <a
                href={`https://github.com/${product.sourceRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline"
              >
                {fr ? 'Accéder au code source (MIT)' : 'View source code (MIT)'}
              </a>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};
