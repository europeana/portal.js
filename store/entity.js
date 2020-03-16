import createClient from '../plugins/contentful';
const contentfulClient = createClient();

import { getEntityQuery } from '../plugins/europeana/entity';

export const state = () => ({
  entity: null,
  id: null,
  page: null,
  recordsPerPage: 9,
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

export const getters = {
  englishPrefLabel(state) {
    if (!state.id || !state.entity || !state.entity || !state.entity.prefLabel.en) {
      return null;
    }
    return state.entity.prefLabel.en;
  },
  id(state) {
    if (!state.id) {
      return null;
    }
    return state.id;
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
  },

  async searchForRecords({ getters, dispatch, commit, state }, query) {
    if (!state.entity) return;

    await dispatch('search/activate', null, { root: true });

    const userParams = Object.assign({}, query);

    const entityUri = state.id;

    const overrideParams = {
      qf: [],
      rows: state.recordsPerPage
    };

    if (state.collections[entityUri]) {
      overrideParams.qf.push(`collection:${state.collections[entityUri]}`);
    } else {
      const entityQuery = getEntityQuery(entityUri);
      overrideParams.qf.push(entityQuery);

      if (!userParams.query) {
        const englishPrefLabel = getters.englishPrefLabel;
        if (englishPrefLabel) overrideParams.query = englishPrefLabel;
      }
    }

    commit('search/set', ['userParams', userParams], { root: true });
    commit('search/set', ['overrideParams', overrideParams], { root: true });

    await dispatch('search/run', {}, { root: true });
  }
};
