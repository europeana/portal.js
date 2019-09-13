import contentfulClient from '../plugins/contentful.js';

export const state = () => ({
  data: []
});

export const mutations = {
  setData(state, data) {
    state.data = data;
  }
};

export const actions = {
  async init({ commit }) {
    const data = await contentfulClient.getEntries({
      'content_type': 'pageNavigation',
      'fields.identifier': 'pageNavigation'
    })
      .then((response) => {
        if (response.total === 0) {
          return [];
        }
        return response.items[0].fields.navigationItems.map(item => item.fields);
      }).catch((e) => {
        // This will just output the error as text
        return [{ text: e.toString() }];
      });
    commit('setData', data);
  }
};
