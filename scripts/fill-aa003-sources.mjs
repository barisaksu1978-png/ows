import { readFileSync, writeFileSync } from 'fs';

const pd = {
  tr: 'kamu malı',
  en: 'public domain',
  ru: 'общественное достояние',
  uk: 'суспільне надбання',
  el: 'δημόσιος τομέας',
};

const byImg = {
  'ows-aa-003-c1-dulles-portrait.webp': (p) => ` — NARA (${p})`,
  'ows-aa-003-c2-lbj-senate-1955.webp': (p) => ` — Library of Congress (${p})`,
  'ows-aa-003-c2-knowland-senator.webp': (p) => ` — NIST / U.S. Government (${p})`,
  'ows-aa-003-c3-capitol-switchboard-1959.webp': (p) => ` — Library of Congress (${p})`,
  'ows-aa-003-c4-port-said-tanks-1956.webp': (p) =>
    ` — Wikimedia Commons (${p}, Crown-expired / PD-UKGov)`,
  'ows-aa-003-kronoloji-eden.webp': (p) =>
    ` — Wikimedia Commons (${p}, Crown-expired / PD-UKGov)`,
};

for (const loc of ['tr', 'en', 'ru', 'uk', 'el']) {
  const path = `src/content/dossiers/arayuz-analizleri-suveys/${loc}.md`;
  let s = readFileSync(path, 'utf8');
  const p = pd[loc];
  for (const [img, mk] of Object.entries(byImg)) {
    const esc = img.replace('.', '\\.');
    const re = new RegExp(
      `(<img src="/images/ows-aa-003/${esc}"[^>]*>\\s*<figcaption>[^<]*) — \\[KAYNAK\\] \\([^)]+\\)`,
      'g',
    );
    s = s.replace(re, `$1${mk(p)}`);
  }
  if (s.includes('[KAYNAK]')) throw new Error(`leftover in ${loc}`);
  writeFileSync(path, s);
  console.log('ok', loc);
}
