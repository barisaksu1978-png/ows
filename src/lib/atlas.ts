import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { LOCALES, type Locale } from '../i18n';
import { pickLocalized } from './dossiers';

export type AtlasEntry = CollectionEntry<'atlas'>;

export function atlasEntryId(slug: string, locale: string): string {
  return `${slug}/${locale}`;
}

export function parseAtlasSlug(entryId: string): string {
  const idx = entryId.lastIndexOf('/');
  return idx === -1 ? entryId : entryId.slice(0, idx);
}

export async function listAtlasSlugs(): Promise<string[]> {
  const entries = await getCollection('atlas');
  const slugs = new Set(entries.map((e) => parseAtlasSlug(e.id)));
  return [...slugs].sort();
}

let atlasIdIndex: Set<string> | undefined;

async function knownAtlasIds(): Promise<Set<string>> {
  if (!atlasIdIndex) {
    const entries = await getCollection('atlas');
    atlasIdIndex = new Set(entries.map((e) => e.id));
  }
  return atlasIdIndex;
}

export async function listAtlasSlugsForLocale(locale: string): Promise<string[]> {
  const ids = await knownAtlasIds();
  const slugs = new Set<string>();
  for (const id of ids) {
    if (id.endsWith(`/${locale}`)) slugs.add(parseAtlasSlug(id));
  }
  return [...slugs].sort();
}

export async function listAtlasLocales(slug: string): Promise<Locale[]> {
  const ids = await knownAtlasIds();
  return LOCALES.filter((loc) => ids.has(atlasEntryId(slug, loc)));
}

/** Static paths for one locale folder: only slugs that have that locale file. */
export function atlasStaticPathsForLocale(locale: string) {
  return async () => {
    const slugs = await listAtlasSlugsForLocale(locale);
    return slugs.map((slug) => ({ params: { slug } }));
  };
}

export async function getAtlasEntry(
  slug: string,
  locale: string,
): Promise<AtlasEntry | null> {
  const id = atlasEntryId(slug, locale);
  const ids = await knownAtlasIds();
  if (!ids.has(id)) return null;
  const entry = await getEntry('atlas', id);
  return entry ?? null;
}

export type AtlasCard = {
  slug: string;
  title: string;
  summary: string;
  period: string;
};

export async function listAtlasCards(locale: string): Promise<AtlasCard[]> {
  const slugs = await listAtlasSlugs();
  const cards: AtlasCard[] = [];

  for (const slug of slugs) {
    const entry = await getAtlasEntry(slug, locale);
    if (!entry) continue;
    cards.push({
      slug,
      title: pickLocalized(entry.data.title, locale),
      summary: pickLocalized(entry.data.summary, locale),
      period: entry.data.period,
    });
  }

  cards.sort((a, b) => {
    const pa = Number.parseInt(a.period, 10) || 0;
    const pb = Number.parseInt(b.period, 10) || 0;
    if (pa !== pb) return pa - pb;
    return a.title.localeCompare(b.title, locale === 'tr' ? 'tr' : 'en');
  });

  return cards;
}

export { pickLocalized };
