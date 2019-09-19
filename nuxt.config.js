// Load dotenv for server/index.js to access env vars from .env file
require('dotenv').config();
const pkg = require('./package');
const bootstrapPkg = require('bootstrap/package');
const bootstrapVuePkg = require('bootstrap-vue/package');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,700%7COpen+Sans:400italic,700italic,400,700&amp;subset=latin,greek,cyrillic' },
      { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${bootstrapPkg.version}/dist/css/bootstrap.min.css` },
      { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${bootstrapVuePkg.version}/dist/bootstrap-vue.css` }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    css: false,
    duration: 2500,
    continuous: true
  },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/style.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/vue-filters'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      pageTracking: true
    }],
    ['bootstrap-vue/nuxt', { css: false }],
    ['nuxt-i18n', {
      locales: [
        {
          name: 'Български',
          code: 'bg',
          file: 'bg.js',
          iso: 'bg-BG'
        },
        {
          name: 'Čeština',
          code: 'cs',
          file: 'cs.js',
          iso: 'cs-CZ'
        },
        {
          name: 'Dansk',
          code: 'da',
          file: 'da.js',
          iso: 'da-DK'
        },
        {
          name: 'Deutsch',
          code: 'de',
          file: 'de.js',
          iso: 'de-DE'
        },
        {
          name: 'Ελληνικά',
          code: 'el',
          file: 'el.js',
          iso: 'el-GR'
        },
        {
          name: 'English',
          code: 'en',
          file: 'en.js',
          iso: 'en-GB'
        },
        {
          name: 'Español',
          code: 'es',
          file: 'es.js',
          iso: 'es-ES'
        },
        {
          name: 'Eesti',
          code: 'et',
          file: 'et.js',
          iso: 'et-EE'
        },
        {
          name: 'Euskara',
          code: 'eu',
          file: 'eu.js',
          iso: 'eu-ES'
        },
        {
          name: 'Suomi',
          code: 'fi',
          file: 'fi.js',
          iso: 'fi-FI'
        },
        {
          name: 'Français',
          code: 'fr',
          file: 'fr.js',
          iso: 'fr-FR'
        },
        {
          name: 'Gaeilge',
          code: 'ga',
          file: 'ga.js',
          iso: 'ga-IE'
        },
        {
          name: 'Hrvatski',
          code: 'hr',
          file: 'hr.js',
          iso: 'hr-HR'
        },
        {
          name: 'Magyar',
          code: 'hu',
          file: 'hu.js',
          iso: 'hu-HU'
        },
        {
          name: 'Italiano',
          code: 'it',
          file: 'it.js',
          iso: 'it-IT'
        },
        {
          name: 'Lietuvių',
          code: 'lt',
          file: 'lt.js',
          iso: 'lt-LT'
        },
        {
          name: 'Latviešu',
          code: 'lv',
          file: 'lv.js',
          iso: 'lv-LV'
        },
        {
          name: 'Malti',
          code: 'mt',
          file: 'mt.js',
          iso: 'mt-MT'
        },
        {
          name: 'Nederlands',
          code: 'nl',
          file: 'nl.js',
          iso: 'nl-NL'
        },
        {
          name: 'Polski',
          code: 'pl',
          file: 'pl.js',
          iso: 'pl-PL'
        },
        {
          name: 'Português',
          code: 'pt',
          file: 'pt.js',
          iso: 'pt-PT'
        },
        {
          name: 'Română',
          code: 'ro',
          file: 'ro.js',
          iso: 'ro-RO'
        },
        {
          name: 'Slovenčina',
          code: 'sk',
          file: 'sk.js',
          iso: 'sk-SK'
        },
        {
          name: 'Slovenščina',
          code: 'sl',
          file: 'sl.js',
          iso: 'sl-SI'
        },
        {
          name: 'Svenska',
          code: 'sv',
          file: 'sv.js',
          iso: 'sv-SE'
        }
      ],
      defaultLocale: 'en',
      lazy: true,
      langDir: 'lang/',
      vueI18n: {
        fallbackLocale: 'en',
        silentFallbackWarn: true
      },
      // Enable browser language detection to automatically redirect user
      // to their preferred language as they visit your app for the first time
      // Set to false to disable
      detectBrowserLanguage: {
        // If enabled, a cookie is set once a user has been redirected to his
        // preferred language to prevent subsequent redirections
        // Set to false to redirect every time
        useCookie: true,
        // Cookie name
        cookieKey: 'i18n_redirected',
        // Set to always redirect to value stored in the cookie, not just once
        alwaysRedirect: false,
        // If no locale for the browsers locale is a match, use this one as a fallback
        fallbackLocale: 'en'
      }
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  router: {
    extendRoutes(routes) {
      routes.push({
        name: 'slug',
        path: '/:slug',
        component: 'pages/index.vue'
      });
    }
  },

  /*
  ** Build configuration
  */
  build: {
    stats: process.env.NODE_ENV === 'test' ? 'errors-only' : {
      chunks: false,
      children: false,
      modules: false,
      colors: true,
      warnings: true,
      errors: true,
      excludeAssets: [
        /.map$/,
        /index\..+\.html$/,
        /vue-ssr-client-manifest.json/
      ]
    },
    extractCSS: true,
    publicPath: process.env.NUXT_ENV_BUILD_PUBLIC_PATH,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.node = { fs: 'empty' };
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
