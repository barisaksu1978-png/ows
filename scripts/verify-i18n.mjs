import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const ui = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/ui.json'), 'utf8'));
for (const loc of ['tr', 'en', 'ru', 'uk', 'el']) {
  console.log(`${loc}: ${Object.keys(ui[loc]).length} keys`);
}

const el = ui.el;
console.log('EL nav.human_ai:', el['nav.human_ai']);
console.log('EL not_oracle.title:', el['human_ai.card.not_oracle.title']);

const checks = [
  ['dist/index.html', 'tr home'],
  ['dist/method/index.html', 'tr method'],
  ['dist/en/method/index.html', 'en method'],
  ['dist/el/human-ai/index.html', 'el human-ai'],
];

for (const [rel, label] of checks) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  const footer = html.match(/<footer class="app-footer">([\s\S]*?)<\/footer>/)?.[1] ?? '';
  const ps = [...footer.matchAll(/<p>([^<]+)<\/p>/g)].map((m) => m[1]);
  console.log(`${label} footer (${ps.length} p):`, ps);
}

const trMethod = fs.readFileSync(path.join(root, 'dist/method/index.html'), 'utf8');
console.log('TR HİPOTEZ preserved:', trMethod.includes('HİPOTEZ'));
console.log('TR broken HIPOTEZ:', trMethod.includes('HIPOTEZ'));

const enMethod = fs.readFileSync(path.join(root, 'dist/en/method/index.html'), 'utf8');
console.log('EN FACT:', enMethod.includes('FACT'));

const elHuman = fs.readFileSync(path.join(root, 'dist/el/human-ai/index.html'), 'utf8');
console.log('EL ΤΝ in page:', elHuman.includes('ΤΝ'));

console.log('JSON valid: yes');
