import contentfulClient from '../plugins/contentful.js';

export const state = () => ({
  links: {}
});

export const mutations = {
  setLinks(state, data) {
    state.links[data.identifier] = data.links;
  }
};

export const actions = {
  async init({ commit }) {
    await contentfulClient.getEntries({
      'locale': this.app.i18n.isoLocale(),
      'content_type': 'linkGroup',
      'fields.identifier[in]': 'mainNavigation,footer'
    })
      .then((response) => {
        response.items.forEach(item => {
          commit('setLinks', {
            identifier: item.fields.identifier,
            links: item.fields.links.map(item => item.fields)
          });
        });
      }).catch(err => {
        throw new Error(err);
      });
  }
};
