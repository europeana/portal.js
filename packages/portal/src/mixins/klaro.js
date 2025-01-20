export const version = '0.7.18';
import services from '@/utils/services/services.js';
import waitFor from '@/utils/waitFor.js';

export default {
  props: {
    // context-specific whitelist of services to declare in klaro, e.g.
    // `:klaro-services="['auth-strategy', 'i18n']"`
    klaroServices: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      klaro: null,
      klaroManager: null
    };
  },

  watch: {
    '$i18n.locale': 'renderKlaro'
  },

  mounted() {
    waitFor(() => window.klaro, { name: 'Klaro' })
      .then(() => {
        if (!this.klaro) {
          this.klaro = window.klaro;
        }

        // If Matomo plugin is installed, wait for Matomo to load, but still render
        // Klaro if it fails to.
        waitFor(() => this.$matomo, this.$config.matomo.loadWait)
          .catch(() => {})
          .finally(this.renderKlaro);
      });
  },

  head() {
    return {
      script: [
        {
          src: `https://cdn.jsdelivr.net/npm/klaro@${version}/dist/klaro-no-css.js`
        }
      ]
    };
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

      if (this.$features.embeddedMediaNotification) {
        eventName && this.checkConsentAndOpenEmbed?.();
      } else {
        // TODO: remove on feature toggle clean up
        eventName && this.trackKlaroClickEvent(eventName);
      }
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
