export const version = '0.7.18';
import services from '@/utils/services/services.js';
import waitFor from '@/utils/waitFor.js';
import initHotjar from '@/utils/hotjar.js';

import { ref } from 'vue';

// shared global instances across multiple components
let klaro = ref(null);
let klaroManager = ref(null);

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
        if (!klaro.value) {
          klaro.value = window.klaro;
        }
        if (!this.klaro) {
          this.klaro = klaro;
        }

        this.renderKlaro();
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
    cookieConsentRequired() {
      return this.klaroManager && !this.klaroManager.confirmed;
    },

    klaroConfig() {
      return {
        acceptAll: true,
        callback: this.klaroServiceConsentCallback,
        cookieExpiresAfterDays: 15,
        elementID: 'eu-klaro',
        htmlTexts: true,
        lang: this.$i18n.locale,
        mustConsent: false,
        services: services.filter((service) => !this.klaroServices || this.klaroServices.includes(service.name)),
        storageMethod: 'cookie',
        testing: false
      };
    }
  },

  methods: {
    renderKlaro() {
      if (this.klaro) {
        if (!klaroManager.value) {
          klaroManager.value = this.klaro.getManager(this.klaroConfig);
        }
        if (!this.klaroManager) {
          this.klaroManager = klaroManager;
        }

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

      eventName && this.checkConsentAndOpenEmbed?.();
    },

    // If Matomo plugin is installed, wait for Matomo to load, and run callback
    // if it does, else don't bother because it's down.
    waitForMatomo(callback) {
      waitFor(() => this.$matomo, this.$config.matomo.loadWait)
        .then(callback)
        .catch(() => {});
    },

    klaroServiceConsentCallback(consent, service) {
      if (service.name === 'matomo') {
        this.waitForMatomo(() => {
          if (consent) {
            this.$matomo?.rememberCookieConsentGiven();
          } else {
            this.$matomo?.forgetCookieConsentGiven();
          }
        });
      }

      if (service.name === 'hotjar') {
        if (consent) {
          initHotjar(this.$config?.hotjar?.id, this.$config?.hotjar?.sv);
        } else if (window.hj) {
          // hotjar tracking code offers no method to disable/unload it, so
          // reload the page to get rid of it
          window.location.reload();
        }
      }
    }
  }
};
