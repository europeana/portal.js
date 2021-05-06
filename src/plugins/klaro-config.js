export default $i18n => {
  // TODO: uncomment when we have translations
  // const locale = $i18n.locale;
  // TODO: remove when we have translations
  const locale = 'en';

  const translations = key => ({
    [locale]: $i18n.t(key)
  });

  return {
    testing: false,
    elementID: 'eu-klaro',
    storageMethod: 'cookie',
    cookieExpiresAfterDays: 15,
    // TODO: remove when we have translations; needed in the meantime else Klaro
    //       tries to use its own, detecting user's language from HTML lang attribute
    lang: 'en',
    translations: translations('klaro.main'),
    services: [
      {
        name: 'searchResultsView',
        purposes: ['usage'],
        cookies: [
          'searchResultsView'
        ],
        translations: translations('klaro.services.searchResultsView')
      },
      {
        name: 'debugSettings',
        purposes: ['usage'],
        cookies: [
          'debugSettings'
        ],
        translations: translations('klaro.services.debugSettings')
      },
      {
        name: 'google-analytics',
        purposes: ['usage'],
        cookies: [
          /^_ga(_.*)?/,
          '_gid'
        ],
        translations: translations('klaro.services.google-analytics')
      },
      {
        name: 'hotjar',
        purposes: ['usage'],
        cookies: [
          /^_hj(.*)?/
        ],
        translations: ('klaro.services.hotjar')
      },
      {
        name: 'google-optimize',
        purposes: ['usage'],
        cookies: [
          '?'
        ],
        translations: translations('klaro.services.google-optimize')
      },
      {
        name: 'cloudflare',
        purposes: ['essential'],
        cookies: [
          '_cfduid'
        ],
        required: true,
        translations: translations('klaro.services.cloudflare')
      },
      {
        name: 'i18n',
        purposes: ['essential'],
        cookies: [
          'i18n_locale_code'
        ],
        required: true,
        translations: translations('klaro.services.i18n')
      },
      {
        name: 'auth-strategy',
        purposes: ['essential'],
        cookies: [
          'auth.strategy'
        ],
        required: true,
        translations: translations('klaro.services.auth-strategy')
      }
    ],
    mustConsent: false,
    /*
      Defines the default state for services in the consent modal (true=enabled by
      default). You can override this setting in each service.
    */
    default: true,
    acceptAll: true
  };
};
