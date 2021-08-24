export default ($i18n, $initHotjar) => {
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
    htmlTexts: true,
    translations: translations('klaro.main'),
    services: [
      // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
      service('hotjar', ['usage'], [/^_hj(.*)?/]),
      service('i18n', ['essential'], ['i18n_locale_code'], true),
      service('searchResultsView', ['essential'], ['searchResultsView'], true),
      service('debugSettings', ['essential'], ['debugSettings'], true),
      service('auth-strategy', ['essential'], ['auth.strategy'], true)
    ],
    mustConsent: false,
    acceptAll: true,
    callback: (consent, service) => {
      if (service.name === 'hotjar' && consent) {
        $initHotjar();
      }
    }
  };
};
