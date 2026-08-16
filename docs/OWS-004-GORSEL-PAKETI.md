# OWS-2026-004 — Görsel Entegrasyon Paketi
**ABD Dış Politikası 1776–2026 · Forensic + Kamu register'ları**
Hazırlayan: Synthesius · 27.06.2026

> **KULLANIM:** Bu dosyayı `ows` reposunun köküne kaydet (örn. `docs/OWS-004-GORSEL-PAKETI.md`).
> Sonra en alttaki **CURSOR GÖREVİ**'ni Cursor agent'a yapıştır. Cursor bu dosyayı okuyup uygular.
> Görseller zaten `public/images/ows-004/` içinde (19 adet). Bu paket onları metne gömer.

---

## 0. TASARIM KARARLARI (gerekçeli)

- **`alt`** = betimleme (erişilebilirlik + görsel-SEO). **`figcaption`** = olay + tarih + kaynak.
- **Kaynak etiketi caption'da kalır** (NARA/LOC/NHHC vb.) — kanıt-disiplini gereği.
- **Forensic register:** TÜM görseller (belge taramaları + fotoğraflar). Kanıt gösterir.
- **Kamu (popüler) register:** SADECE fotoğraflar — belge taraması girmez (anlatıyı boğar).
- **`002-american-progress` KULLANILMAZ** — `011-manifest-destiny` ile aynı görsel (mükerrer). 011 daha hafif, o kalır.
- **Lazy-load:** Hero hariç tüm görsellerde `loading="lazy"` (performans + bandwidth/kredi koruması).
- **`width`/`height` zorunlu:** layout shift (CLS) önler, SEO'ya olumlu.

---

## 1. FIGURE ŞABLONU

Her görsel için (Hero hariç):

```html
<figure class="ows-figure">
  <img src="/images/ows-004/DOSYA-ADI.webp" alt="ALT-METNI" loading="lazy" width="W" height="H" />
  <figcaption>CAPTION-METNI</figcaption>
</figure>
```

Hero (yalnız `001`): `loading="lazy"` yerine `loading="eager"`, sınıf `ows-figure ows-hero`.

`W`/`H` değerleri her görselin yanında §3'te verilmiştir.

---

## 2. YERLEŞİM HARİTASI

### FORENSIC register (19 görsel, kronolojik)

| # | Dosya | Boyut (WxH) | Yerleşim — hangi bölüm/paragrafın ARDINA |
|---|---|---|---|
| Hero | `001-cover-declaration` | 1641×2000 | `# Yönetici Özeti` başlığının HEMEN ÜSTÜNE |
| 1 | `003-constitution` | 1083×1312 | `# Genel Çerçeve ve Metodoloji` giriş paragrafının ardına |
| 2 | `011-manifest-destiny` | 1600×1229 | `# Birinci Bölüm` / Dönem 1.2 açılışına (kıtasal genişleme) |
| 3 | `005-treaty-ghent` | 500×803 | Gent Antlaşması (1814) paragrafının ardına |
| 4 | `008-monroe-doctrine` | 500×815 | Monroe Doktrini (1823) paragrafının ardına |
| 5 | `010-ornamental-us-mexico` | 768×1032 | Meksika Savaşı / 1846 toprak kazanımı paragrafının ardına |
| 6 | `013-uss-maine` | 743×490 | İspanya-Amerika Savaşı / 1898 paragrafının ardına |
| 7 | `014-panama-canal` | 1024×528 | Roosevelt Sonuç İlkesi / projeksiyon (1904) paragrafının ardına |
| 8 | `015-wilson-war-message` | 500×773 | Wilson savaş mesajı (1917) paragrafının ardına |
| 9 | `017-atlantic-charter` | 428×600 | Atlantik Şartı / Lend-Lease (1941) paragrafının ardına |
| 10 | `019-pearl-harbor` | 1200×944 | Pearl Harbor / 1941 paragrafının ardına |
| 11 | `024-truman-doctrine` | 500×778 | Truman Doktrini (1947) paragrafının ardına |
| 12 | `025-marshall-plan` | 500×757 | Marshall Planı (1947) paragrafının ardına |
| 13 | `027-north-atlantic-treaty` | 1188×1600 | NATO / Kuzey Atlantik Antlaşması (1949) paragrafının ardına |
| 14 | `058-nato-signature-page` | 1175×1600 | 027'nin HEMEN ARDINA (imza sayfası) |
| 15 | `029-korean-paratroopers` | 1018×800 | Kore Savaşı (1950) paragrafının ardına |
| 16 | `030-tonkin-gulf` | 500×751 | Tonkin Körfezi Kararı (1964) paragrafının ardına |
| 17 | `036-reagan-berlin-wall` | 480×320 | Reagan / Berlin Duvarı (1987) paragrafının ardına |
| 18 | `038-desert-storm` | 1550×1240 | `# Üçüncü Bölüm` / Körfez Savaşı (1991) paragrafının ardına |

> **ANCHOR NOTU:** Birinci Bölüm paragrafları kaynak metinde net (Dönem 1.1–1.5). İkinci/Üçüncü Bölüm için: ilgili olayın/tarihin geçtiği paragrafı bul, figure'ı o paragrafın ARDINA koy. Tablo/başlık ortasına ASLA girme.
> **Bölüm 4 (Sentez) görsel ALMAZ** — karşılaştırma metni, fotoğraf akışı bozar.

### KAMU register (7 fotoğraf — yalnız fotoğraflar, belge taraması YOK)

`001-cover-declaration` (hero) · `011-manifest-destiny` · `013-uss-maine` · `014-panama-canal` · `019-pearl-harbor` · `029-korean-paratroopers` · `038-desert-storm`

Kamu register'ında bunları anlatının ilgili yerine, aynı şablon + aynı dil-uyumlu alt/caption ile yerleştir. Belge taramaları (Monroe, Wilson, Truman, NATO sayfası vb.) Kamu'ya GİRMEZ.

---

## 3. ALT + CAPTION — 5 DİL (tr / en / ru / uk / el)

> Her dilin metni O DİLİN dosyasına gider: `tr.md` → TR, `en.md` → EN, `ru.md` → RU, `uk.md` → UK, `el.md` → EL.

### 001-cover-declaration (Hero) — 1641×2000
- **alt** — tr: `ABD Bağımsızlık Bildirgesi'nin orijinal el yazmalı belgesi` · en: `Original handwritten document of the U.S. Declaration of Independence` · ru: `Оригинал рукописного документа Декларации независимости США` · uk: `Оригінал рукописного документа Декларації незалежності США` · el: `Πρωτότυπο χειρόγραφο έγγραφο της Διακήρυξης Ανεξαρτησίας των ΗΠΑ`
- **caption** — tr: `Bağımsızlık Bildirgesi, 1776 — Kaynak: NARA (kamu malı)` · en: `Declaration of Independence, 1776 — Source: NARA (public domain)` · ru: `Декларация независимости, 1776 — Источник: NARA (общественное достояние)` · uk: `Декларація незалежності, 1776 — Джерело: NARA (суспільне надбання)` · el: `Διακήρυξη Ανεξαρτησίας, 1776 — Πηγή: NARA (κοινό κτήμα)`

### 003-constitution — 1083×1312
- **alt** — tr: `ABD Anayasası'nın birinci maddesini içeren orijinal belge sayfası` · en: `Original document page containing Article One of the U.S. Constitution` · ru: `Оригинальная страница документа со Статьёй первой Конституции США` · uk: `Оригінальна сторінка документа зі Статтею першою Конституції США` · el: `Πρωτότυπη σελίδα εγγράφου με το Άρθρο Πρώτο του Συντάγματος των ΗΠΑ`
- **caption** — tr: `ABD Anayasası, I. Madde, 1787 — Kaynak: NARA (kamu malı)` · en: `U.S. Constitution, Article I, 1787 — Source: NARA (public domain)` · ru: `Конституция США, Статья I, 1787 — Источник: NARA (общественное достояние)` · uk: `Конституція США, Стаття I, 1787 — Джерело: NARA (суспільне надбання)` · el: `Σύνταγμα των ΗΠΑ, Άρθρο I, 1787 — Πηγή: NARA (κοινό κτήμα)`

### 011-manifest-destiny — 1600×1229
- **alt** — tr: `John Gast'ın batıya genişlemeyi simgeleyen "Amerikan İlerleyişi" tablosu` · en: `John Gast's painting "American Progress" symbolizing westward expansion` · ru: `Картина Джона Гаста «Американский прогресс», символизирующая экспансию на запад` · uk: `Картина Джона Ґаста «Американський поступ», що символізує експансію на захід` · el: `Ο πίνακας του Τζον Γκαστ «Αμερικανική Πρόοδος» που συμβολίζει την επέκταση προς τη Δύση`
- **caption** — tr: `"Amerikan İlerleyişi" (Manifest Destiny), 1872 — Kaynak: Library of Congress (kamu malı)` · en: `"American Progress" (Manifest Destiny), 1872 — Source: Library of Congress (public domain)` · ru: `«Американский прогресс» (Manifest Destiny), 1872 — Источник: Library of Congress (общественное достояние)` · uk: `«Американський поступ» (Manifest Destiny), 1872 — Джерело: Library of Congress (суспільне надбання)` · el: `«Αμερικανική Πρόοδος» (Manifest Destiny), 1872 — Πηγή: Library of Congress (κοινό κτήμα)`

### 005-treaty-ghent — 500×803
- **alt** — tr: `Gent Antlaşması'nın el yazmalı tarihî belge sayfası` · en: `Handwritten historical page of the Treaty of Ghent` · ru: `Рукописная историческая страница Гентского договора` · uk: `Рукописна історична сторінка Гентського договору` · el: `Χειρόγραφη ιστορική σελίδα της Συνθήκης της Γάνδης`
- **caption** — tr: `Gent Antlaşması, 1814 — Kaynak: NARA (kamu malı)` · en: `Treaty of Ghent, 1814 — Source: NARA (public domain)` · ru: `Гентский договор, 1814 — Источник: NARA (общественное достояние)` · uk: `Гентський договір, 1814 — Джерело: NARA (суспільне надбання)` · el: `Συνθήκη της Γάνδης, 1814 — Πηγή: NARA (κοινό κτήμα)`

### 008-monroe-doctrine — 500×815
- **alt** — tr: `Monroe Doktrini'ni içeren başkanlık mesajının el yazmalı sayfası` · en: `Handwritten page of the presidential message containing the Monroe Doctrine` · ru: `Рукописная страница президентского послания с Доктриной Монро` · uk: `Рукописна сторінка президентського послання з Доктриною Монро` · el: `Χειρόγραφη σελίδα του προεδρικού μηνύματος με το Δόγμα Μονρόε`
- **caption** — tr: `Monroe Doktrini başkanlık mesajı, 1823 — Kaynak: NARA (kamu malı)` · en: `Monroe Doctrine presidential message, 1823 — Source: NARA (public domain)` · ru: `Президентское послание с Доктриной Монро, 1823 — Источник: NARA (общественное достояние)` · uk: `Президентське послання з Доктриною Монро, 1823 — Джерело: NARA (суспільне надбання)` · el: `Προεδρικό μήνυμα του Δόγματος Μονρόε, 1823 — Πηγή: NARA (κοινό κτήμα)`

### 010-ornamental-us-mexico — 768×1032
- **alt** — tr: `1846 ABD-Meksika sınırını gösteren süslemeli tarihî harita` · en: `Ornamental historical map showing the 1846 U.S.–Mexico boundary` · ru: `Орнаментальная историческая карта границы США и Мексики 1846 года` · uk: `Орнаментальна історична карта кордону США та Мексики 1846 року` · el: `Διακοσμητικός ιστορικός χάρτης των συνόρων ΗΠΑ–Μεξικού του 1846`
- **caption** — tr: `ABD–Meksika sınır haritası, 1846 — Kaynak: Internet Archive (kamu malı)` · en: `U.S.–Mexico boundary map, 1846 — Source: Internet Archive (public domain)` · ru: `Карта границы США–Мексики, 1846 — Источник: Internet Archive (общественное достояние)` · uk: `Карта кордону США–Мексики, 1846 — Джерело: Internet Archive (суспільне надбання)` · el: `Χάρτης συνόρων ΗΠΑ–Μεξικού, 1846 — Πηγή: Internet Archive (κοινό κτήμα)`

### 013-uss-maine — 743×490
- **alt** — tr: `USS Maine zırhlısının enkazında yürütülen dalış ve kurtarma çalışması, siyah-beyaz arşiv fotoğrafı` · en: `Black-and-white archival photo of diving and salvage work on the wreck of the USS Maine` · ru: `Чёрно-белое архивное фото водолазных и спасательных работ на обломках USS Maine` · uk: `Чорно-біле архівне фото водолазних і рятувальних робіт на уламках USS Maine` · el: `Ασπρόμαυρη αρχειακή φωτογραφία καταδυτικών εργασιών στο ναυάγιο του USS Maine`
- **caption** — tr: `USS Maine enkazı, 1898 — Kaynak: NHHC (kamu malı)` · en: `Wreck of the USS Maine, 1898 — Source: NHHC (public domain)` · ru: `Обломки USS Maine, 1898 — Источник: NHHC (общественное достояние)` · uk: `Уламки USS Maine, 1898 — Джерело: NHHC (суспільне надбання)` · el: `Ναυάγιο του USS Maine, 1898 — Πηγή: NHHC (κοινό κτήμα)`

### 014-panama-canal — 1024×528
- **alt** — tr: `Panama Kanalı inşaatını gösteren tarihî stereoskopik fotoğraf` · en: `Historical stereoscopic photograph of the Panama Canal construction` · ru: `Историческая стереоскопическая фотография строительства Панамского канала` · uk: `Історична стереоскопічна фотографія будівництва Панамського каналу` · el: `Ιστορική στερεοσκοπική φωτογραφία της κατασκευής της Διώρυγας του Παναμά`
- **caption** — tr: `Panama Kanalı inşaatı — Kaynak: Library of Congress (kamu malı)` · en: `Panama Canal construction — Source: Library of Congress (public domain)` · ru: `Строительство Панамского канала — Источник: Library of Congress (общественное достояние)` · uk: `Будівництво Панамського каналу — Джерело: Library of Congress (суспільне надбання)` · el: `Κατασκευή της Διώρυγας του Παναμά — Πηγή: Library of Congress (κοινό κτήμα)`

### 015-wilson-war-message — 500×773
- **alt** — tr: `Wilson'ın savaş mesajını içeren Kongre belgesinin el yazmalı sayfası` · en: `Handwritten page of the congressional document containing Wilson's war message` · ru: `Рукописная страница документа Конгресса с военным посланием Вильсона` · uk: `Рукописна сторінка документа Конгресу з військовим посланням Вільсона` · el: `Χειρόγραφη σελίδα του εγγράφου του Κογκρέσου με το πολεμικό μήνυμα του Ουίλσον`
- **caption** — tr: `Wilson'ın savaş mesajı, 1917 — Kaynak: NARA (kamu malı)` · en: `Wilson's war message, 1917 — Source: NARA (public domain)` · ru: `Военное послание Вильсона, 1917 — Источник: NARA (общественное достояние)` · uk: `Військове послання Вільсона, 1917 — Джерело: NARA (суспільне надбання)` · el: `Πολεμικό μήνυμα του Ουίλσον, 1917 — Πηγή: NARA (κοινό κτήμα)`

### 017-atlantic-charter — 428×600
- **alt** — tr: `Atlantik Şartı'nın resmî metin belgesi` · en: `Official text document of the Atlantic Charter` · ru: `Официальный текстовый документ Атлантической хартии` · uk: `Офіційний текстовий документ Атлантичної хартії` · el: `Επίσημο κείμενο του Χάρτη του Ατλαντικού`
- **caption** — tr: `Atlantik Şartı, 1941 — Kaynak: NARA (kamu malı)` · en: `Atlantic Charter, 1941 — Source: NARA (public domain)` · ru: `Атлантическая хартия, 1941 — Источник: NARA (общественное достояние)` · uk: `Атлантична хартія, 1941 — Джерело: NARA (суспільне надбання)` · el: `Χάρτης του Ατλαντικού, 1941 — Πηγή: NARA (κοινό κτήμα)`

### 019-pearl-harbor — 1200×944
- **alt** — tr: `Pearl Harbor saldırısında batan USS Arizona zırhlısı, siyah-beyaz arşiv fotoğrafı` · en: `Black-and-white archival photo of the battleship USS Arizona sunk in the Pearl Harbor attack` · ru: `Чёрно-белое архивное фото линкора USS Arizona, потопленного при атаке на Пёрл-Харбор` · uk: `Чорно-біле архівне фото лінкора USS Arizona, потопленого під час атаки на Перл-Гарбор` · el: `Ασπρόμαυρη αρχειακή φωτογραφία του θωρηκτού USS Arizona που βυθίστηκε στην επίθεση στο Περλ Χάρμπορ`
- **caption** — tr: `USS Arizona, Pearl Harbor, 1941 — Kaynak: NARA (kamu malı)` · en: `USS Arizona, Pearl Harbor, 1941 — Source: NARA (public domain)` · ru: `USS Arizona, Пёрл-Харбор, 1941 — Источник: NARA (общественное достояние)` · uk: `USS Arizona, Перл-Гарбор, 1941 — Джерело: NARA (суспільне надбання)` · el: `USS Arizona, Περλ Χάρμπορ, 1941 — Πηγή: NARA (κοινό κτήμα)`

### 024-truman-doctrine — 500×778
- **alt** — tr: `Truman'ın Kongre'ye Truman Doktrini konuşmasını içeren resmî belge sayfası` · en: `Official document page of Truman's Truman Doctrine address to Congress` · ru: `Официальная страница документа с обращением Трумэна к Конгрессу (Доктрина Трумэна)` · uk: `Офіційна сторінка документа зі зверненням Трумена до Конгресу (Доктрина Трумена)` · el: `Επίσημη σελίδα εγγράφου της ομιλίας Τρούμαν στο Κογκρέσο (Δόγμα Τρούμαν)`
- **caption** — tr: `Truman Doktrini konuşması, 1947 — Kaynak: NARA (kamu malı)` · en: `Truman Doctrine address, 1947 — Source: NARA (public domain)` · ru: `Речь о Доктрине Трумэна, 1947 — Источник: NARA (общественное достояние)` · uk: `Промова про Доктрину Трумена, 1947 — Джерело: NARA (суспільне надбання)` · el: `Ομιλία του Δόγματος Τρούμαν, 1947 — Πηγή: NARA (κοινό κτήμα)`

### 025-marshall-plan — 500×757
- **alt** — tr: `Marshall Planı'na ilişkin resmî belge sayfası` · en: `Official document page relating to the Marshall Plan` · ru: `Официальная страница документа, относящегося к Плану Маршалла` · uk: `Офіційна сторінка документа щодо Плану Маршалла` · el: `Επίσημη σελίδα εγγράφου σχετικά με το Σχέδιο Μάρσαλ`
- **caption** — tr: `Marshall Planı belgesi, 1947 — Kaynak: NARA (kamu malı)` · en: `Marshall Plan document, 1947 — Source: NARA (public domain)` · ru: `Документ Плана Маршалла, 1947 — Источник: NARA (общественное достояние)` · uk: `Документ Плану Маршалла, 1947 — Джерело: NARA (суспільне надбання)` · el: `Έγγραφο του Σχεδίου Μάρσαλ, 1947 — Πηγή: NARA (κοινό κτήμα)`

### 027-north-atlantic-treaty — 1188×1600
- **alt** — tr: `Kuzey Atlantik Antlaşması'nın (NATO) ilk sayfası` · en: `First page of the North Atlantic Treaty (NATO)` · ru: `Первая страница Североатлантического договора (НАТО)` · uk: `Перша сторінка Північноатлантичного договору (НАТО)` · el: `Πρώτη σελίδα της Συνθήκης του Βορείου Ατλαντικού (ΝΑΤΟ)`
- **caption** — tr: `Kuzey Atlantik Antlaşması, 1949 — Kaynak: NARA (kamu malı)` · en: `North Atlantic Treaty, 1949 — Source: NARA (public domain)` · ru: `Североатлантический договор, 1949 — Источник: NARA (общественное достояние)` · uk: `Північноатлантичний договір, 1949 — Джерело: NARA (суспільне надбання)` · el: `Συνθήκη του Βορείου Ατλαντικού, 1949 — Πηγή: NARA (κοινό κτήμα)`

### 058-nato-signature-page — 1175×1600
- **alt** — tr: `Kuzey Atlantik Antlaşması'nın imza sayfası` · en: `Signature page of the North Atlantic Treaty` · ru: `Страница подписей Североатлантического договора` · uk: `Сторінка підписів Північноатлантичного договору` · el: `Σελίδα υπογραφών της Συνθήκης του Βορείου Ατλαντικού`
- **caption** — tr: `Kuzey Atlantik Antlaşması imza sayfası, 1949 — Kaynak: NARA (kamu malı)` · en: `North Atlantic Treaty signature page, 1949 — Source: NARA (public domain)` · ru: `Страница подписей Североатлантического договора, 1949 — Источник: NARA (общественное достояние)` · uk: `Сторінка підписів Північноатлантичного договору, 1949 — Джерело: NARA (суспільне надбання)` · el: `Σελίδα υπογραφών της Συνθήκης του Βορείου Ατλαντικού, 1949 — Πηγή: NARA (κοινό κτήμα)`

### 029-korean-paratroopers — 1018×800
- **alt** — tr: `Kore Savaşı sırasında paraşütle indirilen ABD askerleri, siyah-beyaz arşiv fotoğrafı` · en: `Black-and-white archival photo of U.S. paratroopers during the Korean War` · ru: `Чёрно-белое архивное фото десантников США во время Корейской войны` · uk: `Чорно-біле архівне фото десантників США під час Корейської війни` · el: `Ασπρόμαυρη αρχειακή φωτογραφία Αμερικανών αλεξιπτωτιστών στον Πόλεμο της Κορέας`
- **caption** — tr: `Kore Savaşı, ABD paraşütçüleri, 1950 — Kaynak: NARA (kamu malı)` · en: `Korean War, U.S. paratroopers, 1950 — Source: NARA (public domain)` · ru: `Корейская война, десантники США, 1950 — Источник: NARA (общественное достояние)` · uk: `Корейська війна, десантники США, 1950 — Джерело: NARA (суспільне надбання)` · el: `Πόλεμος της Κορέας, Αμερικανοί αλεξιπτωτιστές, 1950 — Πηγή: NARA (κοινό κτήμα)`

### 030-tonkin-gulf — 500×751
- **alt** — tr: `Tonkin Körfezi Kararı'nın resmî belge sayfası` · en: `Official document page of the Gulf of Tonkin Resolution` · ru: `Официальная страница документа Тонкинской резолюции` · uk: `Офіційна сторінка документа Тонкінської резолюції` · el: `Επίσημη σελίδα εγγράφου του Ψηφίσματος του Κόλπου του Τόνκιν`
- **caption** — tr: `Tonkin Körfezi Kararı, 1964 — Kaynak: NARA (kamu malı)` · en: `Gulf of Tonkin Resolution, 1964 — Source: NARA (public domain)` · ru: `Тонкинская резолюция, 1964 — Источник: NARA (общественное достояние)` · uk: `Тонкінська резолюція, 1964 — Джерело: NARA (суспільне надбання)` · el: `Ψήφισμα του Κόλπου του Τόνκιν, 1964 — Πηγή: NARA (κοινό κτήμα)`

### 036-reagan-berlin-wall — 480×320
- **alt** — tr: `Reagan'ın Berlin Duvarı önündeki konuşmasından bir kare` · en: `A frame from Reagan's speech at the Berlin Wall` · ru: `Кадр из речи Рейгана у Берлинской стены` · uk: `Кадр із промови Рейгана біля Берлінської стіни` · el: `Στιγμιότυπο από την ομιλία του Ρίγκαν στο Τείχος του Βερολίνου`
- **caption** — tr: `Reagan'ın Berlin Duvarı konuşması, 1987 — Kaynak: Reagan Library (kamu malı)` · en: `Reagan's Berlin Wall speech, 1987 — Source: Reagan Library (public domain)` · ru: `Речь Рейгана у Берлинской стены, 1987 — Источник: Reagan Library (общественное достояние)` · uk: `Промова Рейгана біля Берлінської стіни, 1987 — Джерело: Reagan Library (суспільне надбання)` · el: `Ομιλία του Ρίγκαν στο Τείχος του Βερολίνου, 1987 — Πηγή: Reagan Library (κοινό κτήμα)`

### 038-desert-storm — 1550×1240
- **alt** — tr: `Körfez Savaşı "Çöl Fırtınası" Harekâtı'ndan bir sahne` · en: `A scene from the Gulf War's Operation Desert Storm` · ru: `Сцена из операции «Буря в пустыне» во время войны в Заливе` · uk: `Сцена з операції «Буря в пустелі» під час війни в Затоці` · el: `Σκηνή από την Επιχείρηση «Καταιγίδα της Ερήμου» στον Πόλεμο του Κόλπου`
- **caption** — tr: `Çöl Fırtınası Harekâtı, Körfez Savaşı, 1991 — Kaynak: USCG (kamu malı)` · en: `Operation Desert Storm, Gulf War, 1991 — Source: USCG (public domain)` · ru: `Операция «Буря в пустыне», война в Заливе, 1991 — Источник: USCG (общественное достояние)` · uk: `Операція «Буря в пустелі», війна в Затоці, 1991 — Джерело: USCG (суспільне надбання)` · el: `Επιχείρηση «Καταιγίδα της Ερήμου», Πόλεμος του Κόλπου, 1991 — Πηγή: USCG (κοινό κτήμα)`

---

## 4. CURSOR GÖREVİ (fazlı — sırayla uygula)

```
GÖREV: OWS-2026-004 dossier'ına görselleri göm. docs/OWS-004-GORSEL-PAKETI.md dosyasını
referans al. Hiçbir orijinali bozma; yalnızca dossier .md dosyalarına <figure> blokları ekle.

FAZ 0 — 058'i kopyala:
- "Yeni klasör (4)" içindeki ows-004-058-nato-signature-page.webp dosyasını
  public/images/ows-004/ klasörüne KOPYALA. Artık 20 webp olmalı; doğrula.

FAZ 1 — Dosyaları keşfet (önce oku, raporla):
- OWS-2026-004 dossier'ının 5 dil × 2 register dosyalarını bul (tr/en/ru/uk/el; forensic + kamu/popüler).
- Bulduğun tam yolları listele. Kaç dosya buldun? Forensic ve Kamu hangileri?
- BURADA DUR, listeyi göster. (İstersen sonraki fazları otomatik sürdür; ama liste ekranda kalsın.)

FAZ 2 — FORENSIC, önce SADECE tr.md (pilot):
- §1 yerleşim haritasındaki 19 görseli, §3'teki TR alt/caption ile, §1 figure şablonunu
  kullanarak forensic tr.md'ye ekle.
- Her figure ilgili olay/tarih paragrafının ARDINA girer. Tablo/başlık ortasına girme.
- Hero (001): figure'ı "# Yönetici Özeti" başlığının ÜSTÜNE, loading="eager", sınıf "ows-figure ows-hero".
- Bitince bana tr.md'ye eklenen figure sayısını (19 olmalı) ve eklenen ilk 2 bloğu göster.

FAZ 3 — FORENSIC diğer diller (en/ru/uk/el):
- Aynı 19 görsel, aynı yerleşim mantığı (olay/tarih paragrafı ardına), ama §3'ten O DİLİN
  alt/caption metniyle. İngilizce dosyada İngilizce alt/caption, Rusça'da Rusça, vb.
- Anchor için: ilgili olayın o dildeki paragrafını bul (Pearl Harbor, Monroe Doctrine vb.).

FAZ 4 — KAMU register (5 dil):
- SADECE §2'deki 7 fotoğraf (001 hero + 011, 013, 014, 019, 029, 038). Belge taraması EKLEME.
- Her dilin kamu dosyasına, o dilin alt/caption'ı ile.

FAZ 5 — Build + doğrula:
- npm run build çalıştır. Çıkış kodu 0 mı, kaç sayfa, hata var mı?
- Son satırları göster. Hata varsa hangi dosya/satır olduğunu bildir, DUR.

KURALLAR:
- Orijinal görselleri/metnin anlamını değiştirme. Sadece <figure> ekle.
- 002-american-progress KULLANMA (011 ile mükerrer).
- Bölüm 4 (Sentez) ve metodoloji-dışı bölümlere fazladan görsel koyma.
- Bir paragrafın anchor'ından emin değilsen, o görseli ATLA ve sonunda "yerleştirilemedi" listesinde bildir — yanlış yere koyma.
```

---

## 5. SEN NEYİ DOĞRULAYACAKSIN (Cursor bitince)

1. **Build yeşil mi** — çıkış 0, sayfa sayısı (görsel eklemek sayfa sayısını değiştirmez, ~80 kalır).
2. **Hero görünüyor mu** — bir dossier'ı tarayıcıda aç, kapak en üstte mi.
3. **"yerleştirilemedi" listesi** — Cursor anchor bulamadığı görsel bildirdiyse, onları elle konumlandırırız.
4. **Deploy ETME hemen** — önce yerel `npm run dev` ile bir-iki dile göz at; doğruysa tek deploy.
5. **Hreflang denetimi** (ayrı iş, sonra) — bu görseller her dile girince, daha önce konuştuğumuz "bazı diller tr fallback mı" sorusu netleşir.

> **NOT:** Kredi/Pro meselesi çözüldü; deploy artık kredi derdi yaratmıyor. Yine de tek toplu deploy yap, 5 dil × 2 register'ı ayrı ayrı yayınlama.
