import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const home = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const method = fs.readFileSync(path.join(root, 'dist/method/index.html'), 'utf8');
const enHome = fs.readFileSync(path.join(root, 'dist/en/index.html'), 'utf8');
const introSource = fs.readFileSync(path.join(root, 'src/components/intro/intro.ts'), 'utf8');

const checks = [
  ['Home has intro-curtain', home.includes('id="intro-curtain"')],
  ['Home has ows-entered head script', home.includes('ows-entered')],
  ['Home has sessionStorage bootstrap', home.includes("sessionStorage.getItem('ows_intro')")],
  ['Method excludes intro-curtain', !method.includes('id="intro-curtain"')],
  ['Method body shell-mode', method.includes('class="app-ready shell-mode"') || method.includes('shell-mode')],
  ['EN home has intro-curtain', enHome.includes('id="intro-curtain"')],
  [
    'intro.ts sets storage on enter only',
    introSource.includes("sessionStorage.setItem(STORAGE_INTRO, '1')") &&
      (introSource.match(/sessionStorage\.setItem/g) ?? []).length === 1,
  ],
];

for (const [label, passed] of checks) {
  console.log(`${label}:`, passed);
  if (!passed) process.exitCode = 1;
}
