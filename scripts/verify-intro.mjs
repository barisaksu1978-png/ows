import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const home = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const method = fs.readFileSync(path.join(root, 'dist/method/index.html'), 'utf8');
const enHome = fs.readFileSync(path.join(root, 'dist/en/index.html'), 'utf8');

console.log('Home has intro-curtain:', home.includes('id="intro-curtain"'));
console.log('Home has ows_entered head script:', home.includes("ows_entered"));
console.log('Home has sessionStorage bootstrap:', home.includes("sessionStorage.getItem('ows_intro')"));

console.log('Method has intro-curtain:', method.includes('id="intro-curtain"'));
console.log('Method body shell-mode:', method.includes('class="app-ready shell-mode"') || method.includes('shell-mode'));

console.log('EN home has intro-curtain:', enHome.includes('id="intro-curtain"'));

console.log('intro.ts sets storage on enter only:', !fs.readFileSync(path.join(root, 'src/components/intro/intro.ts'), 'utf8').includes('sessionStorage.setItem(STORAGE_INTRO, \'1\')') || fs.readFileSync(path.join(root, 'src/components/intro/intro.ts'), 'utf8').match(/sessionStorage\.setItem/g)?.length === 1);
