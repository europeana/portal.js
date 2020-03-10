// Load dotenv for server/index.js to access env vars from .env file
require('dotenv').config();
const pkg = require('./package');
const i18nLocales = require('./plugins/i18n/locales.js');
const i18nDateTime = require('./plugins/i18n/datetime.js');

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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    // Show progress bar immediately when testing, to aid detection that page
    // has started loading, then finished.
    throttle: process.env.NODE_ENV === 'test' ? 0 : 200,
    css: false,
    duration: 2500,
    continuous: true
  },

  /*
  ** Global CSS
  */
  css: [],

  // BootstrapVue
  // Doc: https://bootstrap-vue.js.org/docs/
  bootstrapVue: {
    // Set these two settings to `false` to prevent auto-importing of Bootstrap(Vue)
    // CSS. It will then need to be manually imported, e.g. with
    // assets/scss/bootstrap.scss
    bootstrapCSS: true,
    bootstrapVueCSS: true,

    // Tree shake plugins
    componentPlugins: [
      'AlertPlugin',
      'BadgePlugin',
      'BreadcrumbPlugin',
      'ButtonPlugin',
      'CardPlugin',
      'DropdownPlugin',
      'FormCheckboxPlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'FormPlugin',
      'FormRadioPlugin',
      'ImagePlugin',
      'InputGroupPlugin',
      'JumbotronPlugin',
      'LayoutPlugin',
      'LinkPlugin',
      'ListGroupPlugin',
      'MediaPlugin',
      'NavbarPlugin',
      'NavPlugin',
      'PaginationNavPlugin'
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/europeana',
    '~/plugins/vue/index',
    '~/plugins/i18n.js',
    '~/plugins/vue-filters'
  ],

  buildModules: [
    '~/modules/apis',
    // Doc: https://www.elastic.co/guide/en/apm/agent/rum-js/current/configuration.html
    ['~/modules/elastic-apm', {
      serviceName: 'portal-js',
      serviceVersion: pkg.version,
      serverUrl: process.env['ELASTIC_APM_SERVER_URL'],
      environment: process.env['ELASTIC_APM_ENVIRONMENT'] || 'development',
      logLevel: process.env['ELASTIC_APM_LOG_LEVEL'] || 'info',
      frameworkName: 'Nuxt.js',
      frameworkVersion: require('nuxt/package.json').version
    }]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      pageTracking: true
    }],
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    ['nuxt-i18n', {
      locales: i18nLocales,
      defaultLocale: 'en',
      lazy: true,
      langDir: 'lang/',
      strategy: 'prefix',
      vueI18n: {
        fallbackLocale: 'en',
        silentFallbackWarn: true,
        dateTimeFormats: i18nDateTime
      },
      // Enable browser language detection to automatically redirect user
      // to their preferred language as they visit your app for the first time
      // Set to false to disable
      // NB: do not enable this in portal.js; our own l10n middleware handles it.
      detectBrowserLanguage: false,
      vuex: {
        // Module namespace
        moduleName: 'i18n',
        syncLocale: true,
        syncRouteParams: true
      }
    }]
  ],

  router: {
    middleware: ['legacy/index', 'l10n'],
    extendRoutes(routes) {
      routes.push({
        name: 'slug',
        path: '/*',
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
  },

  /*
  ** Render configuration
   */
  render: {
    static: {
      maxAge: '1d'
    }
  }
};
