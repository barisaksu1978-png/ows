import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'src', 'pages');
const locales = ['en', 'ru', 'uk', 'el'];
const routes = [
  { file: 'index.astro', comp: 'HomePage', up: '../../' },
  { file: 'method/index.astro', comp: 'MethodPage', up: '../../../' },
  { file: 'dossiers/index.astro', comp: 'DossiersPage', up: '../../../' },
  {
    file: 'dossiers/[slug]/index.astro',
    up: '../../../../',
    isDynamic: true,
    component: 'DossierDetailPage',
    staticPaths: 'dossierStaticPathsForLocale',
    lib: 'dossiers',
  },
  { file: 'atlas/index.astro', comp: 'AtlasPage', up: '../../../' },
  {
    file: 'atlas/[slug]/index.astro',
    up: '../../../../',
    isDynamic: true,
    component: 'AtlasDetailPage',
    staticPaths: 'atlasStaticPathsForLocale',
    lib: 'atlas',
  },
  { file: 'archive/index.astro', comp: 'ArchivePage', up: '../../../' },
  { file: 'human-ai/index.astro', comp: 'HumanAiPage', up: '../../../' },
  { file: 'about/index.astro', comp: 'AboutPage', up: '../../../' },
];

let count = 0;
for (const loc of locales) {
  for (const r of routes) {
    const dir = path.join(root, loc, path.dirname(r.file));
    fs.mkdirSync(dir, { recursive: true });
    const content = r.isDynamic
      ? `---\nimport ${r.component} from '${r.up}components/pages/${r.component}.astro';\nimport { ${r.staticPaths} } from '${r.up}lib/${r.lib}';\n\nexport const getStaticPaths = ${r.staticPaths}('${loc}');\n\nconst { slug } = Astro.params;\n---\n\n<${r.component} slug={slug!} />\n`
      : `---\nimport Page from '${r.up}components/pages/${r.comp}.astro';\n---\n\n<Page />\n`;
    fs.writeFileSync(path.join(root, loc, r.file), content);
    count++;
  }
}
console.log(`created ${count} locale wrappers`);
