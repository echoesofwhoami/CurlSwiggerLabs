import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const pathWithoutBase = url.pathname.replace(base, '');
  const [, lang] = pathWithoutBase.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key];
  };
}

export function getLocalizedPath(lang: Lang, path: string = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (lang === defaultLang) {
    return `${base}${path ? `/${path}` : ''}`;
  }
  return `${base}/${lang}${path ? `/${path}` : ''}`;
}

/** Pathname without base URL and language prefix (e.g. `/es/foo/` -> `foo`). */
export function getPathWithoutLang(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }
  const segments = path.split('/').filter(Boolean);
  if (segments[0] && segments[0] in ui) {
    segments.shift();
  }
  return segments.join('/');
}

/** Same page in another locale, with trailing slash (e.g. `/es/foo/`). */
export function getLocalizedHref(lang: Lang, pathname: string): string {
  const slug = getPathWithoutLang(pathname);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (lang === defaultLang) {
    return slug ? `${base}/${slug}/` : `${base}/`;
  }
  return slug ? `${base}/${lang}/${slug}/` : `${base}/${lang}/`;
}
