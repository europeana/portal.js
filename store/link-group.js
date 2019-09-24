import contentfulClient from '../plugins/contentful.js';

export const state = () => ({
  links: {}
});

export const mutations = {
  setLinks(state, data) {
    state.links = data;
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
    const links = await contentfulClient.getEntries({
      'locale': isoLookUp(setLocale),
      'content_type': 'linkGroup',
      'fields.identifier[in]': 'mainNavigation,footer'
    })
      .then((response) => {
        if (response.total === 0) {
          return [];
        }
        return response.items.map(item => {
          return {
            identifier: item.fields.identifier,
            fields: item.fields.links.map(item => item.fields)
          };
        });
      }).catch((e) => {
        // This will just output the error as text
        return [{ text: e.toString() }];
      });
    commit('setLinks', links);
  }
};
