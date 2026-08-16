import type { DossierCard, HubFilters, HubView, SortKey } from './dossier-types';
import { ROW_HEIGHT } from './dossier-types';
import {
  filterCards,
  isHubView,
  loadHubData,
  readUrlState,
  sortCards,
  writeUrlState,
} from './dossier-engine';
import {
  renderVirtualList,
  renderVirtualSplit,
  renderVirtualTable,
  totalScrollHeight,
} from './dossier-render';
import { createPalette } from './dossier-palette';

const VIEW_KEY = 'ows-dossier-view-v4';
const DEFAULT_VIEW: HubView = 'table';

export function initDossierHub() {
  const root = document.getElementById('dossier-app');
  if (!root || root.dataset.hubReady === '1') return;
  root.dataset.hubReady = '1';

  const data = loadHubData();
  const search = document.getElementById('dossier-search') as HTMLInputElement | null;
  const empty = document.getElementById('dossier-empty');
  const tableCount = document.getElementById('dossier-table-count');
  const viewBtns = root.querySelectorAll<HTMLButtonElement>('.dossier-view-btn[data-view]');
  const tableScroll = document.getElementById('dossier-table-scroll');
  const tableBody = document.getElementById('dossier-tbody');
  const listScroll = document.getElementById('dossier-list-scroll');
  const listBody = document.getElementById('dossier-list-body');
  const splitScroll = document.getElementById('dossier-split-scroll');
  const splitBody = document.getElementById('dossier-split-body');
  const preview = document.getElementById('dossier-preview');
  const previewOpen = preview?.querySelector<HTMLAnchorElement>('.dossier-preview__open');
  const statusSelect = document.getElementById('dossier-status-filter') as HTMLSelectElement | null;

  let sortKey: SortKey = 'code';
  let sortAsc = true;
  let selectedSlug: string | null = data.cards[0]?.slug ?? null;

  const urlState = readUrlState();
  const filters: HubFilters = {
    q: urlState.q,
    cat: urlState.cat,
    status: urlState.status,
    view: urlState.view,
  };

  if (search && filters.q) search.value = filters.q;
  if (statusSelect && filters.status !== 'all') statusSelect.value = filters.status;

  const palette = createPalette(
    data.cards,
    {
      placeholder: root.dataset.palettePlaceholder ?? 'Dosya ara…',
      empty: root.dataset.paletteEmpty ?? 'Sonuç yok',
      hint: root.dataset.paletteHint ?? '',
    },
    (href) => {
      window.location.href = href;
    },
  );

  function syncFilterUi() {
    root!.querySelectorAll<HTMLButtonElement>('[data-filter-cat]').forEach((b) => {
      b.classList.toggle('is-active', (b.dataset.filterCat ?? 'all') === filters.cat);
    });
    if (statusSelect) statusSelect.value = filters.status;
  }

  function filteredSorted(): DossierCard[] {
    const q = search?.value ?? filters.q;
    const filtered = filterCards(data.cards, { q, cat: filters.cat, status: filters.status });
    return sortCards(filtered, sortKey, sortAsc);
  }

  function updateCount(visible: number) {
    if (!tableCount) return;
    const template = tableCount.dataset.template ?? '{visible} / {total}';
    tableCount.textContent = template
      .replace('{visible}', String(visible))
      .replace('{total}', String(data.total));
  }

  function showPreview(card: DossierCard | null) {
    if (!preview) return;
    if (!card) {
      preview.classList.add('is-empty');
      preview.querySelectorAll('[data-preview]').forEach((el) => {
        el.textContent = '';
      });
      if (previewOpen) previewOpen.href = '#';
      return;
    }
    preview.classList.remove('is-empty');
    const map: Record<string, string> = {
      title: card.title,
      code: card.code,
      status: card.statusLabel,
      summary: card.summary,
      updated: card.updated,
      cat: card.categoryLabel,
      evidence: card.evidenceLabel,
      risk: card.riskLabel,
    };
    Object.entries(map).forEach(([key, val]) => {
      const el = preview.querySelector(`[data-preview="${key}"]`);
      if (el) el.textContent = val;
    });
    if (previewOpen) previewOpen.href = card.href;
  }

  function bindTableRows() {
    tableBody?.querySelectorAll<HTMLTableRowElement>('.notion-db__row').forEach((row) => {
      row.addEventListener('click', () => {
        const href = row.dataset.href;
        if (href) window.location.href = href;
      });
    });
  }

  function bindSplitRows(cards: DossierCard[]) {
    splitBody?.querySelectorAll<HTMLElement>('.dossier-split-item').forEach((row) => {
      row.addEventListener('click', () => {
        const slug = row.dataset.slug;
        if (!slug) return;
        selectedSlug = slug;
        const card = cards.find((c) => c.slug === slug) ?? data.cards.find((c) => c.slug === slug);
        showPreview(card ?? null);
        render();
      });
    });
  }

  function renderTable() {
    if (!tableScroll || !tableBody) return;
    const cards = filteredSorted();
    const h = totalScrollHeight(cards.length);
    tableScroll.style.setProperty('--virtual-height', `${h}px`);
    renderVirtualTable(tableBody, cards, tableScroll.scrollTop, tableScroll.clientHeight);
    bindTableRows();
    updateCount(cards.length);
    if (empty) {
      empty.hidden = cards.length > 0;
      empty.classList.toggle('is-visible', cards.length === 0);
    }
  }

  function renderList() {
    if (!listScroll || !listBody) return;
    const cards = filteredSorted();
    const h = totalScrollHeight(cards.length);
    listScroll.style.setProperty('--virtual-height', `${h}px`);
    renderVirtualList(listBody, cards, listScroll.scrollTop, listScroll.clientHeight);
    updateCount(cards.length);
    if (empty) {
      empty.hidden = cards.length > 0;
      empty.classList.toggle('is-visible', cards.length === 0);
    }
  }

  function renderSplit() {
    if (!splitScroll || !splitBody) return;
    const cards = filteredSorted();
    const h = totalScrollHeight(cards.length);
    splitScroll.style.setProperty('--virtual-height', `${h}px`);
    if (!selectedSlug || !cards.some((c) => c.slug === selectedSlug)) {
      selectedSlug = cards[0]?.slug ?? null;
    }
    const selected = cards.find((c) => c.slug === selectedSlug) ?? data.cards.find((c) => c.slug === selectedSlug);
    showPreview(selected ?? null);
    renderVirtualSplit(splitBody, cards, splitScroll.scrollTop, splitScroll.clientHeight, selectedSlug);
    bindSplitRows(cards);
    updateCount(cards.length);
    if (empty) {
      empty.hidden = cards.length > 0;
      empty.classList.toggle('is-visible', cards.length === 0);
    }
  }

  function render() {
    filters.q = search?.value ?? filters.q;
    writeUrlState(filters);
    if (filters.view === 'table') renderTable();
    else if (filters.view === 'list') renderList();
    else renderSplit();
  }

  function setView(view: HubView) {
    filters.view = view;
    root!.dataset.view = view;
    const routeRoot = document.getElementById('route-root');
    routeRoot?.classList.toggle('page--hub-split', view === 'split');
    routeRoot?.classList.toggle('page--hub-table', view === 'table');
    viewBtns.forEach((b) => {
      const match = b.dataset.view === view;
      b.classList.toggle('is-active', match);
      b.setAttribute('aria-pressed', match ? 'true' : 'false');
    });
    root!.querySelectorAll<HTMLElement>('.dossier-view').forEach((panel) => {
      panel.hidden = true;
    });
    const panel = root!.querySelector<HTMLElement>(`.dossier-view--${view}`);
    if (panel) panel.hidden = false;
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* ignore */
    }
    render();
  }

  function onFilterChange() {
    filters.q = search?.value ?? '';
    filters.status = statusSelect?.value ?? 'all';
    render();
  }

  root.querySelectorAll<HTMLButtonElement>('[data-filter-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.cat = btn.dataset.filterCat ?? 'all';
      syncFilterUi();
      render();
    });
  });

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const v = btn.dataset.view ?? DEFAULT_VIEW;
      if (isHubView(v)) setView(v);
    });
  });

  search?.addEventListener('input', onFilterChange);
  statusSelect?.addEventListener('change', onFilterChange);

  tableScroll?.addEventListener('scroll', () => renderTable(), { passive: true });
  listScroll?.addEventListener('scroll', () => renderList(), { passive: true });
  splitScroll?.addEventListener('scroll', () => renderSplit(), { passive: true });

  root.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.sort as SortKey;
      if (!key) return;
      const asc = sortKey === key ? !sortAsc : true;
      sortKey = key;
      sortAsc = asc;
      root.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((other) => {
        other.classList.remove('is-sorted-asc', 'is-sorted-desc');
        delete other.dataset.sortDir;
      });
      btn.classList.toggle('is-sorted-asc', asc);
      btn.classList.toggle('is-sorted-desc', !asc);
      btn.dataset.sortDir = asc ? 'asc' : 'desc';
      render();
    });
  });

  document.getElementById('dossier-search-trigger')?.addEventListener('click', () => palette.open());

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      palette.open();
    }
  });

  window.addEventListener('resize', () => render());

  syncFilterUi();

  let initialView: HubView = filters.view;
  if (!urlState.q && !urlState.cat && urlState.status === 'all' && urlState.view === 'table') {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved && isHubView(saved)) initialView = saved;
    } catch {
      /* ignore */
    }
  }
  filters.view = initialView;
  setView(initialView);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDossierHub, { once: true });
} else {
  initDossierHub();
}
