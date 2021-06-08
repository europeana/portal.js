const storeModule = {
  namespaced: true,

  state: () => ({
    page: null
  }),

  mutations: {
    setPage(state, page) {
      state.page = page;
    }
  }
};

export default ({ store }) => {
  if (store) {
    store.registerModule('sanitised', storeModule);
  }
};
