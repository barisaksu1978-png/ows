const STORAGE_KEY = 'ows_theme';
const MODES = ['system', 'light', 'dark', 'sepia'] as const;
type ThemeMode = (typeof MODES)[number];

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;

export function clockTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR ? 'light' : 'dark';
}

export function resolvedTheme(mode: ThemeMode): 'light' | 'dark' | 'sepia' {
  if (mode === 'system') return clockTheme();
  return mode;
}

function isMode(value: string | undefined): value is ThemeMode {
  return !!value && MODES.includes(value as ThemeMode);
}

function loadMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isMode(stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'light';
}

function save(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

function systemHint(resolved: 'light' | 'dark'): string {
  const root = document.documentElement;
  return resolved === 'light'
    ? root.dataset.themeAutoDay ?? 'Auto — day'
    : root.dataset.themeAutoNight ?? 'Auto — night';
}

function syncButtons(mode: ThemeMode) {
  const glyphs: Record<ThemeMode, string> = {
    system: '◐',
    light: '☀',
    dark: '☾',
    sepia: '◎',
  };
  document.querySelectorAll<HTMLButtonElement>('[data-theme-pick]').forEach((btn) => {
    const pick = btn.dataset.themePick ?? '';
    const active = pick === mode;
    btn.classList.toggle('on', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (pick === 'system') {
      const resolved = resolvedTheme('system');
      btn.title = active ? systemHint(resolved) : btn.dataset.labelAuto ?? btn.title;
    }
  });
  document.querySelectorAll<HTMLElement>('[data-theme-current]').forEach((el) => {
    el.textContent = glyphs[mode];
  });
  document.querySelectorAll<HTMLElement>('.theme-menu__trigger').forEach((el) => {
    const activeBtn = document.querySelector<HTMLButtonElement>(`[data-theme-pick="${mode}"]`);
    if (activeBtn?.title) el.title = activeBtn.title;
  });
}

function apply(mode: ThemeMode) {
  const resolved = resolvedTheme(mode);
  const root = document.documentElement;
  root.setAttribute('data-theme-mode', mode);
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-resolved', resolved);
  syncButtons(mode);
}

function pickTheme(mode: ThemeMode, fromUser = false) {
  if (!isMode(mode)) return;
  const prev = loadMode();
  save(mode);
  apply(mode);
  if (fromUser && mode === 'system') {
    const btn = document.querySelector<HTMLButtonElement>('[data-theme-pick="system"]');
    btn?.classList.add('theme-btn--pulse');
    window.setTimeout(() => btn?.classList.remove('theme-btn--pulse'), 350);
  }
  if (fromUser && mode === 'system' && prev === 'system') {
    /* Zaten otomatik modda — görünür geri bildirim için kısa vurgu */
    document.documentElement.classList.add('theme-auto-flash');
    window.setTimeout(() => document.documentElement.classList.remove('theme-auto-flash'), 300);
  }
}

let clockTimer: ReturnType<typeof setInterval> | null = null;

function startClockWatcher() {
  if (clockTimer) return;
  clockTimer = window.setInterval(() => {
    if (loadMode() === 'system') apply('system');
  }, 30_000);
}

function bindButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-pick]').forEach((btn) => {
    if (btn.dataset.themeBound === '1') return;
    btn.dataset.themeBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pick = btn.dataset.themePick;
      if (isMode(pick)) pickTheme(pick, true);
    });
  });
}

function boot() {
  bindButtons();
  apply(loadMode());
  startClockWatcher();
}

function initTheme() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  document.addEventListener('astro:page-load', boot);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && loadMode() === 'system') apply('system');
  });
}

initTheme();
