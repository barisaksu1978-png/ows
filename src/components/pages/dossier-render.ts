import type { DossierCard } from './dossier-types';
import { ROW_HEIGHT, VIRTUAL_OVERSCAN } from './dossier-types';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

export function tableRowHtml(card: DossierCard): string {
  return `<tr class="notion-db__row" tabindex="0" data-href="${esc(card.href)}">
    <td class="notion-col notion-col--code">${esc(card.code)}</td>
    <td class="notion-col notion-col--title">
      <span class="notion-db__doc">
        <span class="notion-db__doc-icon" aria-hidden="true"></span>
        <span class="notion-db__doc-title">${esc(card.title)}</span>
      </span>
    </td>
    <td class="notion-col notion-col--status">
      <span class="notion-pill notion-pill--status notion-pill--${esc(card.status)}">${esc(card.statusLabel)}</span>
    </td>
    <td class="notion-col notion-col--evidence">
      <span class="notion-pill notion-pill--evidence notion-pill--${esc(card.evidenceLevel)}">${esc(card.evidenceLabel)}</span>
    </td>
    <td class="notion-col notion-col--risk">
      <span class="notion-pill notion-pill--risk notion-pill--${esc(card.riskLevel)}">${esc(card.riskLabel)}</span>
    </td>
    <td class="notion-col notion-col--category">
      <span class="notion-pill notion-pill--category">${esc(card.categoryLabel)}</span>
    </td>
    <td class="notion-col notion-col--date">${esc(card.updated)}</td>
  </tr>`;
}

export function listRowHtml(card: DossierCard): string {
  return `<a class="dossier-row" href="${esc(card.href)}">
    <span class="dossier-row__code">${esc(card.code)}</span>
    <span class="dossier-row__title">${esc(card.title)}</span>
    <span class="dossier-row__status tag tag--read">${esc(card.statusLabel)}</span>
    <span class="dossier-row__meta">${esc(card.evidenceLabel)}</span>
    <span class="dossier-row__date">${esc(card.updated)}</span>
  </a>`;
}

export function splitRowHtml(card: DossierCard, selected: boolean): string {
  return `<div class="dossier-split-item${selected ? ' is-selected' : ''}" tabindex="0" data-slug="${esc(card.slug)}">
    <span class="dossier-split-item__code">${esc(card.code)}</span>
    <span class="dossier-split-item__title">${esc(card.title)}</span>
    <span class="dossier-split-item__date">${esc(card.updated)}</span>
  </div>`;
}

function virtualSlice(cards: DossierCard[], scrollTop: number, clientHeight: number) {
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - VIRTUAL_OVERSCAN);
  const visible = Math.ceil(clientHeight / ROW_HEIGHT) + VIRTUAL_OVERSCAN * 2;
  const end = Math.min(cards.length, start + visible);
  const padTop = start * ROW_HEIGHT;
  const padBot = Math.max(0, (cards.length - end) * ROW_HEIGHT);
  return { start, end, padTop, padBot, slice: cards.slice(start, end) };
}

export function renderVirtualTable(
  tbody: HTMLElement,
  cards: DossierCard[],
  scrollTop: number,
  clientHeight: number,
) {
  const { start, end, padTop, padBot, slice } = virtualSlice(cards, scrollTop, clientHeight);
  const parts: string[] = [];
  if (padTop > 0) parts.push(`<tr class="virtual-pad" aria-hidden="true"><td colspan="7" style="height:${padTop}px;padding:0;border:none"></td></tr>`);
  for (const card of slice) parts.push(tableRowHtml(card));
  if (padBot > 0) parts.push(`<tr class="virtual-pad" aria-hidden="true"><td colspan="7" style="height:${padBot}px;padding:0;border:none"></td></tr>`);
  tbody.innerHTML = parts.join('');
  tbody.dataset.virtualStart = String(start);
  tbody.dataset.virtualEnd = String(end);
}

export function renderVirtualList(
  container: HTMLElement,
  cards: DossierCard[],
  scrollTop: number,
  clientHeight: number,
) {
  const { padTop, padBot, slice } = virtualSlice(cards, scrollTop, clientHeight);
  const parts: string[] = [];
  if (padTop > 0) parts.push(`<div class="virtual-pad" style="height:${padTop}px" aria-hidden="true"></div>`);
  for (const card of slice) parts.push(listRowHtml(card));
  if (padBot > 0) parts.push(`<div class="virtual-pad" style="height:${padBot}px" aria-hidden="true"></div>`);
  container.innerHTML = parts.join('');
}

export function renderVirtualSplit(
  container: HTMLElement,
  cards: DossierCard[],
  scrollTop: number,
  clientHeight: number,
  selectedSlug: string | null,
) {
  const { padTop, padBot, slice } = virtualSlice(cards, scrollTop, clientHeight);
  const parts: string[] = [];
  if (padTop > 0) parts.push(`<div class="virtual-pad" style="height:${padTop}px" aria-hidden="true"></div>`);
  for (const card of slice) parts.push(splitRowHtml(card, card.slug === selectedSlug));
  if (padBot > 0) parts.push(`<div class="virtual-pad" style="height:${padBot}px" aria-hidden="true"></div>`);
  container.innerHTML = parts.join('');
}

export function totalScrollHeight(count: number): number {
  return count * ROW_HEIGHT;
}
