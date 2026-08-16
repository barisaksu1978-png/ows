const AUTO_MS = 5500;

function bootHomeManset() {
  const root = document.querySelector('.home-manset--slider');
  if (!root) return;
  if (root.dataset.mansetBooted === '1') return;
  root.dataset.mansetBooted = '1';

  const slides = [...root.querySelectorAll<HTMLElement>('.home-manset__slide')];
  const cells = [...root.querySelectorAll<HTMLButtonElement>('.manset-matrix__cell')];
  if (!slides.length || !cells.length) return;

  let current = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let paused = false;

  function show(index: number) {
    current = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === current;
      slide.classList.toggle('is-active', on);
      slide.hidden = !on;
    });
    cells.forEach((cell, i) => {
      const on = i === current;
      cell.classList.toggle('is-active', on);
      cell.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    stopAuto();
    if (paused || slides.length < 2) return;
    timer = setInterval(() => {
      show(current + 1);
    }, AUTO_MS);
  }

  function goTo(index: number) {
    show(index);
    startAuto();
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const idx = Number(cell.dataset.matrixIndex ?? '0');
      if (!Number.isNaN(idx)) goTo(idx);
    });
  });

  root.addEventListener('mouseenter', () => {
    paused = true;
    stopAuto();
  });
  root.addEventListener('mouseleave', () => {
    paused = false;
    startAuto();
  });
  root.addEventListener('focusin', () => {
    paused = true;
    stopAuto();
  });
  root.addEventListener('focusout', () => {
    if (!root.contains(document.activeElement)) {
      paused = false;
      startAuto();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else if (!paused) startAuto();
  });

  show(0);
  startAuto();
}

bootHomeManset();
document.addEventListener('astro:page-load', bootHomeManset);
