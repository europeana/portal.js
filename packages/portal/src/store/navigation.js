export default {
  state: () => ({
    browserNative: false
  }),

  mutations: {
    updateBrowserNative(state, browserNative) {
      state.browserNative = browserNative;
    }
  }
};
