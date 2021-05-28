export default ($i18n, $gtm, $gtmId) => {
  // TODO: uncomment when we have translations
  // const locale = $i18n.locale;
  // TODO: remove when we have translations
  const locale = 'en';
  const translations = key => ({
    [locale]: $i18n.t(key)
  });

  const service = (name, purposes, cookies, required = false) => ({
    name,
    purposes,
    cookies,
    required,
    translations: translations(`klaro.services.${name}`)
  });

  return {
    testing: false,
    elementID: 'eu-klaro',
    storageMethod: 'cookie',
    cookieExpiresAfterDays: 15,
    lang: locale,
    translations: translations('klaro.main'),
    services: [
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage#gtagjs_google_analytics_4_-_cookie_usage
      service('google-analytics', ['usage'], [/^_ga(_.*)?/, '_gid']),
      // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
      service('hotjar', ['usage'], [/^_hj(.*)?/]),
      service('i18n', ['essential'], ['i18n_locale_code'], true),
      service('searchResultsView', ['essential'], ['searchResultsView'], true),
      service('debugSettings', ['essential'], ['debugSettings'], true),
      service('auth-strategy', ['essential'], ['auth.strategy'], true)
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
