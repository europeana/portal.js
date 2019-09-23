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
    const i18n = this.app.context.app.i18n;
    function isoLookUp(code) {
      const locales = i18n.locales;
      return locales.find(locale => locale.code === code)['iso'];
    }

    const setLocale = i18n.locale;
    const data = await contentfulClient.getEntries({
      'locale': isoLookUp(setLocale),
      'content_type': 'linkGroup',
      'fields.identifier': 'mainNavigation'
    })
      .then((response) => {
        if (response.total === 0) {
          return [];
        }
        return response.items[0].fields.links.map(item => item.fields);
      }).catch((e) => {
        // This will just output the error as text
        return [{ text: e.toString() }];
      });
    commit('setData', data);
  }
};
