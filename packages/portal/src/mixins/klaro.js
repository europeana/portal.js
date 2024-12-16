export const version = '0.7.18';

const klaroAllServices = [
  {
    cookies: ['auth.strategy'],
    name: 'auth-strategy',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['debugSettings'],
    name: 'debugSettings',
    purposes: ['essential'],
    required: true
  },
  {
    // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
    cookies: [/^_hj/],
    name: 'hotjar',
    purposes: ['usage']
  },
  {
    cookies: ['i18n_locale_code'],
    name: 'i18n',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: [/^_pk_/, 'mtm_cookie_consent'],
    name: 'matomo',
    purposes: ['usage']
  },
  {
    cookies: ['new_feature_notification'],
    name: 'newFeatureNotification',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['searchResultsView'],
    name: 'searchResultsView',
    purposes: ['essential'],
    required: true
  }
];

export default {
  data() {
    return {
      cookieConsentRequired: false,
      klaro: null,
      klaroHeadScript: { src: `https://cdn.jsdelivr.net/npm/klaro@${version}/dist/klaro-no-css.js`, defer: true },
      klaroManager: null,
      // context-specific whitelist of services to declare in klaro, e.g.
      // `klaroServices: ['auth-strategy', 'i18n']`
      klaroServices: null
    };
  },

  watch: {
    '$i18n.locale': 'renderKlaro'
  },

  mounted() {
    if (!this.klaro) {
      this.klaro = window.klaro;
    }

    // If Matomo plugin is installed, wait for Matomo to load, but still render
    // Klaro if it fails to.
    const renderKlaroAfter = this.$waitForMatomo ? this.$waitForMatomo() : Promise.resolve();
    renderKlaroAfter.catch(() => {}).finally(this.renderKlaro);
  },

  computed: {
    klaroConfig() {
      const services = klaroAllServices
        .filter((service) => !this.klaroServices || this.klaroServices.includes(service.name))
        .map((service) => ({
          ...service,
          translations: {
            [this.$i18n.locale]: this.$t(`klaro.services.${service.name}`)
          }
        }));

      return {
        acceptAll: true,
        callback: this.klaroServiceConsentCallback,
        cookieExpiresAfterDays: 15,
        elementID: 'eu-klaro',
        htmlTexts: true,
        lang: this.$i18n.locale,
        mustConsent: false,
        services,
        storageMethod: 'cookie',
        testing: false,
        translations: {
          [this.$i18n.locale]: this.$t('klaro.main')
        }
      };
    }
  },

  methods: {
    renderKlaro() {
      if (this.klaro) {
        this.klaroManager = this.klaro.getManager(this.klaroConfig);

        this.cookieConsentRequired = !this.klaroManager.confirmed;

        this.klaro.render(this.klaroConfig, true);
        this.klaroManager.watch({ update: this.watchKlaroManagerUpdate });
      }
    },

    watchKlaroManagerUpdate(manager, eventType, data) {
      let eventName;

      if (eventType === 'saveConsents') {
        eventName = {
          accept: 'Okay/Accept all',
          decline: 'Decline',
          save: 'Accept selected'
        }[data.type];
      }

      eventName && this.trackKlaroClickEvent(eventName);
    },

    trackKlaroClickEvent(eventName) {
      this.$matomo?.trackEvent('Klaro', 'Clicked', eventName);
    },

    klaroServiceConsentCallback(consent, service) {
      if (service.name === 'hotjar' && consent) {
        this.initHotjar?.();
      }
      if (service.name === 'matomo' && consent) {
        this.$matomo?.rememberCookieConsentGiven();
      }
    }
  }
};
