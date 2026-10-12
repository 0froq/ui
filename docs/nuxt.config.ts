import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { componentFile } from './shared/component-files'
import { OG_IMAGE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from './shared/site'

const siteDist = fileURLToPath(new URL('../dist', import.meta.url))
const componentsRoot = fileURLToPath(new URL('../src/components', import.meta.url))

function componentRoutes(): string[] {
  const routes: string[] = []
  for (const concept of readdirSync(componentsRoot, { withFileTypes: true })) {
    if (!concept.isDirectory())
      continue
    routes.push(`/components/${concept.name}`, `/zh/components/${concept.name}`)
    const files = readdirSync(fileURLToPath(new URL(`../src/components/${concept.name}`, import.meta.url)))
    for (const file of files) {
      const entry = componentFile(`${concept.name}/${file}`)
      if (!entry || entry.demo)
        continue
      routes.push(entry.to, `/zh${entry.to}`)
    }
  }
  return routes
}

export default defineNuxtConfig({
  compatibilityDate: '2026-09-19',

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  css: [
    '~/assets/css/fonts.css',
    '@froq/ui/style.css',
    '~/assets/css/site.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_NAME },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: OG_IMAGE_URL },
        { name: 'twitter:image:alt', content: SITE_NAME },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: SITE_NAME },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: SITE_ORIGIN },
        { property: 'og:image', content: OG_IMAGE_URL },
        { property: 'og:image:secure_url', content: OG_IMAGE_URL },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: SITE_NAME },
      ],
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

  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },

  nitro: {
    // Workers Builds sets WORKERS_CI; without this Nitro picks cloudflare-module.
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/zh',
        '/components',
        '/zh/components',
        ...componentRoutes(),
      ],
    },
  },

  $production: {
    nitro: {
      // Workers static assets read repo-root `dist`; dev must not empty that output.
      output: {
        dir: siteDist,
        publicDir: siteDist,
      },
    },
  },

  typescript: { strict: true },

  eslint: { config: { standalone: false } },
})
