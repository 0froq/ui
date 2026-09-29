import { fileURLToPath } from 'node:url'

const siteDist = fileURLToPath(new URL('../dist', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2026-09-19',

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
  ],

  css: [
    '@fontsource-variable/geist/index.css',
    '@fontsource-variable/geist-mono/index.css',
    '@fontsource/instrument-serif/400.css',
    '@fontsource/instrument-serif/400-italic.css',
    '@froq/ui/paper/style.css',
    '@froq/ui/flat/style.css',
    '@froq/ui/term/style.css',
    '~/assets/css/site.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      meta: [{ name: 'color-scheme', content: 'light dark' }],
      script: [{
        tagPosition: 'head',
        innerHTML: `try{var t=localStorage.getItem('ui-theme');var dark=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.classList.toggle('dark',dark)}catch(e){}`,
      }],
    },
  },

  build: {
    transpile: ['@froq/ui'],
  },

  vite: {
    server: {
      fs: { allow: ['..'] },
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'vitesse-light', dark: 'vitesse-dark' },
          langs: ['ts', 'vue', 'bash', 'css', 'json'],
        },
      },
    },
  },

  nitro: {
    // Same static output as paper-landing: Cloudflare Pages serves `dist` at the repo root.
    preset: 'cloudflare-pages-static',
    output: {
      dir: siteDist,
      publicDir: siteDist,
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  typescript: { strict: true },

  eslint: { config: { standalone: false } },
})
