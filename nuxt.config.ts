import pkg from './package.json'

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    preset: 'node-server',
    output: {
      dir: './dist',
    },
    sourceMap: false,
    externals: {
      external: Object.keys(pkg.dependencies),
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
