import type { DossierCard, DossierHubData, HubFilters, HubView, SortKey } from './dossier-types';

export function loadHubData(): DossierHubData {
  const el = document.getElementById('dossier-hub-data');
  if (!el?.textContent) return { cards: [], categories: [], total: 0 };
  return JSON.parse(el.textContent) as DossierHubData;
}

export function readUrlState(): HubFilters {
  const p = new URLSearchParams(location.search);
  const view = p.get('view');
  const validView = view === 'list' || view === 'table' || view === 'split' ? view : 'table';
  return {
    q: p.get('q') ?? '',
    cat: p.get('cat') ?? 'all',
    status: p.get('status') ?? 'all',
    view: validView,
  };
}

export function writeUrlState(filters: HubFilters) {
  const p = new URLSearchParams();
  if (filters.q.trim()) p.set('q', filters.q.trim());
  if (filters.cat !== 'all') p.set('cat', filters.cat);
  if (filters.status !== 'all') p.set('status', filters.status);
  if (filters.view !== 'table') p.set('view', filters.view);
  const next = p.toString();
  const url = next ? `${location.pathname}?${next}` : location.pathname;
  history.replaceState(null, '', url);
}

export function filterCards(cards: DossierCard[], filters: Pick<HubFilters, 'q' | 'cat' | 'status'>): DossierCard[] {
  const q = filters.q.toLowerCase().trim();
  return cards.filter((card) => {
    if (filters.cat !== 'all' && card.categoryId !== filters.cat) return false;
    if (filters.status !== 'all' && card.status !== filters.status) return false;
    if (q && !card.searchHay.includes(q)) return false;
    return true;
  });
}

export function sortCards(cards: DossierCard[], key: SortKey, asc: boolean): DossierCard[] {
  const sorted = [...cards];
  sorted.sort((a, b) => {
    let av: string | number;
    let bv: string | number;
    if (key === 'updated') {
      av = a.updatedTs;
      bv = b.updatedTs;
      return asc ? av - bv : bv - av;
    }
    av = (key === 'code' ? a.code : a.title).toLowerCase();
    bv = (key === 'code' ? b.code : b.title).toLowerCase();
    return asc ? String(av).localeCompare(String(bv), 'tr') : String(bv).localeCompare(String(av), 'tr');
  });
  return sorted;
}

export function paletteScore(query: string, card: DossierCard): number {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const hay = card.searchHay;
  if (hay === q) return 1000;
  if (card.code.toLowerCase() === q) return 900;
  if (card.title.toLowerCase().startsWith(q)) return 800 - card.title.length * 0.01;
  const idx = hay.indexOf(q);
  if (idx >= 0) return 500 - idx;
  const parts = q.split(/\s+/).filter(Boolean);
  if (parts.every((p) => hay.includes(p))) return 300;
  return 0;
}

export function searchPalette(cards: DossierCard[], query: string, limit = 12): DossierCard[] {
  const q = query.trim();
  if (!q) return cards.slice(0, limit);
  return cards
    .map((card) => ({ card, score: paletteScore(q, card) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.card);
}

export const STATUS_KEYS = ['active', 'locked', 'under_review', 'quarantined', 'archived'] as const;

export function isHubView(v: string): v is HubView {
  return v === 'list' || v === 'table' || v === 'split';
}
