/* eslint-disable camelcase */

require('dotenv').config();
const pkg = require('./package');
const i18nLocales = require('./plugins/i18n/locales.js');
const i18nDateTime = require('./plugins/i18n/datetime.js');

const APP_SITE_NAME = 'Europeana';

const keycloakOpenIDConnectEndpoint = (method) =>
  `${process.env.OAUTH_ORIGIN || 'https://auth.europeana.eu'}/auth/realms/${process.env.OAUTH_REALM || 'europeana'}/protocol/openid-connect/${method}`;

module.exports = {
  publicRuntimeConfig: {
    app: {
      siteName: APP_SITE_NAME
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    title: APP_SITE_NAME,
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
    throttle: process.env.NUXT_LOADING_THROTTLE || 200,
    css: false,
    duration: 2500,
    continuous: true
  },

  /*
  ** Global CSS
  */
  css: ['./assets/scss/style'],

  // BootstrapVue
  // Doc: https://bootstrap-vue.js.org/docs/
  bootstrapVue: {
    // Set these two settings to `false` to prevent auto-importing of Bootstrap(Vue)
    // CSS. It will then need to be manually imported, e.g. with
    // assets/scss/bootstrap.scss
    bootstrapCSS: false,
    bootstrapVueCSS: false,

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
      'FormTextareaPlugin',
      'ImagePlugin',
      'InputGroupPlugin',
      'JumbotronPlugin',
      'LayoutPlugin',
      'LinkPlugin',
      'ListGroupPlugin',
      'MediaPlugin',
      'ModalPlugin',
      'NavbarPlugin',
      'NavPlugin',
      'PaginationNavPlugin',
      'TabsPlugin',
      'ToastPlugin'
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/apis',
    '~/plugins/vue',
    '~/plugins/i18n.js',
    '~/plugins/link',
    '~/plugins/page',
    '~/plugins/vue-filters',
    '~/plugins/vue-directives',
    { src: '~/plugins/vue-announcer', mode: 'client' }
  ],

  buildModules: [
    '~/modules/contentful-graphql',
    '~/modules/axios-logger',
    ['~/modules/http', {
      ports: {
        http: process.env.HTTP_PORT,
        https: process.env.HTTPS_PORT
      },
      sslNegotiation: {
        enabled: Boolean(Number(process.env.ENABLE_SSL_NEGOTIATION)),
        datasetBlacklist: (process.env.SSL_DATASET_BLACKLIST || '').split(',')
      }
    }],
    '~/modules/query-sanitiser',
    '@nuxtjs/auth',
    ['@nuxtjs/gtm', {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      pageTracking: true
    }],
    ['@nuxtjs/robots', JSON.parse(process.env.APP_ROBOTS || '{"UserAgent":"*","Disallow":"/"}')]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://www.elastic.co/guide/en/apm/agent/rum-js/current/configuration.html
    ['~/modules/elastic-apm', {
      serviceName: 'portal-js',
      serviceVersion: pkg.version,
      serverUrl: process.env['ELASTIC_APM_SERVER_URL'],
      environment: process.env['ELASTIC_APM_ENVIRONMENT'] || 'development',
      logLevel: process.env['ELASTIC_APM_LOG_LEVEL'] || 'info',
      frameworkName: 'Nuxt.js',
      frameworkVersion: require('nuxt/package.json').version
    }],
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    ['nuxt-i18n', {
      locales: i18nLocales,
      baseUrl: process.env.PORTAL_BASE_URL,
      defaultLocale: 'en',
      lazy: true,
      langDir: 'lang/',
      strategy: 'prefix',
      vueI18n: {
        fallbackLocale: 'en',
        silentFallbackWarn: true,
        dateTimeFormats: i18nDateTime
      },
      // Disable redirects to account pages
      parsePages: false,
      pages: {
        'account/callback': false,
        'account/login': false,
        'account/logout': false
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

  auth: {
    // Redirect routes: 'callback' option for keycloak redirects,
    // 'login' option for unauthorised redirection
    // 'home' option for redirection after login
    //  no redirect on logout
    redirect: {
      login: '/account/login',
      logout: false,
      callback: '/account/callback',
      home: '/account'
    },
    fullPathRedirect: true,
    strategies: {
      local: false,
      keycloak: {
        _scheme: 'oauth2',
        client_id: process.env.OAUTH_CLIENT,
        scope: (process.env.OAUTH_SCOPE || 'openid,profile,email,usersets').split(','),
        realm: process.env.OAUTH_REALM || 'europeana',
        authorization_endpoint: keycloakOpenIDConnectEndpoint('auth'),
        access_token_endpoint: keycloakOpenIDConnectEndpoint('token'),
        userinfo_endpoint: keycloakOpenIDConnectEndpoint('userinfo'),
        end_session_endpoint: keycloakOpenIDConnectEndpoint('logout'),
        response_type: process.env.OAUTH_RESPONSE_TYPE || 'code',
        access_type: process.env.OAUTH_ACCESS_TYPE || 'online',
        grant_type: process.env.OAUTH_GRANT_TYPE || 'authorization_code',
        token_type: process.env.OAUTH_TOKEN_TYPE || 'Bearer'
      }
    },
    plugins: [{ src: '~/plugins/authAxios' }]
  },

  router: {
    middleware: ['legacy/index', 'l10n'],
    extendRoutes(routes) {
      routes.push({
        name: 'slug',
        path: '/*',
        component: 'pages/index.vue'
      });
      routes.push({
        name: 'collections',
        path: '/(collections)',
        component: 'pages/index.vue'
      });
    },
    linkExactActiveClass: 'exact-active-link'
  },

  serverMiddleware: [
    { path: '/memory-usage', handler: '~/middleware/server/memory-usage' },
    '~/middleware/server/logging',
    '~/middleware/server/record-json'
  ],

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
  },

  // Opt-out of telemetry
  telemetry: false
};
