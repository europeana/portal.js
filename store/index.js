import axios from 'axios';

export const actions = {
  async nuxtServerInit({ dispatch }, context) {
    await axios.all([
      dispatch('link-group/init'),
      dispatch('entity/init')
    ]);
  }
};
