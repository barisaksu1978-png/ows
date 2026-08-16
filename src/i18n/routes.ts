import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from './index';

const LOCALE_PREFIX = /^\/(en|ru|uk|el)(?=\/|$)/;
export const SITE_ORIGIN = 'https://openwarstudies.org';

/** Normalize a pathname to the site trailingSlash: 'always' policy. */
export function withTrailingSlash(pathname: string): string {
  let path = pathname.replace(/\/index\.html$/i, '');
  if (!path.startsWith('/')) path = `/${path}`;
  if (!path.endsWith('/')) path = `${path}/`;
  return path;
}

/** Absolute HTTPS apex URL for a site pathname. */
export function absolutePageUrl(
  pathname: string,
  siteOrigin: string = SITE_ORIGIN,
): string {
  const origin = siteOrigin.replace(/\/$/, '');
  return `${origin}${withTrailingSlash(pathname)}`;
}

/** True for locale home URLs: /, /en, /ru, /uk, /el */
export function isHomePath(pathname: string): boolean {
  const path = pathname.replace(/\/index\.html$/i, '').replace(/\/$/, '') || '/';
  if (path === '/') return true;
  return (['en', 'ru', 'uk', 'el'] as const).some((loc) => path === `/${loc}`);
}

/** Strip locale prefix; keep path trailing slash for Astro i18n helpers. */
export function stripLocalePrefix(pathname: string): string {
  let path = pathname.replace(/\/index\.html$/i, '');
  if (!path.startsWith('/')) path = `/${path}`;
  if (LOCALE_PREFIX.test(path)) {
    path = path.replace(LOCALE_PREFIX, '') || '/';
  }
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  return path;
}

/** Same-page locale switch URL (preserves route, handles prefixDefaultLocale: false). */
export function getLocaleSwitchUrl(targetLocale: Locale, pathname: string): string {
  return getRelativeLocaleUrl(targetLocale, stripLocalePrefix(pathname));
}
