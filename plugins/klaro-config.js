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
        service: {
          title: 'Service provision',
          description: 'These services are essential for the correct functioning of this website. You cannot disable them here as the service would not work correctly otherwise.'
        }
      }
    }
  },
  services: [
    {
      name: 'i18n',
      purposes: ['performance'],
      cookies: [
        'i18n_locale_code'
      ],
      translations: {
        en: {
          title: 'Language code'
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
    }
  ],
  mustConsent: true,
  acceptAll: true
};
