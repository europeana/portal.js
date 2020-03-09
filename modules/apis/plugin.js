export default ({ app, store }, inject) => {
  const options = <%= JSON.stringify(options, null, 2) %>;

  app.$apis = options;
  inject('apis', options);

  if (store) {
    store.registerModule('apis', {
      namespaced: true,
      state: {
        configs: options,
        origin: null
      },
      mutations: {
        setOrigin: (state, value) => {
          state.origin = value;
        }
      },
      getters: {
        config: (state) => {
          return state.configs[state.origin] || state.configs.defaults;
        }
      }
    });
  }
};
