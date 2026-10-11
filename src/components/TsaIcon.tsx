import React from 'react';
import { tsaIconUrl, type TsaIconKey } from '../config/tsaIcons';

interface TsaIconProps {
  name: TsaIconKey;
  size?: number;
  className?: string;
}

/** Icône officielle du logiciel TSA (SVG d'origine, couleurs conservées). Décorative : le texte voisin nomme l'action. */
export const TsaIcon: React.FC<TsaIconProps> = ({ name, size = 16, className = '' }) => (
  <img
    src={tsaIconUrl(name)}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
);
