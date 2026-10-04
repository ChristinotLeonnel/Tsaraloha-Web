import React from 'react';
import { Link } from '../router/RouterContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]', // WCAG touch target compliant
    lg: 'px-7 py-3.5 text-base gap-2.5 min-h-[48px]',
  }[size];

  const variantClasses = {
    primary: 'bg-tsa-blue-600 hover:bg-tsa-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-500/20 focus-visible:ring-tsa-blue-500',
    glow: 'bg-gradient-to-r from-tsa-blue-600 to-tsa-cyan-400 hover:from-tsa-blue-700 hover:to-tsa-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-400/30 focus-visible:ring-tsa-cyan-400',
    accent: 'bg-tsa-accent-orange hover:bg-tsa-accent-orangeHover text-white shadow-md hover:shadow-lg shadow-orange-500/25 focus-visible:ring-tsa-accent-orange',
    secondary: 'bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-slate-400',
    outline: 'border border-slate-300 dark:border-slate-700/80 hover:border-tsa-blue-500 dark:hover:border-tsa-cyan-400 text-slate-700 dark:text-slate-200 hover:text-tsa-blue-600 dark:hover:text-tsa-cyan-300 bg-white/50 dark:bg-slate-900/40 focus-visible:ring-tsa-blue-500',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white bg-transparent focus-visible:ring-slate-400',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <Link to={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};
