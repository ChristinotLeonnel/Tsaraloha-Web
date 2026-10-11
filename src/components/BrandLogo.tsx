import React from 'react';
import { brandAssets, brandName } from '../config/brand';
import { useTheme } from '../theme/ThemeContext';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface BrandLogoProps {
  size?: Size;
  /** auto : suit le thème ; dark / light : fond imposé (ex. pied de page toujours foncé). */
  surface?: 'auto' | 'dark' | 'light';
  /** Logo seul : texte alternatif « TSA ». Avec un nom écrit à côté, le logo est décoratif. */
  decorative?: boolean;
  className?: string;
}

const pixels: Record<Size, number> = { sm: 28, md: 36, lg: 48, xl: 72 };

/** Tuile officielle TSA, proportions conservées, variante adaptée au fond. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', surface = 'auto', decorative = false, className = '' }) => {
  const { isDark } = useTheme();
  const dark = surface === 'dark' || (surface === 'auto' && isDark);
  const px = pixels[size];
  return (
    <img
      src={dark ? brandAssets.tileDark : brandAssets.tileLight}
      width={px}
      height={px}
      alt={decorative ? '' : brandName.short}
      draggable={false}
      className={`shrink-0 rounded-[22%] shadow-sm ring-1 ${dark ? 'ring-white/10' : 'ring-slate-900/10'} ${className}`}
      style={{ width: px, height: px }}
    />
  );
};
