// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical production domain — sabit. Lokal build (sürükle-bırak deploy)
  // de doğru sitemap/canonical URL'leri üretsin diye localhost'a düşmüyoruz.
  site: 'https://openwarstudies.org',
  trailingSlash: 'always',
  i18n: {
    locales: ['tr', 'en', 'ru', 'uk', 'el'],
    defaultLocale: 'tr',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: {
          tr: 'tr',
          en: 'en',
          ru: 'ru',
          uk: 'uk',
          el: 'el',
        },
      },
    }),
  ],
});
