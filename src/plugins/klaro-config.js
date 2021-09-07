export default ($i18n, $initHotjar, $matomo, $abTestingConsent = false) => {
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

  const services = [
    service('matomo', ['usage'], [/^_pk(_.*)?/, 'mtm_cookie_consent']),
    // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
    service('hotjar', ['usage'], [/^_hj(.*)?/]),
    service('i18n', ['essential'], ['i18n_locale_code'], true),
    service('searchResultsView', ['essential'], ['searchResultsView'], true),
    service('debugSettings', ['essential'], ['debugSettings'], true),
    service('auth-strategy', ['essential'], ['auth.strategy'], true)
  ];

  // conditional services
  if ($abTestingConsent) {
    services.push(service('abTest', ['usage'], [/^eu-ab-(.*)?/]));
  }

  return {
    testing: false,
    elementID: 'eu-klaro',
    storageMethod: 'cookie',
    cookieExpiresAfterDays: 15,
    lang: locale,
    htmlTexts: true,
    translations: translations('klaro.main'),
    services,
    mustConsent: false,
    acceptAll: true,
    callback: (consent, service) => {
      if (service.name === 'hotjar' && consent) {
        $initHotjar && $initHotjar();
      }
      if (service.name === 'matomo' && consent) {
        $matomo && $matomo.rememberCookieConsentGiven();
      }
      if (service.name === 'abTest' && consent) {
        $abTestingConsent && $abTestingConsent(true);
      }
    }
  };
};
