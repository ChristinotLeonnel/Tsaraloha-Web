import React from 'react';
import type { NavItem } from '../config/navigation';
import { TsaIcon } from './TsaIcon';

/** Icône d'une rubrique : icône officielle de TSA quand le logiciel en a une pour cette fonction, sinon Lucide. */
export const NavIcon: React.FC<{ item: NavItem; size?: number; className?: string }> = ({ item, size = 16, className = '' }) => {
  if (item.tsa) return <TsaIcon name={item.tsa} size={size} className={className} />;
  const Icon = item.icon;
  return <Icon className={`shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden />;
};
