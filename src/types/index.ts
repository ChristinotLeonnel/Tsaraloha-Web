export type FeatureStatus = 'AVAILABLE' | 'BETA' | 'IN_DEVELOPMENT' | 'PLANNED';

export type FeatureCategory = 'modeling' | 'cad' | 'analysis' | 'meshing' | 'results';

export interface FeatureItem {
  id: string;
  name: string;
  nameFr: string;
  category: FeatureCategory;
  descriptionEn: string;
  descriptionFr: string;
  status: FeatureStatus;
  icon?: string;
  tags?: string[];
}

export interface PricingFeature {
  textEn: string;
  textFr: string;
  included: boolean;
  noteEn?: string;
  noteFr?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  nameFr: string;
  badgeEn?: string;
  badgeFr?: string;
  priceEn: string;
  priceFr: string;
  periodEn: string;
  periodFr: string;
  descriptionEn: string;
  descriptionFr: string;
  popular?: boolean;
  ctaTextEn: string;
  ctaTextFr: string;
  ctaLink: string;
  features: PricingFeature[];
}

export interface RoadmapItem {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  status: 'completed' | 'in_development' | 'planned' | 'research';
  quarter: string;
  tags: string[];
}

export interface ChangelogItem {
  version: string;
  releaseType: 'development' | 'beta' | 'stable';
  date: string;
  titleEn: string;
  titleFr: string;
  addedEn: string[];
  addedFr: string[];
  changedEn?: string[];
  changedFr?: string[];
  fixedEn?: string[];
  fixedFr?: string[];
  knownIssuesEn?: string[];
  knownIssuesFr?: string[];
}

export interface DownloadPlatform {
  id: string;
  name: string;
  os: 'windows' | 'linux' | 'source';
  statusEn: string;
  statusFr: string;
  badgeEn: string;
  badgeFr: string;
  version: string;
  architecture: string;
  downloadUrl?: string;
  githubReleaseUrl: string;
  commandSnippet?: string;
  requirementsEn: string[];
  requirementsFr: string[];
}

export type Language = 'en' | 'fr';
export type Theme = 'light' | 'dark' | 'system';
