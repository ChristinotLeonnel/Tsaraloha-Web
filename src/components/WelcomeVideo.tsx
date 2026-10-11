import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const base = import.meta.env.BASE_URL;
const video = (f: string) => `${base}video/${f}`;

// Transcription des sous-titres (identique aux fichiers WebVTT de public/video, produits par scripts/make-welcome-video.py).
const transcript = {
  fr: [
    'TSA — analyse et calcul de structures.',
    'Modélisation 3D : poteaux, poutres, dalles, voiles, semelles et escaliers.',
    'Matériaux et rendu : béton coffré, acier peint, galvanisé ; modes texturé, ombré, filaire et léger.',
    'Pont à haubans 80 + 180 + 80 m : pylônes en H, 64 haubans, tablier métallique.',
    'Calcul OpenSees réel : déformée amplifiée, contraintes normales, efforts dans les haubans.',
    'Notes de calcul PDF simplifiée et détaillée, produites à partir des résultats réels.',
    'Modéliser, calculer, justifier — avec TSA.',
  ],
  en: [
    'TSA — structural analysis and design.',
    '3D modeling: columns, beams, slabs, walls, footings and stairs.',
    'Materials and rendering: formed concrete, painted and galvanized steel; textured, shaded, wireframe and light modes.',
    'Cable-stayed bridge 80 + 180 + 80 m: H pylons, 64 stay cables, steel deck.',
    'Real OpenSees analysis: amplified deformed shape, normal stresses, stay cable forces.',
    'Simplified and detailed PDF design reports, built from the actual results.',
    'Model, analyse, justify — with TSA.',
  ],
};

/**
 * Vidéo de présentation (40 s, muette, sous-titrée) assemblée à partir de captures réelles de TSA, du logo officiel et de
 * pages des notes de calcul produites par TSA. Aucune lecture automatique ; commandes natives du navigateur (clavier).
 */
export const WelcomeVideo: React.FC = () => {
  const { language } = useLanguage();
  const fr = language === 'fr';
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl">
        <video
          className="block w-full h-auto aspect-video"
          controls
          preload="none"
          playsInline
          poster={video('tsa-presentation-poster.jpg')}
          width={1280}
          height={720}
          aria-label={fr ? 'Vidéo de présentation de TSA (40 secondes, sans son, sous-titrée)' : 'TSA presentation video (40 seconds, silent, subtitled)'}
        >
          <source src={video('tsa-presentation-720p.mp4')} type="video/mp4" />
          <track kind="subtitles" src={video('tsa-presentation.fr.vtt')} srcLang="fr" label="Français" default={fr} />
          <track kind="subtitles" src={video('tsa-presentation.en.vtt')} srcLang="en" label="English" default={!fr} />
          <p className="p-4 text-sm text-slate-200">
            {fr ? 'Votre navigateur ne peut pas lire cette vidéo. ' : 'Your browser cannot play this video. '}
            <a className="underline" href={video('tsa-presentation-720p.mp4')}>
              {fr ? 'Télécharger la vidéo (MP4)' : 'Download the video (MP4)'}
            </a>
          </p>
        </video>
      </div>
      <figcaption className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <span>
          {fr
            ? 'Présentation de 40 s, sans son, sous-titrée : captures réelles de TSA, calculs OpenSees et notes PDF produites par le logiciel.'
            : '40-second presentation, silent, subtitled: real TSA screenshots, OpenSees analyses and PDF reports produced by the software.'}
        </span>
        <a
          href={video('tsa-presentation-1080p.mp4')}
          download
          className="inline-flex items-center gap-1.5 shrink-0 font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 hover:underline"
        >
          <Download className="w-4 h-4" aria-hidden />
          {fr ? 'MP4 1080p' : 'MP4 1080p'}
        </a>
      </figcaption>
      <details className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        <summary className="cursor-pointer select-none font-medium">{fr ? 'Transcription' : 'Transcript'}</summary>
        <ol className="mt-2 ml-5 list-decimal space-y-1">
          {transcript[language].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </details>
    </figure>
  );
};
