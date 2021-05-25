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
        name: 'google-analytics', // https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage#gtagjs_google_analytics_4_-_cookie_usage
        purposes: ['usage'],
        cookies: [
          /^_ga(_.*)?/,
          '_gid'
        ],
        translations: translations('klaro.services.google-analytics')
      },
      {
        name: 'hotjar', // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
        purposes: ['usage'],
        cookies: [
          /^_hj(.*)?/
        ],
        translations: translations('klaro.services.hotjar')
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
        name: 'searchResultsView',
        purposes: ['essential'],
        cookies: [
          'searchResultsView'
        ],
        required: true,
        translations: translations('klaro.services.searchResultsView')
      },
      {
        name: 'debugSettings',
        purposes: ['essential'],
        cookies: [
          'debugSettings'
        ],
        required: true,
        translations: translations('klaro.services.debugSettings')
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
    hideDeclineAll: true,
    acceptAll: true,
    callback: (consent, service) => {
      if (service.name === 'google-analytics' && consent) {
        $gtm.init($gtmId);
      }
    }
  };
};
