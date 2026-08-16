import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const atlas = fs.readFileSync(path.join(root, 'atlas/eastern-question-1886/index.html'), 'utf8');
const atlasList = fs.readFileSync(path.join(root, 'atlas/index.html'), 'utf8');
const dossier = fs.readFileSync(path.join(root, 'dossiers/orthodox-axis/index.html'), 'utf8');

console.log('atlas detail has img:', atlas.includes('<img'));
console.log('atlas detail has map_note:', atlas.includes('güncel sınırları değil'));
console.log('atlas detail has dossier link:', atlas.includes('href="/dossiers/orthodox-axis/"'));
console.log('atlas detail has body text:', atlas.includes('Edward Stanford tarafından'));
console.log('atlas list links detail:', atlasList.includes('href="/atlas/eastern-question-1886/"'));
console.log('dossier links atlas detail:', dossier.includes('href="/atlas/eastern-question-1886/"'));

for (const loc of ['en', 'ru', 'uk', 'el']) {
  const p = path.join(root, loc, 'atlas/eastern-question-1886/index.html');
  console.log(`${loc} atlas detail exists:`, fs.existsSync(p));
}
