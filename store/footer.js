import contentfulClient from '../plugins/contentful.js';

export const state = () => ({
  links: []
});

export const mutations = {
  setLinks (state, links) {
    state.links = links;
  }
};

export const actions = {
  async init ({ commit }) {
    const data = await contentfulClient.getEntries({
      'content_type': 'linkGroup',
      'fields.identifier': 'footer',
      'limit': 1
    })
      .then((response) => {
        if (response.total === 0) {
          return [];
        }
        return response.items[0].fields.links.map(item => {
          return item.fields;
        });
      }).catch((e) => {
        // This will just output the error as text
        return [{ text: e.toString() }];
      });
    commit('setLinks', data);
  }
};
