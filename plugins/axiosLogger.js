import axios from 'axios';

const storeModule = {
  namespaced: true,

  state: () => ({
    requests: [],
    recording: false
  }),

  mutations: {
    start(state) {
      state.recording = true;
    },
    stop(state) {
      state.recording = false;
    },
    push(state, request) {
      state.requests.push(request);
    },
    reset(state) {
      state.requests = [];
    }
  }
};

export default ({ store, app }) => {
  store.registerModule('axiosLogger', storeModule);

  // TODO: only if enabled. store enabled state, and active with debug UI.
  axios.interceptors.request.use(config => {
    const uri = axios.getUri(config);
    const method = config.method.toUpperCase();
    store.commit('axiosLogger/push', { method, uri });
    return config;
  });

  app.router.beforeEach((to, from, next) => {
    if (!store.state.axiosLogger.recording) {
      store.commit('axiosLogger/reset');
      store.commit('axiosLogger/start');
    }
    next();
  });

  app.router.afterEach(() => {
    // Only stop recording client side to prevent SSR then CSR `afterEach` calls
    // for the same routing resetting the logger before the CSR.
    if (process.client) store.commit('axiosLogger/stop');
  });
};
