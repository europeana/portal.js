import rc from './rc';

export default ({ store, $config }, inject) => {
  const config = rc($config.europeana.apis, $config.europeana.originOverrides);
  inject('apis', config);

  if (store) {
    store.registerModule('apis', {
      namespaced: true,
      state: {
        configs: config,
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
