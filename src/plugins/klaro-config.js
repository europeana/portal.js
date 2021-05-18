export default ($i18n, $gtm, $gtmId) => {
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
    lang: locale,
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
        translations: translations('klaro.services.hotjar')
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
    acceptAll: true,
    callback: (consent, service) => {
      if (service.name === 'google-analytics' && consent) {
        $gtm.init($gtmId);
      }
    }
  };
};
