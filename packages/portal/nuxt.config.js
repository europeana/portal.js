/* eslint-disable camelcase */

/*
** Nuxt config
** Docs: https://nuxtjs.org/docs/configuration-glossary/
*/

const APP_SITE_NAME = 'Europeana';
const APP_PKG_NAME = '@europeana/portal';

import versions from './pkg-versions.js';

import i18nLocales from './src/plugins/i18n/locales.js';
import i18nDateTime from './src/plugins/i18n/datetime.js';
import { parseQuery, stringifyQuery } from './src/plugins/vue-router.cjs';
import features, { featureIsEnabled, featureNotificationExpiration } from './src/features/index.js';

import { BASE_URL as EUROPEANA_ENTITY_API_BASE_URL } from './src/plugins/europeana/entity.js';
import { BASE_URL as EUROPEANA_ENTITY_MANAGEMENT_API_BASE_URL } from './src/plugins/europeana/entity-management.js';
import { BASE_URL as EUROPEANA_MEDIA_PROXY_URL } from './src/plugins/europeana/proxy.js';
import {
  BASE_URL as EUROPEANA_RECORD_API_BASE_URL,
  FULLTEXT_BASE_URL as EUROPEANA_RECORD_API_FULLTEXT_URL
} from './src/plugins/europeana/record.js';
import { BASE_URL as EUROPEANA_SET_API_BASE_URL } from './src/plugins/europeana/set.js';
import { PRESENTATION_URL as EUROPEANA_IIIF_PRESENTATION_URL } from './src/plugins/europeana/iiif.js';

const buildPublicPath = () => {
  return process.env.NUXT_BUILD_PUBLIC_PATH;
};

export default {
  /*
  ** Runtime config
  */
  publicRuntimeConfig: {
    app: {
      // TODO: rename env vars to prefix w/ APP_, except feature toggles
      baseUrl: process.env.PORTAL_BASE_URL,
      internalLinkDomain: process.env.INTERNAL_LINK_DOMAIN,
      featureNotification: process.env.APP_FEATURE_NOTIFICATION,
      featureNotificationExpiration: featureNotificationExpiration(process.env.APP_FEATURE_NOTIFICATION_EXPIRATION),
      schemaOrgDatasetId: process.env.SCHEMA_ORG_DATASET_ID,
      siteName: APP_SITE_NAME,
      search: {
        translateLocales: (process.env.APP_SEARCH_TRANSLATE_LOCALES || '').split(',')
      }
    },
    auth: {
      strategies: {
        keycloak: {
          client_id: process.env.OAUTH_CLIENT,
          origin: process.env.OAUTH_ORIGIN || 'https://auth.europeana.eu',
          scope: (process.env.OAUTH_SCOPE || 'openid,profile,email,usersets').split(','),
          realm: process.env.OAUTH_REALM || 'europeana',
          response_type: process.env.OAUTH_RESPONSE_TYPE || 'code',
          access_type: process.env.OAUTH_ACCESS_TYPE || 'online',
          grant_type: process.env.OAUTH_GRANT_TYPE || 'authorization_code',
          token_type: process.env.OAUTH_TOKEN_TYPE || 'Bearer'
        }
      }
    },
    axios: {
      baseURL: process.env.PORTAL_BASE_URL
    },
    axiosLogger: {
      clearParams: process.env.AXIOS_LOGGER_CLEAR_PARAMS?.split(',') || ['wskey'],
      httpMethods: process.env.AXIOS_LOGGER_HTTP_METHODS?.toUpperCase().split(',')
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
        // Doc: https://www.elastic.co/guide/en/apm/agent/rum-js/current/configuration.html
        serverUrl: process.env.ELASTIC_APM_SERVER_URL,
        environment: process.env.ELASTIC_APM_ENVIRONMENT || 'development',
        logLevel: process.env.ELASTIC_APM_LOG_LEVEL || 'info',
        serviceName: 'portal-js',
        serviceVersion: versions[APP_PKG_NAME],
        frameworkName: 'Nuxt',
        frameworkVersion: versions['@nuxt/core'],
        ignoreUrls: [
          /^\/(_nuxt|__webpack_hmr)\//
        ],
        ignoreUserAgents: [
          'kube-probe/'
        ]
      }
    },
    europeana: {
      apis: {
        annotation: {
          url: process.env.EUROPEANA_ANNOTATION_API_URL,
          key: process.env.EUROPEANA_ANNOTATION_API_KEY || process.env.EUROPEANA_API_KEY
        },
        entity: {
          url: process.env.EUROPEANA_ENTITY_API_URL || EUROPEANA_ENTITY_API_BASE_URL,
          key: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY
        },
        entityManagement: {
          url: process.env.EUROPEANA_ENTITY_MANAGEMENT_API_URL || process.env.EUROPEANA_ENTITY_API_URL || EUROPEANA_ENTITY_MANAGEMENT_API_BASE_URL
        },
        iiifPresentation: {
          media: {
            url: process.env.EUROPEANA_MEDIA_IIIF_PRESENTATION_API_URL || EUROPEANA_IIIF_PRESENTATION_URL
          }
        },
        recommendation: {
          url: process.env.EUROPEANA_RECOMMENDATION_API_URL
        },
        record: {
          fulltextUrl: process.env.EUROPEANA_RECORD_API_FULLTEXT_URL || EUROPEANA_RECORD_API_FULLTEXT_URL,
          url: process.env.EUROPEANA_RECORD_API_URL || EUROPEANA_RECORD_API_BASE_URL,
          key: process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
        },
        thumbnail: {
          url: process.env.EUROPEANA_THUMBNAIL_API_URL
        },
        set: {
          url: process.env.EUROPEANA_SET_API_URL || EUROPEANA_SET_API_BASE_URL,
          key: process.env.EUROPEANA_SET_API_KEY || process.env.EUROPEANA_API_KEY
        }
      },
      proxy: {
        media: {
          url: process.env.EUROPEANA_MEDIA_PROXY_URL || EUROPEANA_MEDIA_PROXY_URL
        }
      }
    },
    features: features(),
    hotjar: {
      id: process.env.HOTJAR_ID,
      sv: process.env.HOTJAR_SNIPPET_VERSION
    },
    http: {
      ports: {
        http: process.env.HTTP_PORT,
        https: process.env.HTTPS_PORT
      },
      sslNegotiation: {
        enabled: featureIsEnabled(process.env.ENABLE_SSL_NEGOTIATION),
        datasetBlacklist: (process.env.SSL_DATASET_BLACKLIST || '').split(',')
      }
    },
    matomo: {
      host: process.env.MATOMO_HOST,
      siteId: process.env.MATOMO_SITE_ID,
      loadWait: {
        delay: process.env.MATOMO_LOAD_WAIT_DELAY,
        retries: process.env.MATOMO_LOAD_WAIT_RETRIES
      }
    },
    oauth: {
      origin: process.env.OAUTH_ORIGIN,
      realm: process.env.OAUTH_REALM,
      client: process.env.OAUTH_CLIENT,
      scope: process.env.OAUTH_SCOPE,
      responseType: process.env.OAUTH_RESPONSE_TYPE,
      accessType: process.env.OAUTH_ACCESS_TYPE,
      grantType: process.env.OAUTH_GRANT_TYPE,
      tokenType: process.env.OAUTH_TOKEN_TYPE
    }
  },

  privateRuntimeConfig: {
    contentful: {
      graphQlOrigin: process.env.CTF_GRAPHQL_ORIGIN_PRIVATE || process.env.CTF_GRAPHQL_ORIGIN
    },
    jira: {
      origin: process.env.JIRA_API_ORIGIN,
      username: process.env.JIRA_API_USERNAME,
      password: process.env.JIRA_API_PASSWORD,
      serviceDesk: {
        feedback: {
          username: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_USERNAME || process.env.JIRA_API_USERNAME,
          password: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_PASSWORD || process.env.JIRA_API_PASSWORD,
          serviceDeskId: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_ID,
          requestTypeId: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_REQUEST_TYPE_ID,
          customFields: {
            pageUrl: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_CUSTOM_FIELD_PAGE_URL,
            browser: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_CUSTOM_FIELD_BROWSER,
            screensize: process.env.JIRA_API_SERVICE_DESK_FEEDBACK_CUSTOM_FIELD_SCREENSIZE
          }
        },
        galleries: {
          username: process.env.JIRA_API_SERVICE_DESK_GALLERIES_USERNAME || process.env.JIRA_API_USERNAME,
          password: process.env.JIRA_API_SERVICE_DESK_GALLERIES_PASSWORD || process.env.JIRA_API_PASSWORD,
          serviceDeskId: process.env.JIRA_API_SERVICE_DESK_GALLERIES_ID,
          requestTypeId: process.env.JIRA_API_SERVICE_DESK_GALLERIES_REQUEST_TYPE_ID,
          customFields: {
            pageUrl: process.env.JIRA_API_SERVICE_DESK_GALLERIES_CUSTOM_FIELD_PAGE_URL,
            setId: process.env.JIRA_API_SERVICE_DESK_GALLERIES_CUSTOM_FIELD_SET_ID,
            setCreatorNickname: process.env.JIRA_API_SERVICE_DESK_GALLERIES_CUSTOM_FIELD_SET_CREATOR_NICKNAME
          }
        }
      }
    },
    redis: {
      url: process.env.REDIS_URL,
      tlsCa: process.env.REDIS_TLS_CA
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
      { hid: 'description', name: 'description', content: APP_SITE_NAME }
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
    //
    // NOTE: do not register plugins globally (here) unless they are used widely;
    //       import them locally into the views that need them instead. This
    //       is to prevent large amounts of unused JS being sent upfront to clients.
    //       As a general rule, only register globally if at least three views
    //       use the plugin's components/directives. Also consider how often
    //       those components are rendered based on placement in layout and
    //       usage patterns by users, and the plugin's bundled size.
    componentPlugins: [
      'BadgePlugin',
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
      'ModalPlugin',
      'NavbarPlugin',
      'SidebarPlugin',
      'ToastPlugin'
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-matomo.client',
    '~/plugins/i18n/iso-locale',
    '~/plugins/hotjar.client',
    '~/plugins/link',
    '~/plugins/vue-filters',
    '~/plugins/vue-directives',
    '~/plugins/vue-announcer.client',
    '~/plugins/vue-masonry.client',
    '~/plugins/vue-scrollto.client',
    '~/plugins/ab-testing',
    '~/plugins/features'
  ],

  buildModules: [
    '~/modules/contentful',
    '~/modules/axios-logger',
    '~/modules/http',
    '~/modules/query-sanitiser',
    '@nuxtjs/auth'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '~/modules/elastic-apm',
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    ['@nuxtjs/i18n', {
      locales: i18nLocales,
      baseUrl: ({ $config }) => $config.app.baseUrl,
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
      // Include oauth2 so that ~/plugins/authScheme can extend it
      _oauth2: {
        _scheme: 'oauth2'
      },
      keycloak: {
        _scheme: '~/plugins/authScheme'
      }
    },
    defaultStrategy: 'keycloak',
    plugins: ['~/plugins/apis', '~/plugins/user-likes.client']
  },

  router: {
    middleware: ['trailing-slash', 'legacy/index', 'l10n', 'contentful-galleries'],
    extendRoutes(routes) {
      const nuxtHomeRouteIndex = routes.findIndex(route => route.name === 'home');
      routes[nuxtHomeRouteIndex] = {
        name: 'home',
        path: '/',
        component: 'src/pages/home/index.vue'
      };

      const nuxtCollectionsPersonsOrPlacesRouteIndex = routes.findIndex(route => route.name === 'collections-persons-or-places');
      routes.splice(nuxtCollectionsPersonsOrPlacesRouteIndex, 1);

      routes.push({
        name: 'collections-persons',
        path: '/collections/persons',
        component: 'src/pages/collections/persons-or-places.vue'
      });

      routes.push({
        name: 'collections-places',
        path: '/collections/places',
        component: 'src/pages/collections/persons-or-places.vue'
      });

      routes.push({
        name: 'slug',
        path: '/*',
        component: 'src/pages/index.vue'
      });
    },
    linkExactActiveClass: 'exact-active-link',
    parseQuery,
    stringifyQuery
  },

  serverMiddleware: [
    // We can't use /api as that's reserved on www.europeana.eu for (deprecated)
    // access to Europeana APIs.
    { path: '/_api', handler: '~/server-middleware/api' },
    { path: '/robots.txt', handler: '~/server-middleware/robots.txt' },
    '~/server-middleware/logging',
    '~/server-middleware/referrer-policy',
    '~/server-middleware/record-json'
  ],

  /*
  ** Build configuration
  */
  build: {
    // Do not enable extractCSS as it is unreliable.
    // See: https://github.com/nuxt/nuxt.js/issues/4219
    extractCSS: false,

    extend(config, { isClient }) {
      // Extend webpack config only for client bundle
      if (isClient) {
        // Build source maps to aid debugging in production builds
        config.devtool = 'source-map';
      }
    },

    // Prevent irrelevant postcss warnings
    // See https://github.com/postcss/postcss/issues/1375
    postcss: null,

    publicPath: buildPublicPath(),

    // swiper v8 (and its dependencies) is pure ESM and needs to be transpiled to be used by Vue2
    transpile: ['dom7', 'ssr-window', 'swiper']
  },

  /*
  ** Enable modern builds
  */
  modern: true,

  /*
  ** Render configuration
   */
  render: {
    // Disable compression: leave it to a gateway/reverse proxy like NGINX or
    // Cloudflare.
    compressor: false,

    static: {
      maxAge: '1d'
    }
  },

  srcDir: 'src/',

  // Opt-out of telemetry
  telemetry: false,

  watch: ['~/**/*.graphql']
};
