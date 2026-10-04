import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description }) => {
  const { language } = useLanguage();

  useEffect(() => {
    const fullTitle = title
      ? `${title} | TSA — Tsaraloha Structural Analysis`
      : `TSA — Tsaraloha Structural Analysis | ${language === 'fr' ? siteConfig.taglineFr : siteConfig.taglineEn}`;

    document.title = fullTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description || (language === 'fr' ? siteConfig.descriptionFr : siteConfig.descriptionEn)
      );
    }
  }, [title, description, language]);

  return null;
};
