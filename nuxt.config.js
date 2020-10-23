// Load dotenv for server/index.js to access env vars from .env file
/* eslint-disable camelcase */
require('dotenv').config();
const pkg = require('./package');
const i18nLocales = require('./plugins/i18n/locales.js');
const i18nDateTime = require('./plugins/i18n/datetime.js');

const featureIsEnabled = (value) => Boolean(Number(value));

const config = {
  /*
  ** Runtime config
  */
  publicRuntimeConfig: {
    app: {
      // TODO: rename env vars to prefix w/ APP_, except feature toggles
      baseUrl: process.env.PORTAL_BASE_URL,
      internalLinkDomain: process.env.INTERNAL_LINK_DOMAIN,
      sslDatasetBlacklist: process.env.SSL_DATASET_BLACKLIST,
      features: {
        linksToClassic: featureIsEnabled(process.env.ENABLE_LINKS_TO_CLASSIC),
        loginLink: featureIsEnabled(process.env.ENABLE_LOGIN_LINK),
        sslNegotiation: featureIsEnabled(process.env.ENABLE_SSL_NEGOTIATION),
        unauthenticatedUserButtons: featureIsEnabled(process.env.ENABLE_UNAUTHENTICATED_USER_BUTTONS),
        xxUserAuth: featureIsEnabled(process.env.ENABLE_XX_USER_AUTH)
      }
    },
    contentful: {
      spaceId: process.env.CTF_SPACE_ID,
      environmentId: process.env.CTF_ENVIRONMENT_ID,
      accessToken: {
        delivery: process.env.CTF_CDA_ACCESS_TOKEN,
        preview: process.env.CTF_CPA_ACCESS_TOKEN
      },
      graphQlOrigin: process.env.CTF_GRAPHQL_ORIGIN
    },
    elastic: {
      apm: {
        serverUrl: process.env.ELASTIC_APM_SERVER_URL,
        environment: process.env.ELASTIC_APM_ENVIRONMENT,
        logLevel: process.env.ELASTIC_APM_LOG_LEVEL
      }
    },
    europeana: {
      apis: {
        annotation: {
          url: process.env.EUROPEANA_ANNOTATION_API_URL,
          key: process.env.EUROPEANA_ANNOTATION_API_KEY || process.env.EUROPEANA_API_KEY
        },
        entity: {
          url: process.env.EUROPEANA_ENTITY_API_URL,
          key: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY
        },
        newspaper: {
          url: process.env.EUROPEANA_NEWSPAPER_API_URL
        },
        recommendation: {
          url: process.env.EUROPEANA_RECOMMENDATION_API_URL
        },
        record: {
          url: process.env.EUROPEANA_RECORD_API_URL,
          key: process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
        },
        thumbnail: {
          url: process.env.EUROPEANA_THUMBNAIL_API_URL
        },
        set: {
          url: process.env.EUROPEANA_SET_API_URL,
          key: process.env.EUROPEANA_SET_API_KEY || process.env.EUROPEANA_API_KEY
        }
      }
    },
    google: {
      tagManagerId: process.env.GOOGLE_TAG_MANAGER_ID
    },
    oauth: {
      origin: process.env.OAUTH_ORIGIN,
      scheme: process.env.OAUTH_SCHEME,
      realm: process.env.OAUTH_REALM,
      client: process.env.OAUTH_CLIENT,
      scope: process.env.OAUTH_SCOPE
    }
  },

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
    '~/plugins/axiosLogger',
    '~/plugins/apis',
    '~/plugins/vue',
    '~/plugins/i18n.js',
    '~/plugins/vue-filters',
    '~/plugins/vue-directives'
  ],

  buildModules: [
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
    '~/modules/contentful-graphql',
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
    '@nuxtjs/gtm'
  ],
  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID,
    pageTracking: true
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
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

  serverMiddleware: ['~/middleware/server/record-json'],

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

if (Number(process.env['ENABLE_XX_USER_AUTH'])) {
  config.auth = {
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
        _scheme: process.env.OAUTH_SCHEME,
        client_id: process.env.OAUTH_CLIENT,
        scope: process.env.OAUTH_SCOPE.split(','),
        realm: process.env.OAUTH_REALM,
        authorization_endpoint: `${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/protocol/openid-connect/auth`,
        access_token_endpoint: `${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/protocol/openid-connect/token`,
        userinfo_endpoint: `${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/protocol/openid-connect/logout`,
        response_type: 'code id_token token',
        token_type: 'Bearer'
      }
    },
    plugins: [{ src: '~/plugins/authAxios' }]
  };
}

module.exports = config;
