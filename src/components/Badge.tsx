import React from 'react';
import { FeatureStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { CheckCircle2, Clock, Wrench, Compass } from 'lucide-react';

interface BadgeProps {
  status?: FeatureStatus;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'cyan';
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className = '',
  size = 'md',
}) => {
  const { t } = useLanguage();

  if (status) {
    const config = {
      AVAILABLE: {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
        label: t.common.available,
      },
      BETA: {
        bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
        icon: <Compass className="w-3.5 h-3.5 mr-1" />,
        label: t.common.beta,
      },
      IN_DEVELOPMENT: {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: <Wrench className="w-3.5 h-3.5 mr-1" />,
        label: t.common.inDevelopment,
      },
      PLANNED: {
        bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
        icon: <Clock className="w-3.5 h-3.5 mr-1" />,
        label: t.common.planned,
      },
    }[status];

    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    return (
      <span
        className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClass} ${className}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  }

  const variantClass = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
  }[variant || 'default'];

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
};
