# Open War Studies — Agent Rules

## Content

- Her dil ayrı `.md` dosyasıdır (`src/content/dossiers/{id}/{locale}.md`).
- Bir dili düzenlerken diğer dil dosyalarına DOKUNMA.
- Uzun metin SADECE `.md` gövdesinde; frontmatter yalnız yapısal meta + kısa başlık/özet.
- Yeni dossier: mevcut klasör şablonunu kopyala; Zod şemasına uy.
- Eksik dil fallback: `tr`. Çeviri UYDURMA.
- Her içerik değişiminde frontmatter `updated` alanını güncelle.

## Assets

- Base64 gömme YASAK; görseller `src/assets/` altında dosya olarak.
- Renk hardcode YASAK; `src/styles/tokens.css` değişkenlerini kullan.

## Legacy

- `_legacy_source/` SALT-OKUNUR referans arşividir; düzenleme veya silme YOK.

## Intro

- Intro animasyon zamanlaması değiştirilmez (reduced-motion statik gösterim hariç).
- Intro kaynak referans: `_legacy_source/index_modular.html` + intro CSS/JS.

## i18n

- UI metinleri: `src/i18n/ui.json` (legacy `translations.json` kaynaklı).
- 5 dil: tr, en, ru, uk, el.
