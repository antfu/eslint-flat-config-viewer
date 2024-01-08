import { fileURLToPath } from 'node:url'
import pkg from './package.json'

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  experimental: {
    typedPages: true,
  },

  features: {
    inlineStyles: false,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  nitro: {
    preset: 'node-server',
    output: {
      dir: './dist',
    },
    prerender: {
      routes: ['/'],
    },
    sourceMap: false,
    externals: {
      trace: false,
      external: [
        ...Object.keys(pkg.dependencies),
        'eslint',
        'eslint/use-at-your-own-risk',
      ],
    },
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
      },
    },
  },

  devtools: {
    enabled: true,
  },
})
