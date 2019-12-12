import createClient from '../plugins/contentful';

export const state = () => ({
  data: {}
});

export const mutations = {
  setLinks(state, data) {
    state.data[data.identifier] = data.data;
  }
};

const contentfulClient = createClient();

export const actions = {
  async init({ commit }) {
    await contentfulClient.getEntries({
      'locale': this.app.i18n.isoLocale(),
      'content_type': 'linkGroup',
      'fields.identifier[in]': 'mainNavigation,footerMoreInfo,footerHelp'
    })
      .then((response) => {
        response.items.forEach(item => {
          commit('setLinks', {
            identifier: item.fields.identifier,
            data: {
              name: item.fields.name ? item.fields.name : null,
              links: item.fields.links.map(item => item.fields)
            }
          });
        });
      }).catch(err => {
        throw new Error(err);
      });
  }
};
