import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
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

export async function atlasStaticPaths() {
  const slugs = await listAtlasSlugs();
  return slugs.map((slug) => ({ params: { slug } }));
}

export async function getAtlasEntry(
  slug: string,
  locale: string,
): Promise<AtlasEntry | null> {
  const localesToTry: string[] =
    locale === 'tr' ? ['tr'] : [locale, 'tr'];

  for (const loc of localesToTry) {
    const entry = await getEntry('atlas', atlasEntryId(slug, loc));
    if (entry) return entry;
  }
  return null;
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
