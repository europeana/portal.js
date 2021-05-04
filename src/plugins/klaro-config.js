export const klaroConfig = {
  testing: false,
  elementID: 'eu-klaro',
  storageMethod: 'cookie',
  cookieExpiresAfterDays: 15,
  translations: {
    en: {
      consentNotice: {
        description: `We care about your privacy and only use data to improve your experience. We don’t use any personal information for advertising. 
        You can change your consent every 15 days.`
      },
      consentModal: {
        description: 'We take your data privacy seriously and do not record or share any personal information for advertising purposes. You\'re in charge! Enable or disable features as you see fit',
        title: 'Recommended features'
      },
      ok: 'Okay',
      service: {
        disableAll: {
          description: 'Use this switch to enable or disable all optional features.',
          title: 'Enable or disable all features'
        }
      },
      purposes: {
        usage: {
          title: 'Website speed, feedback, and usage',
          description: 'These features use information to help us better understand how this website gets used.'
        },
        essential: {
          title: 'Essential features',
          description: 'These features are essential for the correct functioning of this website. You cannot disable them here as the website would not work correctly otherwise.'
        }
      }
    }
  },
  services: [
    {
      name: 'searchResultsView',
      purposes: ['usage'],
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
      purposes: ['usage'],
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
      purposes: ['usage'],
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
      purposes: ['usage'],
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
      purposes: ['usage'],
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
      purposes: ['essential'],
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
      purposes: ['essential'],
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
      purposes: ['essential'],
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
      `User consent for service ${service.name}: consent=${consent}`
    );
  }
};
