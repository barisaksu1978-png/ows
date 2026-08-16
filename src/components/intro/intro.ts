const STORAGE_INTRO = 'ows_intro';

function hasEntered(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_INTRO) === '1';
  } catch {
    return false;
  }
}

function enterApp(): void {
  try {
    sessionStorage.setItem(STORAGE_INTRO, '1');
  } catch {
    /* ignore */
  }
  const stage = document.getElementById('intro-stage');
  if (stage) stage.classList.add('hidden');
  const curtain = document.getElementById('intro-curtain');
  if (curtain) curtain.classList.add('done');
  document.body.classList.add('app-ready', 'shell-mode');
}

function initCurtain(): void {
  const intro = document.getElementById('intro-curtain');
  if (!intro) return;

  const EXIT = 'fade';
  const EXIT_AT = 3000;
  const DUR = EXIT === 'curtain' ? 1200 : 900;
  let t1: ReturnType<typeof setTimeout>;
  let t2: ReturnType<typeof setTimeout>;

  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startExit(): void {
    intro!.classList.add(EXIT === 'curtain' ? 'split' : 'fade-exit');
  }

  function run(): void {
    intro!.classList.remove('done', 'split', 'fade-exit');
    clearTimeout(t1);
    clearTimeout(t2);
    t1 = setTimeout(startExit, EXIT_AT);
    t2 = setTimeout(() => {
      intro!.classList.add('done');
    }, EXIT_AT + DUR);
  }

  function finishNow(): void {
    clearTimeout(t1);
    clearTimeout(t2);
    startExit();
    setTimeout(() => {
      intro!.classList.add('done');
    }, DUR);
  }

  const skipBtn = intro.querySelector('.icv-skip');
  skipBtn?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    finishNow();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') finishNow();
  });

  if (reduce) {
    document.documentElement.classList.add('reduced-motion');
    intro.classList.add('done');
    return;
  }

  run();
}

function initIntroScreen(): void {
  const btn = document.getElementById('intro-enter');
  btn?.addEventListener('click', enterApp);
}

function bootstrap(): void {
  // Intro island mounts only on home; inner pages arrive with shell-mode from SSR.
  if (!document.getElementById('intro-curtain')) return;

  if (hasEntered()) {
    enterApp();
    return;
  }

  initCurtain();
  initIntroScreen();
}

bootstrap();
