import axios from 'axios';

const STORE_MODULE_NAME = 'axiosLogger';

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

export default ({ store, app }, inject) => {
  store.registerModule(STORE_MODULE_NAME, storeModule);

  const requestInterceptor = config => {
    const uri = axios.getUri(config);
    const url = `${config.baseURL || ''}${uri}`;
    const method = config.method.toUpperCase();
    store.commit(`${STORE_MODULE_NAME}/push`, { method, url });

    return config;
  };

  app.router.beforeEach((to, from, next) => {
    if (!store.state[STORE_MODULE_NAME].recording) {
      store.commit(`${STORE_MODULE_NAME}/reset`);
      store.commit(`${STORE_MODULE_NAME}/start`);
    }

    next();
  });

  app.router.afterEach(() => {
    // Only stop recording client side to prevent SSR then CSR `afterEach` calls
    // for the same routing resetting the logger before the CSR.
    if (process.client) store.commit(`${STORE_MODULE_NAME}/stop`);
  });

  inject('axiosLogger', requestInterceptor);
};
