# Open War Studies — Bilinen borçlar defteri

Bu belge, bilinçli olarak ertelenen işlerin, yayın kararlarının ve teknik borçların unutulmasını önleyen kalıcı kayıttır.

## Kullanım

- Kapanan kayıt silinmez; durumu `KAPANDI` yapılır ve tarih/kanıt eklenir.
- Her “şimdi yayınlayalım, sonra yaparız” kararı, o kararı taşıyan commit içinde buraya işlenir.
- Denetim ve yayın hazırlığı bu defter kontrol edilmeden başlamaz.
- Borç kaydı, kanonik/akademik içeriği değiştirme yetkisi vermez.
- Gerçek ve hemen düzeltilebilir hatalar borç etiketiyle gizlenmez.
- Doğrulanmamış tarihçe veya gerekçe gerçekmiş gibi yazılmaz.

Durum değerleri: `AÇIK`, `DEVAM EDİYOR`, `BLOKE`, `KAPANDI`, `İPTAL`.

Kayıt tarihi: 2026-08-16 (Aşama 1 kapanış defteri).

---

## OWS-BORC-001 — UK/EL ABD dosyaları

| Alan | Değer |
|---|---|
| Kimlik | OWS-BORC-001 |
| Tür | Çeviri |
| Durum | AÇIK |
| Öncelik | YAYIN SONRASI / PLANLI |
| Kayıt tarihi | 2026-08-16 |
| Onay sahibi | Barış Mustafa Aksu |
| Son inceleme | 2026-08-16 |

**Ertelenen iş.** Aşağıdaki dört çeviri dosyasının yazılması ve yayımlanması:

- `src/content/dossiers/abd-dis-politikasi/uk.md`
- `src/content/dossiers/abd-dis-politikasi/el.md`
- `src/content/dossiers/abd-dis-politikasi-popular/uk.md`
- `src/content/dossiers/abd-dis-politikasi-popular/el.md`

**Erteleme nedeni.** Beş dilde çalışma yükü ve yorgunluk nedeniyle bilinçli erteleme.

**Mevcut geçici durum.** UK/EL rotaları üretilmiyor; TR gövdesi yanlış dil etiketiyle sunulmuyor. Dört rota 404. Site içi bağlantı sayısı sıfır. Hreflang, sitemap ve dil menüsü yalnız TR/EN/RU. Bu borç tek başına deploy engeli değildir; eksik UK/EL içerikleri güvenli biçimde yayımdan çıkarılmıştır ve çeviriler sonraki aşamada tamamlanacaktır.

**Kapanma koşulları.**

- Dört gerçek çeviri dosyasının eklenmesi
- İsim, tarih, sayı, olumsuzluk, epistemik etiket ve bağlantı QC’si
- Ham makine çevirisinin kabul edilmemesi
- Build’in 140 sayfaya dönmesi
- Hreflang, sitemap ve dil menüsünün 5/5 doğrulanması
- İkinci AI denetimi ve Barış Mustafa Aksu onayı

**İlgili commit / kanıt.**

- `59cc687488fa7e433f216bbd05fb08671151d0bc` — `fix(i18n): stop publishing untranslated locale fallbacks`
- `2c0351aa3901f42173ed6c58de6b439a44c43ef4` — `fix(i18n): align locale navigation and clean title labels`

---

## OWS-BORC-002 — Markdown kaynaklı çoklu H1

| Alan | Değer |
|---|---|
| Kimlik | OWS-BORC-002 |
| Tür | İçerik/semantik |
| Durum | AÇIK |
| Öncelik | ORTA |
| Kayıt tarihi | 2026-08-16 |
| Onay sahibi | Barış Mustafa Aksu |
| Son inceleme | 2026-08-16 |

**Ertelenen iş.** Aşağıdaki dosya ailelerinde Markdown `#` başlıklarından gelen fazla H1’lerin, görünür metin değişmeden semantik başlık seviyesine indirilmesi:

- `abd-dis-politikasi`
- `abd-dis-politikasi-popular`
- `arayuz-analizleri-kudus`
- `arayuz-analizleri-reagan`
- `arayuz-analizleri-suveys`
- `orthodox-axis`
- `yaroslav-relics-popular`

**Erteleme nedeni.** İçerik gövdelerine Aşama 1’de dokunulmaması.

**Mevcut geçici durum.** Bileşen/şablon kaynaklı çoklu H1 Aşama 1’de düzeltildi. Yukarıdaki ailelerde Markdown kaynaklı ikinci (ve ABD forensic’te daha fazla) H1 duruyor.

**Kapanma koşulları.**

- Yalnız başlık seviyelerinin düzeltilmesi
- Cümle, iddia ve kanıt içeriğinin değiştirilmemesi
- Her sayfada tek H1 doğrulaması
- Build ve görsel kontrol
- İçerik değişikliği denetimi

**İlgili commit / kanıt.**

- `851e6ffff8c5da084cb6bdd93afa6e23d39534c1` — `fix(a11y): normalize generated heading hierarchy` (şablon H1; Markdown gövdesi bilinçli olarak dışarıda bırakıldı)

---

## OWS-BORC-003 — Ana sayfaya özgü meta description

| Alan | Değer |
|---|---|
| Kimlik | OWS-BORC-003 |
| Tür | SEO/metin |
| Durum | AÇIK |
| Öncelik | ORTA |
| Kayıt tarihi | 2026-08-16 |
| Onay sahibi | Barış Mustafa Aksu |
| Son inceleme | 2026-08-16 |

**Ertelenen iş.** Ana sayfa için, her dilde görünen içerikle uyumlu özgün meta description.

**Erteleme nedeni.** Aşama 1’de yeni metin üretiminin kapsam dışında tutulması.

**Mevcut geçici durum.** Ana sayfa site-geneli `meta.description` kullanıyor. `home.lead` sözlükte vardır; güncel HomePage şablonunda görünür açıklama olarak yer almamaktadır.

**Kapanma koşulları.**

- Beş dil için özgün ama görünen içerikle uyumlu açıklamalar
- Yeni veya desteklenmeyen iddia eklenmemesi
- İkinci AI dil/SEO denetimi
- Barış Mustafa Aksu onayı

**İlgili commit / kanıt.**

- `fbaa0fef3e10d777d523018b6571477754ff6d1c` — `fix(seo): provide localized hub page titles` (hub `lead` geçirildi; ana sayfa site-geneli açıklamada bırakıldı)

---

## OWS-BORC-004 — Canlı intro / kaynak manset ve yayın zinciri

| Alan | Değer |
|---|---|
| Kimlik | OWS-BORC-004 |
| Tür | Karar/yayın |
| Durum | BLOKE |
| Öncelik | DEPLOY BLOCKER |
| Kayıt tarihi | 2026-08-16 |
| Onay sahibi | Barış Mustafa Aksu |
| Son inceleme | 2026-08-16 |

**Ertelenen iş.** Canlı görünüm (intro) ile güncel kaynak görünümü (manset/slider) arasında açık yayın kararı; Netlify deploy kaynağı ve yönteminin panelden doğrulanması.

**Erteleme nedeni.** Aşama 1 teknik temel paketinde ana sayfa tasarımı ve deploy kararı kapsam dışıdır. “Manset görünümünden 30 Temmuz’da vazgeçildi” iddiası doğrulanmış değildir; bu deftere gerçek olarak yazılmaz.

**Mevcut geçici durum.**

- Canlı site, eski `ows-dist-akademik` intro görünümünü sunmaktadır (gözlemlenen HTML/CSS eşleşmesi; tüm ağacın kriptografik kanıtı değildir).
- Güncel `ows` kaynağı manset/slider görünümü içerir.
- Netlify deploy kaynağı ve yöntemi panelden kesinleştirilmemiştir.
- Bu dalda remote, push ve deploy yoktur.

**Kapanma koşulları.**

- Netlify panelindeki deploy kaynağının doğrulanması
- Canlı, güncel kaynak ve varsa WOA kopyasının görsel karşılaştırması
- Intro veya manset için açık Barış Mustafa Aksu kararı
- Geri dönüş planı olan yazılı deploy yöntemi

**İlgili commit / kanıt.**

- Depoda bu kararı veren bir commit yoktur.
- 2026-08-16 canlı–kaynak karşılaştırması: canlı intro + `BaseLayout.dDg_5u_e.css`; kaynak manset + farklı CSS özeti. Aşama 1 commitleri ana sayfa tasarımına karar vermedi.

---

## OWS-BORC-005 — Yapılandırılmış veri ve sosyal metadata

| Alan | Değer |
|---|---|
| Kimlik | OWS-BORC-005 |
| Tür | Teknik zenginleştirme |
| Durum | AÇIK |
| Öncelik | DÜŞÜK/ORTA |
| Kayıt tarihi | 2026-08-16 |
| Onay sahibi | Barış Mustafa Aksu |
| Son inceleme | 2026-08-16 |

**Ertelenen iş.** JSON-LD, Open Graph ve Twitter metadata.

**Erteleme nedeni.** Aşama 1 teknik temel paketinde bilinçli olarak sonraki kontrollü pakete bırakıldı.

**Mevcut geçici durum.** Sayfalarda canonical, hreflang ve (hub’larda) yerelleştirilmiş title/description vardır. JSON-LD, Open Graph ve Twitter Card yoktur. RSS ve `llms.txt` bu kayda dahil değildir; ayrı gerekçe ve fayda değerlendirmesi olmadan iş kapsamına alınmaz.

**Kapanma koşulları.**

- Yalnız görünür içerikte bulunan iddiaların kullanılması
- Organization/Article/Breadcrumb kapsamının sayfa türüne göre uygulanması
- Şema doğrulaması
- OG/Twitter preview kontrolü

**İlgili commit / kanıt.**

- `99043142f7e570292e487273a0d37482654fe944` — `fix(seo): add canonical URLs and robots discovery` (keşif/canonical; JSON-LD/OG/Twitter eklenmedi)
