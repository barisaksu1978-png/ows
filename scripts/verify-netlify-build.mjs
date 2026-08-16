import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function walkHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, acc);
    else if (ent.name === 'index.html') acc.push(p);
  }
  return acc;
}

const pages = walkHtml(dist);
let legacyHits = 0;
let brokenAsset = 0;
let greekOk = false;
const assetRefs = new Set();

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  if (/legacy_source|_legacy/i.test(html)) legacyHits++;
  if (html.includes('κανονικῶς')) greekOk = true;
  for (const m of html.matchAll(/(?:src|href)="(\/_astro\/[^"]+)"/g)) {
    assetRefs.add(m[1]);
  }
}

for (const ref of assetRefs) {
  const fp = path.join(dist, ref.replace(/^\//, '').split('/').join(path.sep));
  if (!fs.existsSync(fp)) {
    brokenAsset++;
    console.log('MISSING ASSET:', ref);
  }
}

console.log('pages:', pages.length);
console.log('legacy refs in dist html:', legacyHits);
console.log('greek preserved:', greekOk);
console.log('broken _astro assets:', brokenAsset);
console.log('_legacy_source folder in dist:', fs.existsSync(path.join(dist, '_legacy_source')));
