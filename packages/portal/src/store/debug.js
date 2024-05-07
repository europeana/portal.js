// TODO: deprecate if only used for the apiKey, which could be handled fully
//       by DebugApiRequests component
const defaults = {
  apiKey: null
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
