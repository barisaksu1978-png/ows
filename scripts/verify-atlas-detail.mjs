import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const atlas = fs.readFileSync(path.join(root, 'atlas/eastern-question-1886/index.html'), 'utf8');
const atlasList = fs.readFileSync(path.join(root, 'atlas/index.html'), 'utf8');
const dossier = fs.readFileSync(path.join(root, 'dossiers/orthodox-axis/index.html'), 'utf8');

const checks = [
  ['atlas detail has img', atlas.includes('<img')],
  ['atlas detail has canonical warning', atlas.includes('Bu harita tarafsız bir hakem gibi değil')],
  ['atlas detail has dossier link', atlas.includes('href="/dossiers/orthodox-axis/"')],
  ['atlas detail has body text', atlas.includes('Edward Stanford tarafından')],
  ['atlas list links detail', atlasList.includes('href="/atlas/eastern-question-1886/"')],
  ['dossier links atlas detail', dossier.includes('href="/atlas/eastern-question-1886/"')],
];

for (const loc of ['en', 'ru', 'uk', 'el']) {
  const p = path.join(root, loc, 'atlas/eastern-question-1886/index.html');
  checks.push([`${loc} atlas detail exists`, fs.existsSync(p)]);
}

for (const [label, passed] of checks) {
  console.log(`${label}:`, passed);
  if (!passed) process.exitCode = 1;
}
