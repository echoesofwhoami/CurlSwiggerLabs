export interface LayoutProps {
  title?: string;
  description?: string;
  /** Open Graph type — use `article` on writeup pages */
  type?: 'website' | 'article';
  /** Absolute or site-relative path to OG image (defaults to /og-default.png) */
  image?: string;
  /** ISO date for article pages */
  publishedTime?: string;
  /** Align site chrome with wide landing-page content. */
  wide?: boolean;
}

export interface ChooseProps {
  if: boolean;
}

export interface NavbarModel {
  wide: boolean;
  homePath: string;
  aboutPath: string;
  conceptsPath: string;
  tweakerPath: string;
  currentSlug: string;
  menuId: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external: boolean;
  target: string | undefined;
  rel: string | undefined;
}

export interface NavbarProps {
  currentPath: string;
  wide?: boolean;
}
