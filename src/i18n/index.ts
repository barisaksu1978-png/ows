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
