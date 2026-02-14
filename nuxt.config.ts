export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost/api'
    }
  },

  css: [],

  ssr: false,
})