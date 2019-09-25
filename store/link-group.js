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
    const i18n = this.app.i18n;
    function isoLookUp(code) {
      const locales = i18n.locales;
      return locales.find(locale => locale.code === code)['iso'];
    }

    const setLocale = i18n.locale;

    await contentfulClient.getEntries({
      'locale': isoLookUp(setLocale),
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
