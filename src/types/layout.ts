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

export interface NavbarProps {
  currentPath: string;
  wide?: boolean;
}
