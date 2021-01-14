export const klaroConfig = {
  testing: false,
  elementID: 'eu-klaro',
  storageMethod: 'cookie',
  cookieExpiresAfterDays: 15,
  translations: {
    en: {
      purposes: {
        performance: {
          title: 'Performance optimization',
          description: 'These services process personal information to optimize the service that this website offers.'
        },
        marketing: {
          title: 'Marketing',
          description: 'These services process personal information to help us better understand user behavior by tracking user flows and engagement.'
        },
        service: {
          title: 'Service provision',
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
      name: 'Google Analytics',
      purposes: ['marketing'],
      cookies: [
        '_ga',
        '_gid',
        '_gat_UA-12776629-19'
      ],
      translations: {
        en: {
          title: 'Google Analytics'
        }
      }
    },
    {
      name: 'Hotjar',
      purposes: ['marketing'],
      cookies: [
        '_hjid',
        '_hjTLDTest'
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
        '?'
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
  mustConsent: true,
  acceptAll: true,
  callback: (consent, service) => {
    console.log(
      'User consent for service ' + service.name + ': consent=' + consent
    );
  }
};
