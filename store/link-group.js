import createClient from '../plugins/contentful';

export const state = () => ({
  links: {}
});

export const mutations = {
  setLinks(state, data) {
    state.links[data.identifier] = data.links;
  }
};

const contentfulClient = createClient();

export const actions = {
  async init({ commit }) {
    await contentfulClient.getEntries({
      'locale': this.app.i18n.isoLocale(),
      'content_type': 'linkGroup',
      'fields.identifier[in]': 'mainNavigation,footer'
    })
      .then((response) => {
        response.items.forEach(item => {
          console.log('monkey', item.fields.footerMoreInfo);
          commit('setLinks', {
            identifier: item.fields.identifier,
            links: item.fields.links.map(item => item.fields),
            footerMoreInfo: item.fields.footerMoreInfo ? item.fields.footerMoreInfo.map(item => item.fields) : null,
            footerHelp: item.fields.footerHelp ? item.fields.footerHelp.map(item => item.fields) : null
          });
        });
      }).catch(err => {
        throw new Error(err);
      });
  }
};
