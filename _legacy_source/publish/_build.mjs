import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUB = __dirname;

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function copy(src, dest) {
  if (!fs.existsSync(src)) { console.warn('skip missing', src); return false; }
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}
function write(rel, content) {
  const dest = path.join(PUB, rel);
  mkdirp(path.dirname(dest));
  fs.writeFileSync(dest, content, 'utf8');
}

['assets/css','assets/js','assets/img','assets/stamps','assets/maps',
 'data','content/pages','content/dossiers','content/atlas','content/archive'].forEach(d =>
  mkdirp(path.join(PUB, d)));

// static copies
copy(path.join(ROOT, 'assets/css/tokens.css'), path.join(PUB, 'assets/css/tokens.css'));
copy(path.join(ROOT, 'assets/css/intro-curtain.css'), path.join(PUB, 'assets/css/intro-curtain.css'));
copy(path.join(ROOT, 'assets/css/intro-screen.css'), path.join(PUB, 'assets/css/intro-screen.css'));
copy(path.join(ROOT, 'data/translations.json'), path.join(PUB, 'data/translations.json'));
if (!copy(path.join(ROOT, 'assets/stamps/stamp_cartographus_mentis.png'), path.join(PUB, 'assets/stamps/stamp_cartographus_mentis.png')))
  copy(path.join(ROOT, 'stamp_cartographus_mentis.png'), path.join(PUB, 'assets/stamps/stamp_cartographus_mentis.png'));
copy(path.join(ROOT, 'assets/img/ows.png'), path.join(PUB, 'assets/img/ows.png'));

// extract intro from index_modular.html
const modular = fs.readFileSync(path.join(ROOT, 'index_modular.html'), 'utf8');
const curtainRe = /<div id="intro-curtain"[\s\S]*?<\/div>\s*\n\s*\n/;
const introRe = /<section class="screen scr show" id="intro">[\s\S]*?<\/section>/;
const curtainMatch = modular.match(curtainRe);
const introMatch = modular.match(introRe);
if (!curtainMatch || !introMatch) throw new Error('intro blocks not found');
const curtainHtml = curtainMatch[0].trim();
let introHtml = introMatch[0]
  .replace('class="screen scr show" id="intro"', 'class="screen scr show" id="intro"')
  .replace('class="enter" type="button" data-go="home"', 'class="enter" type="button" id="intro-enter"');

const indexHtml = `<!DOCTYPE html>
<html lang="tr" data-i18n-title="meta.title">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Tarih, teoloji, jeopolitik ve medeniyet hafızasını kanıt, harita, kaynak ve karşı-argüman disipliniyle inceleyen açık araştırma masası." data-i18n-content="meta.description">
<title>Open War Studies</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/pages.css">
<link rel="stylesheet" href="assets/css/intro-curtain.css">
<link rel="stylesheet" href="assets/css/intro-screen.css">
</head>
<body>

${curtainHtml}

<div id="intro-stage">
${introHtml}
</div>

<div class="app-shell">
  <header class="app-header">
    <div class="app-brand">
      <img class="app-logo" src="assets/img/ows.png" alt="" aria-hidden="true" width="40" height="40" onerror="this.hidden=true">
      <span class="site-name" data-i18n="brand.name">Open War Studies</span>
    </div>
    <nav class="app-nav" data-i18n-attr="aria-label:nav.aria_label" aria-label="Ana menü">
      <a class="nav-link" href="#home" data-route="home"><span class="nt" data-i18n="nav.home">Ana Sayfa</span></a>
      <a class="nav-link" href="#method" data-route="method"><span class="nt" data-i18n="nav.method">Yöntem</span></a>
      <a class="nav-link" href="#dossiers" data-route="dossiers"><span class="nt" data-i18n="nav.dossiers">Dosyalar</span></a>
      <a class="nav-link" href="#atlas" data-route="atlas"><span class="nt" data-i18n="nav.atlas">Atlas</span></a>
      <a class="nav-link" href="#archive" data-route="archive"><span class="nt" data-i18n="nav.archive">Arşiv</span></a>
      <a class="nav-link" href="#human-ai" data-route="human-ai"><span class="nt" data-i18n="nav.human_ai">İnsan–AI Masası</span></a>
      <a class="nav-link" href="#about" data-route="about"><span class="nt" data-i18n="nav.about">Hakkında</span></a>
    </nav>
    <div class="lang-switcher" role="group" aria-label="Language">
      <button type="button" class="lang-btn on" data-lang="tr">TR</button>
      <button type="button" class="lang-btn" data-lang="en">EN</button>
      <button type="button" class="lang-btn" data-lang="ru">RU</button>
      <button type="button" class="lang-btn" data-lang="uk">UK</button>
      <button type="button" class="lang-btn" data-lang="el">EL</button>
    </div>
  </header>

  <main class="app-main">
    <div id="route-root" aria-live="polite">
      <article class="page page-home">
        <div class="page-label" data-i18n="home.label">Ana Sayfa · Eşik</div>
        <h1 data-i18n="home.title">Open War Studies</h1>
        <blockquote class="page-quote" data-i18n="home.claim">Çatışma fikirler arasındadır. Kanıt hakemdir.</blockquote>
        <p class="page-lead" data-i18n="home.lead">Open War Studies; tarih, teoloji, jeopolitik ve medeniyet hafızası alanlarında iddiaları kanıt, harita, kaynak ve karşı-argüman disiplini altında inceleyen dijital bir Kanıt Mahkemesi'dir.</p>
      </article>
    </div>
  </main>

  <footer class="app-footer">
    <p data-i18n="footer.tagline">Open War Studies · Kanıt hakemdir</p>
    <p data-i18n="footer.note">İddialar değişebilir; kanıt yükü kalır.</p>
  </footer>
</div>

<script src="assets/js/i18n.js"></script>
<script src="assets/js/content-loader.js"></script>
<script src="assets/js/router.js"></script>
<script src="assets/js/intro.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
`;

write('index.html', indexHtml);
console.log('publish/index.html written');
console.log('intro section bytes:', introHtml.length);
