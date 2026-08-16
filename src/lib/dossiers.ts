import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { LOCALES, type Locale } from '../i18n';

export type DossierEntry = CollectionEntry<'dossiers'>;

/** Entry id format: `{slug}/{locale}` e.g. orthodox-axis/tr */
export function dossierEntryId(slug: string, locale: string): string {
  return `${slug}/${locale}`;
}

export function parseDossierSlug(entryId: string): string {
  const idx = entryId.lastIndexOf('/');
  return idx === -1 ? entryId : entryId.slice(0, idx);
}

export async function listDossierSlugs(): Promise<string[]> {
  const entries = await getCollection('dossiers');
  const slugs = new Set(entries.map((e) => parseDossierSlug(e.id)));
  return [...slugs].sort();
}

let dossierIdIndex: Set<string> | undefined;

async function knownDossierIds(): Promise<Set<string>> {
  if (!dossierIdIndex) {
    const entries = await getCollection('dossiers');
    dossierIdIndex = new Set(entries.map((e) => e.id));
  }
  return dossierIdIndex;
}

export async function listDossierSlugsForLocale(locale: string): Promise<string[]> {
  const ids = await knownDossierIds();
  const slugs = new Set<string>();
  for (const id of ids) {
    if (id.endsWith(`/${locale}`)) slugs.add(parseDossierSlug(id));
  }
  return [...slugs].sort();
}

export async function listDossierLocales(slug: string): Promise<Locale[]> {
  const ids = await knownDossierIds();
  return LOCALES.filter((loc) => ids.has(dossierEntryId(slug, loc)));
}

/** Static paths for one locale folder: only slugs that have that locale file. */
export function dossierStaticPathsForLocale(locale: string) {
  return async () => {
    const slugs = await listDossierSlugsForLocale(locale);
    return slugs.map((slug) => ({ params: { slug } }));
  };
}

type LocalizedField = {
  tr: string;
  en?: string;
  ru?: string;
  uk?: string;
  el?: string;
};

export function pickLocalized(field: LocalizedField, locale: string): string {
  const loc = locale as Locale;
  if (loc !== 'tr' && field[loc]) return field[loc]!;
  return field.tr;
}

export async function getDossierEntry(
  slug: string,
  locale: string,
): Promise<DossierEntry | null> {
  const id = dossierEntryId(slug, locale);
  const ids = await knownDossierIds();
  if (!ids.has(id)) return null;
  const entry = await getEntry('dossiers', id);
  return entry ?? null;
}

/** Map relatedMaps slug → ui.json atlas card key */
export const MAP_SLUG_LABELS: Record<string, keyof import('../i18n').UiStrings> = {
  'eastern-question-1886': 'atlas.card.eastern_question.title',
};

export interface DossierGroup {
  baseSlug: string;
  cardSlug: string;
  hasPopular: boolean;
}
export async function listDossierGroups(): Promise<DossierGroup[]> {
  const slugs = await listDossierSlugs();
  const groups = new Map<string, DossierGroup>();
  for (const slug of slugs) {
    const base = slug.endsWith('-popular')
      ? slug.slice(0, -'-popular'.length)
      : slug;
    const existing =
      groups.get(base) ?? { baseSlug: base, cardSlug: base, hasPopular: false };
    if (slug.endsWith('-popular')) existing.hasPopular = true;
    else existing.cardSlug = slug;
    groups.set(base, existing);
  }
  // forensik base yoksa (sadece -popular varsa) kartı popular'dan bas
  for (const g of groups.values()) {
    if (!slugs.includes(g.cardSlug)) g.cardSlug = `${g.baseSlug}-popular`;
  }
  return [...groups.values()].sort((a, b) =>
    a.baseSlug.localeCompare(b.baseSlug),
  );
}

export interface RegisterLinks {
  hasPopular: boolean;
  isPopular: boolean;
  forensicSlug: string;
  popularSlug: string;
}
export async function getRegisterLinks(
  slug: string,
  locale: string,
): Promise<RegisterLinks> {
  const groups = await listDossierGroups();
  const isPopular = slug.endsWith('-popular');
  const base = isPopular ? slug.slice(0, -'-popular'.length) : slug;
  const group = groups.find((g) => g.baseSlug === base);
  const forensicSlug = base;
  const popularSlug = `${base}-popular`;
  const hasPopular =
    Boolean(group?.hasPopular) &&
    (await getDossierEntry(popularSlug, locale)) != null &&
    (await getDossierEntry(forensicSlug, locale)) != null;
  return {
    hasPopular,
    isPopular,
    forensicSlug,
    popularSlug,
  };
}

export interface DossierCategory {
  labelKey: keyof import('../i18n').UiStrings;
  slugs: string[];
}
// Görüntü sırası = dizi sırası. Grup sırası ve grup içi sıra buradan kontrol edilir.
export const DOSSIER_CATEGORIES: DossierCategory[] = [
  {
    labelKey: 'dossiers.category.orthodox',
    slugs: ['orthodox-axis', 'nevskiy-danylo', 'yaroslav-relics'],
  },
  {
    labelKey: 'dossiers.category.soviet',
    slugs: ['sovyet-amerikan-transfer', 'protokol-17447-traktor-mu-tank-mi'],
  },
  {
    labelKey: 'dossiers.category.usForeignPolicy',
    slugs: ['abd-dis-politikasi', 'arayuz-analizleri-kudus', 'arayuz-analizleri-reagan', 'arayuz-analizleri-suveys'],
  },
];
