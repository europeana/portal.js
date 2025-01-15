export const version = '0.7.18';
import services from '@/utils/services/services.js';

export default {
  data() {
    return {
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
    cookieConsentRequired()  {
      return this.klaroManager && !this.klaroManager.confirmed;
    },

    klaroAllServices() {
      return this.$features.embeddedMediaNotification ? services : services.filter((cookie) => !cookie.purposes.includes('thirdPartyContent'));
    },

    klaroConfig() {
      const services = this.klaroAllServices
        .filter((service) => !this.klaroServices || this.klaroServices.includes(service.name))
        .map((service) => ({
          ...service,
          // TODO: remove translation data, we can access translations directly in the custom modal
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

        this.klaro.render(this.klaroConfig, true);
        !this.$features.embeddedMediaNotification && this.klaroManager.watch({ update: this.watchKlaroManagerUpdate });
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
      if (service.name === 'matomo') {
        if (consent) {
          this.$matomo?.rememberCookieConsentGiven();
        } else {
          this.$matomo?.forgetCookieConsentGiven();
        }
      }

      if (service.name === 'hotjar') {
        if (consent) {
          this.initHotjar?.();
        } else if (window.hj) {
          // hotjar tracking code offers no method to disable/unload it, so
          // reload the page to get rid of it
          window.location.reload();
        }
      }
    }
  }
};
