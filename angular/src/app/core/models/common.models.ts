export interface NavItem {
  href: string;
  label: string;
}

export interface FeatureSection {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export interface FeaturePageData {
  title: string;
  subtitle: string;
  sections: FeatureSection[];
  quickActions?: { label: string; link: string }[];
}
