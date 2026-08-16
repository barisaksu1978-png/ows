import ui from './ui.json';

export type Locale = 'tr' | 'en' | 'ru' | 'uk' | 'el';
export const LOCALES: Locale[] = ['tr', 'en', 'ru', 'uk', 'el'];

export type UiStrings = typeof ui.tr;

const locales = ui as Record<Locale, UiStrings>;

export function getUi(locale: string): UiStrings {
  if (locale in locales) return locales[locale as Locale];
  return locales.tr;
}

/** Translate key with Turkish fallback; never returns raw key to UI. */
export function t(locale: string, key: keyof UiStrings): string {
  const bucket = getUi(locale);
  const tr = locales.tr;
  const val = bucket[key];
  if (val != null && val !== '') return val;
  const fb = tr[key];
  if (fb != null && fb !== '') return fb;
  return String(key);
}

export function localePath(locale: Locale, path = ''): string {
  const base = locale === 'tr' ? '' : `/${locale}`;
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${base}${suffix}` || '/';
}

const DEFAULT_BRAND = 'Open War Studies';

/** Document title: `{page name} · Open War Studies`, without doubling the brand. */
export function formatDocumentTitle(
  pageName: string,
  brand: string = DEFAULT_BRAND,
): string {
  const name = pageName.trim();
  const b = brand.trim();
  if (!name || name === b) return b;
  if (name.endsWith(` · ${b}`)) return name;
  return `${name} · ${b}`;
}

/** Drop a leading hub index (`06 · `) from a nav label. For document titles only. */
export function stripHubIndexPrefix(label: string): string {
  return label.replace(/^\d+\s*·\s*/, '').trim();
}
