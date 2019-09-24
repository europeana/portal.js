import contentfulClient from '../plugins/contentful.js';

export const state = () => ({
  links: {}
});

export const mutations = {
  setLinks(state, data) {
    for (const d in data) {
      state.links[d] = data[d].fields;
    }
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
        if (response.total === 0) {
          return [];
        }
        return response.items.map(item => {
          commit('setLinks', {
            [item.fields.identifier]: {
              fields: item.fields.links.map(item => item.fields)
            }
          });
        });
      }).catch((e) => {
        // This will just output the error as text
        return [{ text: e.toString() }];
      });
  }
};
