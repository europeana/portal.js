export const version = '0.7.18';

export default {
  data() {
    return {
      cookieConsentRequired: false,
      klaro: null,
      klaroConsents: {},
      klaroHeadScript: { src: `https://cdn.jsdelivr.net/npm/klaro@${version}/dist/klaro-no-css.js`, defer: true },
      // context-specific whitelist of services to declare in klaro, e.g.
      // `klaroServices: ['auth-strategy', 'i18n']`
      klaroServices: null,
      toastBottomOffset: '20px'
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

  methods: {
    renderKlaro() {
      if (this.klaro) {
        const config = this.klaroConfig();
        const manager = this.klaro.getManager(config);

        this.cookieConsentRequired = !manager.confirmed;

        this.klaro.render(config, true);
        manager.watch({ update: this.watchKlaroManagerUpdate });

        console.log('klaro man', manager)

        setTimeout(() => {
          this.setToastBottomOffset();
        }, 100);
      }
    },

    setToastBottomOffset() {
      const cookieNoticeHeight = document.getElementsByClassName('cookie-notice')[0]?.offsetHeight;
      this.toastBottomOffset = cookieNoticeHeight ? `${cookieNoticeHeight + 40}px` : '20px';
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

      setTimeout(() => {
        this.setToastBottomOffset();
      }, 10);
    },

    trackKlaroClickEvent(eventName) {
      this.$matomo?.trackEvent('Klaro', 'Clicked', eventName);
    },

    klaroConfig() {
      const locale = this.$i18n.locale;
      const translations = key => ({
        [locale]: this.$t(key)
      });

      const service = (name, purposes, cookies, required = false) => ({
        name,
        purposes,
        cookies,
        required,
        translations: translations(`klaro.services.${name}`)
      });

      const services = [
        service('matomo', ['usage'], [/^_pk_/, 'mtm_cookie_consent']),
        // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
        service('hotjar', ['usage'], [/^_hj/]),
        service('i18n', ['essential'], ['i18n_locale_code'], true),
        service('searchResultsView', ['essential'], ['searchResultsView'], true),
        service('debugSettings', ['essential'], ['debugSettings'], true),
        service('auth-strategy', ['essential'], ['auth.strategy'], true),
        service('newFeatureNotification', ['essential'], ['new_feature_notification'], true)
      ].filter((service) => !this.klaroServices || this.klaroServices.includes(service.name));

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
          this.klaroConsents[service.name] = consent;
          // if (service.name === 'hotjar' && consent) {
          //   this.$initHotjar?.();
          // }
          if (service.name === 'matomo' && consent) {
            this.$matomo?.rememberCookieConsentGiven();
          }
        }
      };
    }
  }
};
