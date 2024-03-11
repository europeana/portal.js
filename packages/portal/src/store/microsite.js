export const state = () => ({
  home: null
});

export const mutations = {
  init(state, { req }) {
    state.home = req?.headers?.['x-europeana-microsite-home'] || null;
  }
};
