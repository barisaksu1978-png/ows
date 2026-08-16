import type { DossierCard } from './dossier-types';
import { searchPalette } from './dossier-engine';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export interface PaletteLabels {
  placeholder: string;
  empty: string;
  hint: string;
}

export function createPalette(
  cards: DossierCard[],
  labels: PaletteLabels,
  onOpen: (href: string) => void,
) {
  const root = document.getElementById('dossier-palette');
  const input = root?.querySelector<HTMLInputElement>('.cmdk__input');
  const list = root?.querySelector<HTMLUListElement>('.cmdk__list');
  const backdrop = root?.querySelector<HTMLButtonElement>('.cmdk__backdrop');
  if (!root || !input || !list || !backdrop) return { open: () => {}, close: () => {} };

  let active = 0;
  let results: DossierCard[] = [];

  function render() {
    results = searchPalette(cards, input!.value);
    active = 0;
    if (!results.length) {
      list!.innerHTML = `<li class="cmdk__empty">${esc(labels.empty)}</li>`;
      return;
    }
    list!.innerHTML = results
      .map(
        (card, i) => `<li>
      <button type="button" class="cmdk__item${i === 0 ? ' is-active' : ''}" data-href="${esc(card.href)}">
        <span class="cmdk__code">${esc(card.code)}</span>
        <span class="cmdk__title">${esc(card.title)}</span>
        <span class="cmdk__meta">${esc(card.statusLabel)} · ${esc(card.categoryLabel)}</span>
      </button>
    </li>`,
      )
      .join('');
  }

  function setActive(idx: number) {
    const items = list!.querySelectorAll<HTMLButtonElement>('.cmdk__item');
    if (!items.length) return;
    active = ((idx % items.length) + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('is-active', i === active));
    items[active]?.scrollIntoView({ block: 'nearest' });
  }

  function openItem(href: string) {
    close();
    onOpen(href);
  }

  function open() {
    root!.hidden = false;
    document.body.classList.add('cmdk-open');
    input!.value = '';
    render();
    requestAnimationFrame(() => input!.focus());
  }

  function close() {
    root!.hidden = true;
    document.body.classList.remove('cmdk-open');
  }

  input.placeholder = labels.placeholder;
  input.addEventListener('input', render);

  list.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.cmdk__item');
    if (btn?.dataset.href) openItem(btn.dataset.href);
  });

  backdrop.addEventListener('click', close);

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const href = results[active]?.href;
      if (href) openItem(href);
    }
  });

  return { open, close };
}
