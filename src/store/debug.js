import klaroConfig from '../plugins/klaro-config';

const defaults = {
  apiRequests: false
};

export const state = () => ({
  settings: {}
});

export const getters = {
  settings(state) {
    let settings = state.settings;
    if (process.browser && localStorage.debugSettings) {
      settings = { ...defaults, ...JSON.parse(localStorage.debugSettings) };
    }
    return settings;
  }
};

export const mutations = {
  updateSettings(state, settings) {
    state.settings = { ...settings };
    if (process.browser) {
      const consent = window.klaro.getManager(klaroConfig(this.$i18n, this.$gtm, this.$config.gtm.id)).getConsent('debugSettings');
      if (consent) {
        localStorage.debugSettings = JSON.stringify(settings);
      }
    }
  }
};
