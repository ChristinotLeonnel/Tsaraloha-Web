import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  SCREENSHOT_HEIGHT,
  SCREENSHOT_WIDTH,
  screenshotById,
  screenshotSrc,
  screenshotSrcSet,
  type Screenshot,
} from '../config/screenshots';

interface FigureProps {
  id: string;
  /** Largeur d'affichage, pour choisir la bonne image (attribut sizes). */
  sizes?: string;
  /** Image principale de la page : chargée sans attendre. */
  priority?: boolean;
  /** Captures parcourues dans l'agrandissement (par défaut : celle-ci seule). */
  gallery?: string[];
  className?: string;
  captionClassName?: string;
}

/** Capture réelle de TSA avec légende ; un clic l'agrandit (Échap ou le bouton ferment, flèches pour parcourir). */
export const ScreenshotFigure: React.FC<FigureProps> = ({ id, sizes = '(min-width: 1024px) 50vw, 100vw', priority = false, gallery, className = '', captionClassName = '' }) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState<string | null>(null);
  const shot = screenshotById(id);
  const list = gallery ?? [id];

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => setOpen(id)}
        className="group relative block w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tsa-blue-500"
        aria-label={language === 'fr' ? `Agrandir : ${shot.caption.fr}` : `Enlarge: ${shot.caption.en}`}
      >
        <img
          src={screenshotSrc(id)}
          srcSet={screenshotSrcSet(id)}
          sizes={sizes}
          width={SCREENSHOT_WIDTH}
          height={SCREENSHOT_HEIGHT}
          alt={shot.alt[language]}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-slate-950/70 px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" aria-hidden />
          {language === 'fr' ? 'Agrandir' : 'Enlarge'}
        </span>
      </button>
      <figcaption className={`mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 ${captionClassName}`}>{shot.caption[language]}</figcaption>
      {open && <Lightbox ids={list} start={open} onClose={() => setOpen(null)} />}
    </figure>
  );
};

interface LightboxProps {
  ids: string[];
  start: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ ids, start, onClose }) => {
  const { language } = useLanguage();
  const [index, setIndex] = useState(Math.max(0, ids.indexOf(start)));
  const closeRef = useRef<HTMLButtonElement>(null);
  const shot: Screenshot = screenshotById(ids[index]);
  const step = useCallback((d: number) => setIndex((i) => (i + d + ids.length) % ids.length), [ids.length]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose, step]);

  const fr = language === 'fr';
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption[language]}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 p-3 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20"
        aria-label={fr ? 'Fermer' : 'Close'}
      >
        <X className="w-5 h-5" aria-hidden />
      </button>
      <img
        src={screenshotSrc(shot.id)}
        width={SCREENSHOT_WIDTH}
        height={SCREENSHOT_HEIGHT}
        alt={shot.alt[language]}
        className="max-h-[82vh] w-auto max-w-full h-auto rounded-lg shadow-2xl"
      />
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-200">
        {ids.length > 1 && (
          <button type="button" onClick={() => step(-1)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20" aria-label={fr ? 'Capture précédente' : 'Previous screenshot'}>
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>
        )}
        <p className="text-center max-w-3xl">
          {shot.caption[language]}
          {ids.length > 1 && <span className="ml-2 text-slate-400">({index + 1} / {ids.length})</span>}
        </p>
        {ids.length > 1 && (
          <button type="button" onClick={() => step(1)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20" aria-label={fr ? 'Capture suivante' : 'Next screenshot'}>
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
};
