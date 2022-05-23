const defaults = {
  enabled: false
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
      localStorage.debugSettings = JSON.stringify(settings);
    }
  }
};
