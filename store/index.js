import axios from 'axios';

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await axios.all([
      dispatch('link-group/init'),
      dispatch('entity/init')
    ]);
  }
};
