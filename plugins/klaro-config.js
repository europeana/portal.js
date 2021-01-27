export const klaroConfig = {
  testing: false,
  elementID: 'eu-klaro',
  storageMethod: 'cookie',
  cookieExpiresAfterDays: 15,
  translations: {
    en: {
      consentNotice: {
        description: 'Hi! Could you please enable some additional services for {purposes}? You can always change or withdraw your consent after 15 days.'
      },
      purposes: {
        performance: {
          title: 'Performance Optimization',
          description: 'These services process personal information to optimize the service that this website offers.'
        },
        marketing: {
          title: 'Analytics and Feedback',
          description: 'These services process personal information to help us better understand user behavior by tracking user flows and engagement.'
        },
        service: {
          title: 'Service Provision',
          description: 'These services are essential for the correct functioning of this website. You cannot disable them here as the service would not work correctly otherwise.'
        }
      }
    }
  },
  services: [
    {
      name: 'searchResultsView',
      purposes: ['performance'],
      cookies: [
        'searchResultsView'
      ],
      translations: {
        en: {
          title: 'Search results view'
        }
      }
    },
    {
      name: 'debugSettings',
      purposes: ['performance'],
      cookies: [
        'debugSettings'
      ],
      translations: {
        en: {
          title: 'Debug toggle'
        }
      }
    },
    // Jira service desk
    // {
    //   name: '',
    //   purposes: ['performance'],
    //   cookies: [
    //     ''
    //   ],
    //   translations: {
    //     en: {
    //       title: 'Jira service desk'
    //     }
    //   }
    // },
    {
      name: 'google-analytics',
      purposes: ['marketing'],
      cookies: [
        /^_ga(_.*)?/,
        '_gid'
      ],
      translations: {
        en: {
          title: 'Google Analytics'
        }
      }
    },
    {
      name: 'hotjar',
      purposes: ['marketing'],
      cookies: [
        /^_hj(.*)?/
      ],
      translations: {
        en: {
          title: 'Hotjar'
        }
      }
    },
    {
      name: 'Google Optimize',
      purposes: ['marketing'],
      cookies: [
        'exp'
      ],
      translations: {
        en: {
          title: 'Google Optimize'
        }
      }
    },
    {
      name: '_cfduid',
      purposes: ['service'],
      cookies: [
        '_cfduid'
      ],
      required: true,
      translations: {
        en: {
          title: 'Cloudflare'
        }
      }
    },
    {
      name: 'i18n',
      purposes: ['service'],
      cookies: [
        'i18n_locale_code'
      ],
      required: true,
      translations: {
        en: {
          title: 'Language code'
        }
      }
    },
    {
      name: 'auth.strategy',
      purposes: ['service'],
      cookies: [
        'auth.strategy'
      ],
      required: true,
      translations: {
        en: {
          title: 'Auth Strategy'
        }
      }
    }
  ],
  mustConsent: false,
  /*
    Defines the default state for services in the consent modal (true=enabled by
    default). You can override this setting in each service.
  */
  default: true,
  acceptAll: true,
  callback: (consent, service) => {
    console.log(
      'User consent for service ' + service.name + ': consent=' + consent
    );
  }
};
