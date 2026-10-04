import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  basePath: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Helper to determine the repository base path (e.g. /Tsaraloha-Web/ or /)
const getBasePath = (): string => {
  const isGhActions = window.location.pathname.startsWith('/Tsaraloha-Web');
  return isGhActions ? '/Tsaraloha-Web' : '';
};

// Extracts normalized internal route from URL, handling SPA 404 redirects (?/path)
const getCleanPath = (): string => {
  const { pathname, search, hash } = window.location;

  // 1. Handle GitHub Pages 404 redirect pattern: /?/features
  if (search && search.startsWith('?/')) {
    const cleanSearch = search.slice(2).split('&')[0];
    return '/' + cleanSearch.replace(/~and~/g, '&');
  }

  // 2. Handle hash routes if present: #/features
  if (hash && hash.startsWith('#/')) {
    return hash.slice(1);
  }

  // 3. Handle standard pathname by stripping repository base
  const base = getBasePath();
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }

  return path || '/';
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(getCleanPath);
  const basePath = getBasePath();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCleanPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // If external link, let browser handle it
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:')) {
      window.location.href = to;
      return;
    }

    const fullUrl = basePath ? `${basePath}${to.startsWith('/') ? to : '/' + to}` : to;
    window.history.pushState({}, '', fullUrl);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [basePath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, basePath }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}) => {
  const { currentPath, navigate, basePath } = useRouter();
  const isExternal = to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:');
  const isActive = !isExternal && (currentPath === to || (to !== '/' && currentPath.startsWith(to)));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!isExternal && !e.defaultPrevented && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  const href = isExternal ? to : (basePath ? `${basePath}${to.startsWith('/') ? to : '/' + to}` : to);

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </a>
  );
};
