/** Lightweight category + search filter for WoT-style dossier portal */
function bootPortalFilter() {
  const chips = document.querySelectorAll<HTMLButtonElement>('.portal-chip[data-filter-cat]');
  const search = document.getElementById('dossier-portal-search') as HTMLInputElement | null;
  const cards = document.querySelectorAll<HTMLAnchorElement>('.portal-card[data-hay]');
  const featured = document.querySelector<HTMLAnchorElement>('.portal-manset');
  const empty = document.getElementById('dossier-portal-empty');
  if (!chips.length) return;

  let activeCat = 'all';

  function applyFilter() {
    const q = (search?.value ?? '').trim().toLowerCase();
    let visible = 0;

    if (featured) {
      const catOk = activeCat === 'all' || featured.dataset.cat === activeCat;
      const hay = `${featured.querySelector('.portal-manset__title')?.textContent ?? ''} ${featured.querySelector('.portal-manset__lead')?.textContent ?? ''} ${featured.textContent ?? ''}`.toLowerCase();
      const qOk = !q || hay.includes(q);
      featured.hidden = !(catOk && qOk);
      if (!featured.hidden) visible += 1;
    }

    cards.forEach((card) => {
      const catOk = activeCat === 'all' || card.dataset.cat === activeCat;
      const hay = card.dataset.hay ?? '';
      const qOk = !q || hay.includes(q);
      const show = catOk && qOk;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible > 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', (ev) => {
      ev.preventDefault();
      activeCat = chip.dataset.filterCat ?? 'all';
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      applyFilter();
    });
  });

  search?.addEventListener('input', applyFilter);
}

bootPortalFilter();
document.addEventListener('astro:page-load', bootPortalFilter);
