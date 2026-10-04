import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: 'blue' | 'cyan' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = 'none',
  onClick,
}) => {
  const hoverClass = hoverEffect
    ? 'hover:-translate-y-1 hover:border-tsa-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all duration-300'
    : '';

  const glowClass = {
    blue: 'border-tsa-blue-500/30 tech-glow',
    cyan: 'border-tsa-cyan-400/30 tech-glow-cyan',
    none: 'border-slate-200 dark:border-slate-800',
  }[glow];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-white dark:bg-tsa-surface-card border ${glowClass} ${hoverClass} shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
