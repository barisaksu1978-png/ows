import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

function hrefs(html, pattern) {
  const re = new RegExp(`href="${pattern}[^"]*"`, 'g');
  return [...html.matchAll(re)].map((m) => m[0].slice(6, -1));
}

const dossier = fs.readFileSync(path.join(root, 'dossiers/orthodox-axis/index.html'), 'utf8');
const atlas = fs.readFileSync(path.join(root, 'atlas/eastern-question-1886/index.html'), 'utf8');
const method = fs.readFileSync(path.join(root, 'method/index.html'), 'utf8');

console.log('=== Lang switcher (dossier TR) ===');
const ru = dossier.match(/href="(\/ru\/dossiers\/orthodox-axis\/)"/);
const en = dossier.match(/href="(\/en\/dossiers\/orthodox-axis\/)"/);
console.log('RU link:', ru?.[1] ?? 'MISSING');
console.log('EN link:', en?.[1] ?? 'MISSING');

const dossierEn = fs.readFileSync(path.join(root, 'en/dossiers/orthodox-axis/index.html'), 'utf8');
const trBack = dossierEn.match(/class="lang-btn on"[^>]*href="(\/dossiers\/orthodox-axis\/)"/) ||
  dossierEn.match(/href="(\/dossiers\/orthodox-axis\/)"[^>]*>\s*TR/);
console.log('EN→TR link:', trBack?.[1] ?? (dossierEn.includes('href="/dossiers/orthodox-axis/"') ? '/dossiers/orthodox-axis/' : 'MISSING'));

console.log('\n=== Atlas (TR) ===');
console.log('img:', atlas.includes('<img'));
console.log('dossier link:', atlas.includes('href="/dossiers/orthodox-axis/"'));

console.log('\n=== Dossier body ===');
console.log('h3 sections:', (dossier.match(/<h3 /g) || []).length);
console.log('greek:', dossier.includes('κανονικῶς'));

console.log('\n=== Method lang ===');
console.log('RU method:', method.includes('href="/ru/method/"'));

console.log('\n=== Intro layout ===');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
console.log('intro-bottom wrapper:', home.includes('class="intro-bottom"'));
console.log('enter after coords:', home.indexOf('intro-bottom') < home.indexOf('intro-enter'));
