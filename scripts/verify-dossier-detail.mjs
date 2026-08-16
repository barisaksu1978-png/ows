import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const list = fs.readFileSync(path.join(root, 'dossiers/index.html'), 'utf8');
const tr = fs.readFileSync(path.join(root, 'dossiers/orthodox-axis/index.html'), 'utf8');

console.log('list has orthodox-axis link:', list.includes('href="/dossiers/orthodox-axis/"'));
console.log('TR meta Aktif:', tr.includes('Aktif'));
console.log('TR meta Karma kaynak:', tr.includes('Karma kaynak'));
console.log('TR h3 rendered:', tr.includes('<h3'));
console.log('TR strong kullanım:', tr.includes('<strong>kullanım ekseni</strong>'));
console.log('TR greek:', tr.includes('κανονικῶς αὐτοκέφαλος'));

for (const loc of ['en', 'ru', 'uk', 'el']) {
  const p = path.join(root, loc, 'dossiers/orthodox-axis/index.html');
  console.log(`${loc} exists:`, fs.existsSync(p));
}
