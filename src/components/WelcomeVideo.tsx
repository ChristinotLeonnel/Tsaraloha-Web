import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const base = import.meta.env.BASE_URL;
const video = (f: string) => `${base}video/${f}`;

interface SubtitleCue {
  start: number;
  end: number;
  fr: string;
  en: string;
}

// Repères temporels précis correspondant aux séquences réelles de la vidéo de 42 s
const cues: SubtitleCue[] = [
  {
    start: 0.0,
    end: 3.95,
    fr: 'TSA — analyse et calcul de structures.',
    en: 'TSA — structural analysis and design.',
  },
  {
    start: 4.0,
    end: 10.95,
    fr: 'Modélisation 3D : poteaux, poutres, dalles, voiles, semelles et escaliers.',
    en: '3D modeling: columns, beams, slabs, walls, footings and stairs.',
  },
  {
    start: 11.0,
    end: 16.95,
    fr: 'Matériaux et rendu : béton coffré, acier peint, galvanisé ; modes texturé, ombré, filaire et léger.',
    en: 'Materials and rendering: formed concrete, painted and galvanized steel; textured, shaded, wireframe and light modes.',
  },
  {
    start: 17.0,
    end: 23.95,
    fr: 'Pont à haubans 80 + 180 + 80 m : pylônes en H, 64 haubans, tablier métallique.',
    en: 'Cable-stayed bridge 80 + 180 + 80 m: H pylons, 64 stay cables, steel deck.',
  },
  {
    start: 24.0,
    end: 31.95,
    fr: 'Calcul OpenSees réel : déformée amplifiée, contraintes normales, efforts dans les haubans.',
    en: 'Real OpenSees analysis: amplified deformed shape, normal stresses, stay cable forces.',
  },
  {
    start: 32.0,
    end: 37.95,
    fr: 'Notes de calcul PDF simplifiée et détaillée, produites à partir des résultats réels.',
    en: 'Simplified and detailed PDF design reports, built from the actual results.',
  },
  {
    start: 38.0,
    end: 41.95,
    fr: 'Modéliser, calculer, justifier — avec TSA.',
    en: 'Model, analyse, justify — with TSA.',
  },
];

const transcript = {
  fr: cues.map((c) => c.fr),
  en: cues.map((c) => c.en),
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Lecteur vidéo de présentation TSA (42 s) avec :
 * - Narration audio française professionnelle et bande originale ambiante
 * - Commandes complètes et accessibles : lecture/pause, volume, indicateur clair d'état du son
 * - Sous-titres élégants, discrets et responsives (18-22px desktop, 14-18px mobile, max 2 lignes)
 */
export const WelcomeVideo: React.FC = () => {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(42);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isEnded, setIsEnded] = useState(false);

  // Synchronisation des sous-titres actifs
  const activeCue = subtitlesEnabled
    ? cues.find((c) => currentTime >= c.start && currentTime <= c.end)
    : null;
  const activeSubtitle = activeCue ? (fr ? activeCue.fr : activeCue.en) : null;

  // Masquer les sous-titres natifs du navigateur pour éviter tout doublon
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const hideNativeTracks = () => {
      for (let i = 0; i < v.textTracks.length; i++) {
        v.textTracks[i].mode = 'hidden';
      }
    };
    v.addEventListener('loadedmetadata', hideNativeTracks);
    hideNativeTracks();
    return () => {
      v.removeEventListener('loadedmetadata', hideNativeTracks);
    };
  }, []);

  // Gestion du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Décompte de disparition automatique des contrôles en cours de lecture
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          setIsEnded(false);
        })
        .catch((err) => {
          console.warn('Lecture vidéo bloquée par le navigateur :', err);
        });
    } else {
      v.pause();
      setIsPlaying(false);
    }
    resetHideTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
    resetHideTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    if (val === 0) {
      v.muted = true;
      setIsMuted(true);
    } else if (v.muted) {
      v.muted = false;
      setIsMuted(false);
    }
    resetHideTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = time;
    setCurrentTime(time);
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Échec passage en plein écran :', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Échec sortie du plein écran :', err);
      });
    }
    resetHideTimer();
  };

  return (
    <figure className="w-full">
      <div
        ref={containerRef}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl select-none"
      >
        {/* Balise vidéo principale */}
        <video
          ref={videoRef}
          controls
          className="block w-full h-auto aspect-video cursor-pointer custom-player"
          preload="metadata"
          playsInline
          poster={video('tsa-presentation-poster.jpg')}
          width={1280}
          height={720}
          onClick={togglePlay}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onDurationChange={() => {
            if (videoRef.current) setDuration(videoRef.current.duration || 42);
          }}
          onPlay={() => {
            setIsPlaying(true);
            setIsEnded(false);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setIsEnded(true);
            setShowControls(true);
          }}
          aria-label={
            fr
              ? 'Vidéo de présentation de TSA (42 secondes, avec narration audio et sous-titres)'
              : 'TSA presentation video (42 seconds, audio narration and subtitles)'
          }
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

        {/* Bouton central de lecture lors de la pause ou fin */}
        {(!isPlaying || isEnded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-[2px] transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-tsa-blue-600/90 hover:bg-tsa-blue-500 text-white shadow-2xl shadow-tsa-blue-600/50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-tsa-cyan-400"
              aria-label={isEnded ? (fr ? 'Rejouer la vidéo' : 'Replay video') : (fr ? 'Lancer la vidéo' : 'Play video')}
            >
              {isEnded ? (
                <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 ml-0" />
              ) : (
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
              )}
            </button>
          </div>
        )}

        {/* Sous-titres discrets et responsives (18-22px desktop, 14-18px mobile, max 2 lignes) */}
        {subtitlesEnabled && activeSubtitle && (
          <div className="pointer-events-none absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-full px-4 flex justify-center z-20 transition-all duration-200">
            <div className="max-w-[92%] sm:max-w-[82%] md:max-w-[70%] bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 sm:px-5 py-2 shadow-2xl text-center">
              <p className="text-[14px] sm:text-[16px] md:text-[19px] leading-snug sm:leading-relaxed text-slate-100 font-medium tracking-normal select-none line-clamp-2">
                {activeSubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Barre de commandes personnalisée */}
        <div
          className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent pt-8 pb-3 px-3 sm:px-5 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Ligne temporelle / Seek bar */}
          <div className="relative mb-2 flex items-center group/scrub">
            <input
              type="range"
              min={0}
              max={duration || 42}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 sm:h-2 bg-slate-700/70 rounded-lg appearance-none cursor-pointer accent-tsa-cyan-400 focus:outline-none transition-all group-hover/scrub:h-2.5"
              aria-label={fr ? 'Position dans la vidéo' : 'Video seek position'}
            />
          </div>

          {/* Ligne des contrôles */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 text-slate-100">
            {/* Commandes gauche : Lecture, Son, État du son, Temps */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Bouton Lecture / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-tsa-cyan-400"
                aria-label={isPlaying ? (fr ? 'Mettre en pause' : 'Pause') : (fr ? 'Lancer la vidéo' : 'Play')}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Bouton Son & Slider */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-tsa-cyan-400"
                  aria-label={isMuted ? (fr ? 'Activer le son' : 'Unmute') : (fr ? 'Couper le son' : 'Mute')}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-slate-100" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1.5 bg-slate-700/70 rounded-lg appearance-none cursor-pointer accent-tsa-cyan-400 focus:outline-none hidden sm:block"
                  aria-label={fr ? 'Niveau du volume sonore' : 'Volume level'}
                />
              </div>

              {/* Indicateur explicite de l'état du son */}
              <button
                type="button"
                onClick={toggleMute}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isMuted || volume === 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
                title={fr ? 'Cliquer pour modifier l’état du son' : 'Click to toggle sound'}
              >
                {isMuted || volume === 0 ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>{fr ? 'Son coupé (cliquez pour activer)' : 'Muted (click to unmute)'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{fr ? 'Son activé (Narration FR)' : 'Sound active (FR Narration)'}</span>
                  </>
                )}
              </button>

              {/* Affichage du temps écoulé / durée */}
              <span className="text-xs sm:text-sm font-mono text-slate-300 ml-1 select-none">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Commandes droite : Sous-titres, Plein écran */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Bouton Sous-titres (CC) */}
              <button
                type="button"
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-tsa-cyan-400 ${
                  subtitlesEnabled
                    ? 'bg-tsa-blue-600/40 text-tsa-cyan-300 border border-tsa-cyan-500/40'
                    : 'text-slate-400 hover:bg-white/10'
                }`}
                aria-label={
                  subtitlesEnabled
                    ? (fr ? 'Désactiver les sous-titres' : 'Disable subtitles')
                    : (fr ? 'Activer les sous-titres' : 'Enable subtitles')
                }
                title={subtitlesEnabled ? (fr ? 'Sous-titres activés' : 'Subtitles on') : (fr ? 'Sous-titres désactivés' : 'Subtitles off')}
              >
                <Subtitles className="w-4 h-4" />
                <span className="hidden sm:inline">CC</span>
              </button>

              {/* Bouton Plein écran */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-tsa-cyan-400"
                aria-label={isFullscreen ? (fr ? 'Quitter le plein écran' : 'Exit fullscreen') : (fr ? 'Plein écran' : 'Fullscreen')}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Légende et lien de téléchargement HD */}
      <figcaption className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <span>
          {fr
            ? 'Présentation de 42 s avec narration française et sous-titres : captures réelles de TSA, calculs OpenSees et notes PDF produites par le logiciel.'
            : '42-second presentation with French narration and subtitles: real TSA screenshots, OpenSees analyses and PDF reports produced by the software.'}
        </span>
        <a
          href={video('tsa-presentation-1080p.mp4')}
          download
          className="inline-flex items-center gap-1.5 shrink-0 font-semibold text-tsa-blue-600 dark:text-tsa-cyan-400 hover:underline"
        >
          <Download className="w-4 h-4" aria-hidden />
          {fr ? 'MP4 1080p avec audio' : 'MP4 1080p with audio'}
        </a>
      </figcaption>

      {/* Transcription textuelle accessible */}
      <details className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        <summary className="cursor-pointer select-none font-medium">{fr ? 'Transcription complète' : 'Full transcript'}</summary>
        <ol className="mt-2 ml-5 list-decimal space-y-1">
          {transcript[language].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </details>
    </figure>
  );
};
