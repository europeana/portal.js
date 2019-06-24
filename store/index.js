export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('footer/init');
  }
};
