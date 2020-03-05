export default ({ app, store }, inject) => {
  // console.log('apis module plugin default function');
  // console.log('- app.req', app.req);
  // This is a template plugin.
  // Doc: https://nuxtjs.org/guide/modules#template-plugins
  const options = <%= JSON.stringify(options, null, 2) %>;

  app.$apis = options;
  inject('apis', options);

  if (store) {
    store.$apis = options

    console.log('Registering apis module');
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
