import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/RouterContext';
import { Card } from '../components/Card';
import { CodeBlock } from '../components/CodeBlock';
import { SEOHead } from '../components/SEOHead';
import {
  distribution,
  formatBytes,
  latestStable,
  productById,
  releasesOf,
  type ProductId,
  type Release,
  type ReleaseChannel,
} from '../config/downloads';
import { AlertTriangle, CheckCircle2, Copy, Download, Info, ShieldCheck } from 'lucide-react';

const channelLabel: Record<ReleaseChannel, { fr: string; en: string; cls: string }> = {
  stable: { fr: 'Stable', en: 'Stable', cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  prerelease: { fr: 'Préversion', en: 'Pre-release', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  experimental: { fr: 'Expérimental', en: 'Experimental', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' },
};

const ChannelBadge: React.FC<{ channel: ReleaseChannel }> = ({ channel }) => {
  const { language } = useLanguage();
  const c = channelLabel[channel];
  return <span className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${c.cls}`}>{c[language]}</span>;
};

const formatDate = (iso: string, language: 'fr' | 'en') =>
  new Date(iso).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

/** Empreinte en entier (police à chasse fixe, coupure autorisée) avec copie dans le presse-papiers. */
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
    <div className="flex items-start gap-2">
      <code className="flex-1 min-w-0 break-all font-mono text-xs text-slate-700 dark:text-slate-300">{value}</code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tsa-blue-500"
      >
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
        <span aria-live="polite">{copied ? (language === 'fr' ? 'Copiée' : 'Copied') : language === 'fr' ? 'Copier' : 'Copy'}</span>
      </button>
    </div>
  );
};

const ReleaseCard: React.FC<{ release: Release; primary: boolean }> = ({ release, primary }) => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  return (
    <Card className="p-6 sm:p-8 min-w-0">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {release.title}
        </h3>
        <ChannelBadge channel={release.channel} />
        <span className="text-sm text-slate-500">
          {fr ? 'Publiée le ' : 'Published '}
          <time dateTime={release.publishedAt}>{formatDate(release.publishedAt, language)}</time>
        </span>
      </div>
      {release.assets.map((asset, index) => (
        <div key={asset.name} className="mb-6 last:mb-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {asset.format === 'installer' ? (fr ? 'Installateur (recommandé)' : 'Installer (recommended)') : fr ? 'Version portable' : 'Portable version'}
          </h4>
          <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm mb-4">
            <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Fichier' : 'File'}</dt>
            <dd className="font-mono break-all">{asset.name}</dd>
            <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Système' : 'System'}</dt>
            <dd>{distribution.os[language]}</dd>
            <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Format' : 'Format'}</dt>
            <dd>{distribution.formats[asset.format][language]}</dd>
            <dt className="font-semibold text-slate-600 dark:text-slate-400">{fr ? 'Taille' : 'Size'}</dt>
            <dd>{formatBytes(asset.size, language)}</dd>
            <dt className="font-semibold text-slate-600 dark:text-slate-400">SHA-256</dt>
            <dd className="min-w-0"><Checksum value={asset.sha256} /></dd>
          </dl>
          <a
            href={asset.url}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsa-blue-500 ${
              primary && index === 0
                ? 'bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white'
                : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {asset.format === 'installer'
              ? fr ? `Télécharger l’installateur ${release.version} (${formatBytes(asset.size, language)})` : `Download installer ${release.version} (${formatBytes(asset.size, language)})`
              : fr ? `Télécharger le ZIP portable ${release.version} (${formatBytes(asset.size, language)})` : `Download portable ZIP ${release.version} (${formatBytes(asset.size, language)})`}
          </a>
        </div>
      ))}
      {release.notes.trim() && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold text-tsa-blue-700 dark:text-tsa-cyan-400">
            {fr ? 'Notes de publication (nouveautés, corrections, problèmes connus)' : 'Release notes (new, fixed, known issues)'}
          </summary>
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{release.notes}</div>
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
  const exampleFile = stable?.assets[0]?.name ?? `${product.name}-<version>-windows-x64-setup.exe`;

  return (
    <div className="w-full py-12 lg:py-16">
      <SEOHead
        title={fr ? `Télécharger ${product.name}` : `Download ${product.name}`}
        description={
          fr
            ? `Versions officielles de ${product.fullName} pour Windows x64 : archive portable, empreinte SHA-256, notes de publication.`
            : `Official ${product.fullName} builds for Windows x64: portable archive, SHA-256 checksum, release notes.`
        }
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label={fr ? 'Fil d’Ariane' : 'Breadcrumb'} className="text-sm mb-4">
          <Link to="/downloads" className="text-tsa-blue-700 dark:text-tsa-cyan-400 hover:underline">
            {fr ? 'Téléchargements' : 'Downloads'}
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{product.name}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {fr ? `Télécharger ${product.name}` : `Download ${product.name}`}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{product.fullName}</p>

        {info.stale && (
          <p role="status" className="mt-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-sm text-amber-800 dark:text-amber-200 flex gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            {fr
              ? `La liste des versions n’a pas pu être actualisée lors de la dernière construction du site${info.checkedAt ? ` (dernière lecture réussie : ${formatDate(info.checkedAt, language)})` : ''}. Consultez le dépôt pour confirmer la dernière version.`
              : `The release list could not be refreshed during the last site build${info.checkedAt ? ` (last successful read: ${formatDate(info.checkedAt, language)})` : ''}. Check the repository to confirm the latest version.`}
          </p>
        )}

        <section className="mt-10" aria-labelledby="latest">
          <h2 id="latest" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {fr ? 'Dernière version stable' : 'Latest stable release'}
          </h2>
          {stable ? (
            <ReleaseCard release={stable} primary />
          ) : (
            <Card className="p-6 sm:p-8">
              <p className="flex gap-2 text-slate-700 dark:text-slate-300">
                <Info className="w-5 h-5 shrink-0 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden="true" />
                <span>
                  {info.releases.length
                    ? fr
                      ? `Aucune version stable de ${product.name} n’est publiée. Les préversions ci-dessous servent aux essais et peuvent contenir des défauts.`
                      : `No stable ${product.name} release is published. The pre-releases below are for testing and may contain defects.`
                    : fr
                      ? `Aucune version de ${product.name} n’est encore publiée. Cette page proposera l’installateur et la version portable, en téléchargement direct, dès la première publication.`
                      : `No ${product.name} release has been published yet. This page will offer the installer and the portable version, as direct downloads, as soon as the first release is out.`}
                </span>
              </p>
            </Card>
          )}
        </section>

        {others.length > 0 && (
          <section className="mt-10" aria-labelledby="other-releases">
            <h2 id="other-releases" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {fr ? 'Autres versions' : 'Other releases'}
            </h2>
            <div className="space-y-6">
              {others.map((r) => (
                <ReleaseCard key={r.tag} release={r} primary={false} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10" aria-labelledby="requirements">
          <h2 id="requirements" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {fr ? 'Configuration et prérequis' : 'Requirements'}
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {[distribution.os, distribution.formats.installer, distribution.formats['portable-zip'], distribution.bundled, distribution.graphics].map((item) => (
              <li key={item.fr} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" aria-hidden="true" />
                <span>{item[language]}</span>
              </li>
            ))}
            {[distribution.notMeasured, distribution.linux].map((item) => (
              <li key={item.fr} className="flex gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" aria-hidden="true" />
                <span>{item[language]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="install">
          <h2 id="install" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {fr ? 'Vérifier et installer' : 'Verify and install'}
          </h2>
          <p className="flex gap-2 p-4 mb-4 rounded-lg border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-5 h-5 shrink-0 text-tsa-blue-600 dark:text-tsa-cyan-400" aria-hidden="true" />
            {distribution.unsigned[language]}
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-4">
            <li>{fr ? 'Téléchargez l’archive, puis ouvrez PowerShell dans le dossier de téléchargement.' : 'Download the archive, then open PowerShell in the download folder.'}</li>
            <li>{fr ? 'Calculez son empreinte et comparez-la, caractère par caractère, à celle affichée sur cette page :' : 'Compute its checksum and compare it, character by character, with the one shown on this page:'}</li>
          </ol>
          <CodeBlock code={`(Get-FileHash -Algorithm SHA256 .\\${exampleFile}).Hash.ToLower()`} language="powershell" filename="PowerShell" />
          <ol start={3} className="list-decimal pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-300 mt-4">
            <li>{fr ? 'Si les empreintes diffèrent, supprimez le fichier : il est incomplet ou modifié.' : 'If the checksums differ, delete the file: it is incomplete or altered.'}</li>
            <li>
              {fr
                ? `Installateur : lancez-le et suivez l’assistant. ${product.name} s’installe pour votre compte dans %LOCALAPPDATA%\\Programs\\${product.name}, sans droit administrateur, avec un raccourci dans le menu Démarrer et l’ouverture des fichiers par double-clic.`
                : `Installer: run it and follow the wizard. ${product.name} installs for your account in %LOCALAPPDATA%\\Programs\\${product.name}, without administrator rights, with a Start menu shortcut and double-click file opening.`}
            </li>
            <li>
              {fr
                ? `Version portable : extrayez l’archive dans un dossier de votre choix, puis lancez ${product.name}.exe.`
                : `Portable version: extract the archive to a folder of your choice, then run ${product.name}.exe.`}
            </li>
            <li>
              {fr
                ? `Mise à jour : lancez l’installateur de la nouvelle version, qui remplace l’ancienne. Vos réglages (raccourcis, modules, journaux) sont dans ${product.dataDir} et ne sont jamais écrasés ; vos projets restent là où vous les avez enregistrés.`
                : `Update: run the new version’s installer, which replaces the old one. Your settings (shortcuts, modules, logs) live in ${product.dataDir} and are never overwritten; your projects stay where you saved them.`}
            </li>
            <li>
              {fr
                ? `Désinstallation : Paramètres > Applications > ${product.name} > Désinstaller (ou supprimez le dossier de la version portable). Pour effacer aussi vos réglages, supprimez ${product.dataDir}.`
                : `Uninstall: Settings > Apps > ${product.name} > Uninstall (or delete the portable folder). To erase your settings too, delete ${product.dataDir}.`}
            </li>
          </ol>
        </section>

        <section className="mt-10" aria-labelledby="license">
          <h2 id="license" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{fr ? 'Licence' : 'License'}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {fr
              ? `${product.name} est distribué sous licence MIT (fichier LICENSE.txt, installé avec le logiciel). Les composants tiers livrés (Qt, OpenCASCADE, OpenSees, runtime Visual C++) gardent leurs propres licences, copiées dans le dossier licenses ; OpenSees n’est utilisable sans accord qu’à des fins éducatives, de recherche ou non lucratives. Le maillage (Gmsh) n’est pas inclus dans les versions publiques. `
              : `${product.name} is distributed under the MIT license (LICENSE.txt, installed with the software). Bundled third-party components (Qt, OpenCASCADE, OpenSees, Visual C++ runtime) keep their own licenses, copied into the licenses folder; OpenSees may be used without an agreement only for educational, research or non-profit purposes. Meshing (Gmsh) is not included in public builds. `}
            <Link to="/licensing" className="text-tsa-blue-700 dark:text-tsa-cyan-400 underline">
              {fr ? 'Détail des licences' : 'License details'}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
