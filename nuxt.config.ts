// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-72x72.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-144x144.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#EB0000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ]
    }
  },

  // SPA mode
  ssr: false,

  nitro: {
    preset: 'static'
  },

  routeRules: {
    '/auth/reset-password/**': {
      prerender: false
    }
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
  ],

  fonts: {
    families: [
      { name: 'DM Serif Text', provider: 'google' },
      { name: 'Montserrat', provider: 'google' }
    ]
  },

  plugins: ['~/plugins/i18n.ts'],

  css: ['~/assets/css/index.css'],

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:9001'
    }
  },

  image: {
    provider: 'ipx'
  },

  compatibilityDate: '2025-04-02',
})