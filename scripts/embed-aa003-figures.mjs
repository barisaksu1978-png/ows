import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/content/dossiers/arayuz-analizleri-suveys');

const sources = {
  tr: 'C:/Users/lcq/Downloads/arayuz-analizleri-suveys.md',
  en: 'C:/Users/lcq/Downloads/arayuz-analizleri-suveys.en.md',
  ru: 'C:/Users/lcq/Downloads/arayuz-analizleri-suveys.ru.md',
  uk: 'C:/Users/lcq/Downloads/arayuz-analizleri-suveys.uk.md',
  el: 'C:/Users/lcq/Downloads/arayuz-analizleri-suveys.el.md',
};

const dims = {
  'ows-aa-003-c1-dulles-portrait': [200, 298],
  'ows-aa-003-c2-lbj-senate-1955': [800, 1148],
  'ows-aa-003-c2-knowland-senator': [800, 1084],
  'ows-aa-003-c3-capitol-switchboard-1959': [1024, 684],
  'ows-aa-003-c4-port-said-tanks-1956': [1300, 808],
  'ows-aa-003-kronoloji-eden': [761, 1040],
};

const copySuffix = {
  tr: '(kamu malı)',
  en: '(public domain)',
  ru: '(общественное достояние)',
  uk: '(суспільне надбання)',
  el: '(δημόσιος τομέας)',
};

const captions = {
  tr: {
    cover:
      'Eisenhower ve Dulles, 1956 — Süveyş hattının seküler-realist karar çekirdeği; gerekçe hukuk/ittifak/finans, teopolitik değil.',
    c1: 'Dışişleri Bakanı John Foster Dulles — karar dilinin seküler-stratejik yüzü. Pro-İsrail söylem dışarıda mevcuttu ama karar metnine girmedi.',
    c2lbj:
      "Senato Çoğunluk Lideri Lyndon B. Johnson, 1955 — İsrail'e yaptırımlara açık muhalefet. Kanal güçlüydü, karar merkezine ulaştı; sistem onu kullanmadı (D1).",
    c2know:
      'Senato Azınlık Lideri William Knowland — yaptırım ilkesini tüm BM ihlallerine genişletti. Mobilizasyon görünür ve güçlü; etkisi sıfır.',
    c3: 'Capitol telefon santrali (dönem görseli, 1959) — AZCPA telgraf/çağrı kampanyasının altyapısı. Kanal aktifti; taşıyıcılar karar odasının dışındaydı.',
    c4: 'Port Said, 1956 — üçlü askerî harekât. ABD finansal kaldıraçla bu harekâtı geri çekilmeye zorladı; karar lobiye rağmen alındı.',
    kron: 'İngiltere Başbakanı Anthony Eden — millileştirme → Sèvres → taarruz zincirinin Londra ayağı. Lobi en yoğun anda bile karar çizgisini değiştiremedi.',
  },
  en: {
    cover:
      'Eisenhower and Dulles, 1956 — the secular-realist decision core of the Suez line; justification law/alliance/finance, not theopolitical.',
    c1: 'Secretary of State John Foster Dulles — the secular-strategic face of the decision language. Pro-Israel discourse existed on the outside but did not enter the decision text.',
    c2lbj:
      'Senate Majority Leader Lyndon B. Johnson, 1955 — open opposition to sanctions against Israel. The channel was strong and reached the decision center; the system did not use it (D1).',
    c2know:
      'Senate Minority Leader William Knowland — extended the sanctions principle to all UN violations. Mobilization was visible and strong; its effect was zero.',
    c3: 'Capitol telephone switchboard (period image, 1959) — infrastructure of the AZCPA telegram/call campaign. The channel was active; carriers were outside the decision room.',
    c4: 'Port Said, 1956 — tripartite military operation. The US used financial leverage to force this operation to withdraw; the decision was taken despite the lobby.',
    kron: 'British Prime Minister Anthony Eden — the London link in the nationalization → Sèvres → offensive chain. Even at its most intense, the lobby could not change the decision line.',
  },
  ru: {
    cover:
      'Эйзенхауэр и Даллес, 1956 — светско-реалистическое ядро решения по Суэцу; обоснование — право/альянс/финансы, не теополитика.',
    c1: 'Госсекретарь Джон Фостер Даллес — светско-стратегическое лицо языка решения. Произраильский дискурс существовал снаружи, но не вошёл в текст решения.',
    c2lbj:
      'Лидер большинства в Сенате Линдон Б. Джонсон, 1955 — открытая оппозиция санкциям против Израиля. Канал был силён, достиг центра принятия решения; система его не использовала (D1).',
    c2know:
      'Лидер меньшинства в Сенате Уильям Ноуленд — распространил принцип санкций на все нарушения ООН. Мобилизация была видимой и сильной; её эффект нулевой.',
    c3: 'Телефонный коммутатор Капитолия (изображение эпохи, 1959) — инфраструктура телеграфно/звонковой кампании AZCPA. Канал был активен; носители были вне зала решений.',
    c4: 'Порт-Саид, 1956 — тройственная военная операция. США финансовым рычагом вынудили эту операцию к отступлению; решение принято вопреки лобби.',
    kron: 'Премьер-министр Великобритании Энтони Иден — лондонское звено цепи национализация → Севр → наступление. Даже на пике интенсивности лобби не смогло изменить линию решения.',
  },
  uk: {
    cover:
      'Ейзенгауер і Даллес, 1956 — світсько-реалістичне ядро рішення щодо Суецю; обґрунтування — право/альянс/фінанси, не теополітика.',
    c1: 'Держсекретар Джон Фостер Даллес — світсько-стратегічне обличчя мови рішення. Проізраїльський дискурс існував назовні, але не увійшов у текст рішення.',
    c2lbj:
      'Лідер більшості Сенату Ліндон Б. Джонсон, 1955 — відкрита опозиція санкціям проти Ізраїлю. Канал був сильним, досяг центру ухвалення рішення; система його не використала (D1).',
    c2know:
      'Лідер меншості Сенату Вільям Ноуленд — поширив принцип санкцій на всі порушення ООН. Мобілізація була видимою й сильною; її ефект нульовий.',
    c3: "Телефонний комутатор Капітолію (зображення епохи, 1959) — інфраструктура телеграфно/дзвінкової кампанії AZCPA. Канал був активним; носії були поза залою рішень.",
    c4: 'Порт-Саїд, 1956 — потрійна військова операція. США фінансовим важелем змусили цю операцію до відходу; рішення ухвалено попри лобі.',
    kron: 'Прем\'єр-міністр Великої Британії Ентоні Іден — лондонська ланка ланцюга націоналізація → Севр → наступ. Навіть на піку інтенсивності лобі не змогло змінити лінію рішення.',
  },
  el: {
    cover:
      'Άιζενχάουερ και Ντάλες, 1956 — ο κοσμικο-ρεαλιστικός πυρήνας απόφασης για το Σουέζ· αιτιολόγηση νομός/συμμαχία/χρηματοοικονομικά, όχι θεοπολιτική.',
    c1: 'Υπουργός Εξωτερικών Τζον Φόστερ Ντάλες — η κοσμικο-στρατηγική όψη της γλώσσας της απόφασης. Το φιλοϊσραηλινό λόμπι υπήρχε απέξω αλλά δεν εισήλθε στο κείμενο της απόφασης.',
    c2lbj:
      'Ηγέτης πλειοψηφίας της Γερουσίας Λίντον Μπ. Τζόνσον, 1955 — ανοικτή αντίθεση σε κυρώσεις κατά του Ισραήλ. Το κανάλι ήταν ισχυρό, έφτασε στο κέντρο της απόφασης· το σύστημα δεν το χρησιμοποίησε (D1).',
    c2know:
      'Ηγέτης μειοψηφίας της Γερουσίας Γουίλιαμ Νόουλαντ — επέκτασε την αρχή των κυρώσεων σε όλες τις παραβιάσεις του ΟΗΕ. Η κινητοποίηση ήταν ορατή και ισχυρή· το αποτέλεσμα μηδενικό.',
    c3: 'Τηλεφωνικός συνδέτης του Καπιτωλίου (εικόνα εποχής, 1959) — υποδομή της τηλεγραφικής/τηλεφωνικής εκστρατείας AZCPA. Το κανάλι ήταν ενεργό· οι φορείς ήταν εκτός της αίθουσας αποφάσεων.',
    c4: 'Πορτ Σαΐντ, 1956 — τριμερής στρατιωτική επιχείρηση. Οι ΗΠΑ με χρηματοοικονομική μόχλευση ανάγκασαν αυτή την επιχείρηση σε αποχώρηση· η απόφαση ελήφθη παρά το λόμπι.',
    kron: 'Πρωθυπουργός της Βρετανίας Άντονι Ίντεν — το λονδρέζικο ring της αλυσίδας εθνικοποίηση → Σεβρ → επίθεση. Ακόμη και στην κορύφωση της έντασης, το λόμπι δεν μπόρεσε να αλλάξει τη γραμμή της απόφασης.',
  },
};

const alts = {
  c1: {
    tr: 'Dışişleri Bakanı John Foster Dulles portresi',
    en: 'Portrait of Secretary of State John Foster Dulles',
    ru: 'Портрет госсекретаря Джона Фостера Даллеса',
    uk: 'Портрет держсекретаря Джона Фостера Даллеса',
    el: 'Πορτρέτο του υπουργού Εξωτερικών Τζον Φόστερ Ντάλες',
  },
  c2lbj: {
    tr: 'Senato Çoğunluk Lideri Lyndon B. Johnson, 1955',
    en: 'Senate Majority Leader Lyndon B. Johnson, 1955',
    ru: 'Лидер большинства в Сенате Линдон Б. Джонсон, 1955',
    uk: 'Лідер більшості Сенату Ліндон Б. Джонсон, 1955',
    el: 'Ηγέτης πλειοψηφίας της Γερουσίας Λίντον Μπ. Τζόνσον, 1955',
  },
  c2know: {
    tr: 'Senato Azınlık Lideri William Knowland',
    en: 'Senate Minority Leader William Knowland',
    ru: 'Лидер меньшинства в Сенате Уильям Ноуленд',
    uk: 'Лідер меншості Сенату Вільям Ноуленд',
    el: 'Ηγέτης μειοψηφίας της Γερουσίας Γουίλιαμ Νόουλαντ',
  },
  c3: {
    tr: 'Capitol telefon santrali, 1959',
    en: 'Capitol telephone switchboard, 1959',
    ru: 'Телефонный коммутатор Капитолия, 1959',
    uk: 'Телефонний комутатор Капітолію, 1959',
    el: 'Τηλεφωνικός συνδέτης του Καπιτωλίου, 1959',
  },
  c4: {
    tr: 'Port Said, 1956 — üçlü askerî harekât',
    en: 'Port Said, 1956 — tripartite military operation',
    ru: 'Порт-Саид, 1956 — тройственная военная операция',
    uk: 'Порт-Саїд, 1956 — потрійна військова операція',
    el: 'Πορτ Σαΐντ, 1956 — τριμερής στρατιωτική επιχείρηση',
  },
  kron: {
    tr: 'İngiltere Başbakanı Anthony Eden',
    en: 'British Prime Minister Anthony Eden',
    ru: 'Премьер-министр Великобритании Энтони Иден',
    uk: 'Прем\'єр-міністр Великої Британії Ентоні Іден',
    el: 'Πρωθυπουργός της Βρετανίας Άντονι Ίντεν',
  },
};

function fig(file, alt, caption, locale) {
  const [w, h] = dims[file];
  const suffix = copySuffix[locale];
  const esc = (s) => s.replace(/"/g, '&quot;');
  return `\n\n<figure class="ows-figure">\n  <img src="/images/ows-aa-003/${file}.webp" alt="${esc(alt)}" loading="lazy" width="${w}" height="${h}" />\n  <figcaption>${caption} — [KAYNAK] ${suffix}</figcaption>\n</figure>\n`;
}

function parseFm(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter');
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[kv[1]] = v;
  }
  return { fm, body: m[2] };
}

function astroFm(locale, fm) {
  const title = fm.title;
  const summary = fm.description;
  const redTeam = fm.redTeamStatus;
  return `---
code: OWS-AA-003
status: locked
version: '1.0'
evidenceLevel: mixed
riskLevel: medium
redTeamStatus: '${redTeam.replace(/'/g, "''")}'
updated: 2026-06-29
relatedMaps: []
relatedSources: ['OWS-2026-004']
image: aa-003-suveys-cover.webp
imageCaption:
  ${locale}: >-
    ${captions[locale].cover}
title:
  ${locale}: '${title.replace(/'/g, "''")}'
summary:
  ${locale}: >-
    ${summary}
---`;
}

function insertFigures(body, locale) {
  const c = captions[locale];
  const s = copySuffix[locale];
  let b = body;

  const kronMarkers = {
    tr: 'değiştiremedi.',
    en: 'could not change the decision line.',
    ru: 'не смогло изменить линию решения.',
    uk: 'не змогло змінити лінію рішення.',
    el: 'δεν μπόρεσε να αλλάξει τη γραμμή της απόφασης.',
  };
  const c3Markers = {
    tr: 'Kanal aktifti.',
    en: 'The channel was active.',
    ru: 'Канал был активен.',
    uk: 'Канал був активний.',
    el: 'Το κανάλι ήταν ενεργό.',
  };

  b = b.replace(
    kronMarkers[locale],
    kronMarkers[locale] + fig('ows-aa-003-kronoloji-eden', alts.kron[locale], c.kron, locale),
  );
  b = b.replace(
    '[^parameters][^boughton]',
    '[^parameters][^boughton]' + fig('ows-aa-003-c4-port-said-tanks-1956', alts.c4[locale], c.c4, locale),
  );
  b = b.replace(
    c3Markers[locale],
    c3Markers[locale] + fig('ows-aa-003-c3-capitol-switchboard-1959', alts.c3[locale], c.c3, locale),
  );
  b = b.replace(
    '[^upi][^little]',
    '[^upi][^little]' + fig('ows-aa-003-c2-knowland-senator', alts.c2know[locale], c.c2know, locale),
  );
  b = b.replace(
    '[^waging][^lbj][^upi]',
    '[^waging][^lbj][^upi]' + fig('ows-aa-003-c2-lbj-senate-1955', alts.c2lbj[locale], c.c2lbj, locale),
  );
  b = b.replace(
    '[^frus]',
    '[^frus]' + fig('ows-aa-003-c1-dulles-portrait', alts.c1[locale], c.c1, locale),
  );

  if (!b.includes('ows-aa-003-c1-dulles-portrait')) throw new Error(`c1 missing ${locale}`);
  if (!b.includes('ows-aa-003-kronoloji-eden')) throw new Error(`kron missing ${locale}`);
  return b;
}

mkdirSync(outDir, { recursive: true });

for (const [locale, src] of Object.entries(sources)) {
  const raw = readFileSync(src, 'utf8');
  const { fm, body } = parseFm(raw);
  const out = astroFm(locale, fm) + '\n' + insertFigures(body, locale);
  writeFileSync(join(outDir, `${locale}.md`), out, 'utf8');
  console.log(`wrote ${locale}.md`);
}
