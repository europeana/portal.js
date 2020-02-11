import createClient from '../plugins/contentful';
const contentfulClient = createClient();

export const state = () => ({
  entity: null,
  id: null,
  page: null,
  relatedEntities: null,
  collections: {},
  curatedEntities: null
});

export const mutations = {
  setEntity(state, value) {
    state.entity = value;
  },
  setId(state, value) {
    state.id = value;
  },
  setPage(state, value) {
    state.page = value;
  },
  setRelatedEntities(state, value) {
    state.relatedEntities = value;
  },
  setCollections(state, value) {
    state.collections = value;
  },
  setCuratedEntities(state, value) {
    state.curatedEntities = value;
  }
};

export const actions = {
  async init({ commit }) {
    // TODO: account for potential pagination if > 1,000 entries
    await contentfulClient.getEntries({
      'content_type': 'entityPage',
      'fields.genre[exists]': 'true',
      'include': 0,
      'limit': 1000
    })
      .then((response) => {
        const collections = response.items.reduce((memo, entityPage) => {
          memo[entityPage.fields.identifier] = entityPage.fields.genre;
          return memo;
        }, {});

        commit('setCollections', collections);
      }).catch(error => {
        throw error;
      });
  }
};
