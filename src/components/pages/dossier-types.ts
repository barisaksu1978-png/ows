export interface DossierCard {
  slug: string;
  code: string;
  status: string;
  evidenceLevel: string;
  riskLevel: string;
  title: string;
  summary: string;
  updated: string;
  updatedTs: number;
  href: string;
  categoryId: string;
  categoryLabel: string;
  statusLabel: string;
  evidenceLabel: string;
  riskLabel: string;
  searchHay: string;
}

export interface DossierCategoryChip {
  id: string;
  label: string;
  count: number;
}

export interface DossierHubData {
  cards: DossierCard[];
  categories: DossierCategoryChip[];
  total: number;
}

export type HubView = 'list' | 'table' | 'split';
export type SortKey = 'code' | 'title' | 'updated';

export interface HubFilters {
  q: string;
  cat: string;
  status: string;
  view: HubView;
}

export const ROW_HEIGHT = 36;
export const VIRTUAL_OVERSCAN = 6;
