import { getEntityQuery } from '../plugins/europeana/entity';

export default {
  state: () => ({
    curatedEntities: null,
    entity: null,
    id: null,
    page: null,
    recordsPerPage: 24,
    relatedEntities: null,
    pinned: null,
    featureSetId: null
  }),

  mutations: {
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
    setCuratedEntities(state, value) {
      state.curatedEntities = value;
    },
    setPins(state, value) {
      state.pins = value;
    },
    setFeatureSetId(state, value) {
      state.featureSetId = value;
    },
    setPinned(state, value) {
      state.pinned = value;
    }
  },

  getters: {
    englishPrefLabel(state) {
      if (!state.id || !state.entity || !state.entity || !state.entity.prefLabel.en) {
        return null;
      }
      return state.entity.prefLabel.en;
    },

    curatedEntity: (state) => (uri) => {
      return state.curatedEntities.find(entity => entity.identifier === uri);
    },

    id(state) {
      return state.id ? state.id : null;
    },

    featureSetId(state) {
      return state.featureSetId;
    }
  },

  actions: {
    async searchForRecords({ getters, dispatch, commit, state }, query) {
      if (!state.entity) {
        return;
      }

      await dispatch('search/activate', null, { root: true });

      const userParams = Object.assign({}, query);

      const entityUri = state.id;

      const overrideParams = {
        qf: [],
        rows: state.recordsPerPage
      };

      const curatedEntity = getters.curatedEntity(entityUri);
      if (curatedEntity && curatedEntity.genre) {
        overrideParams.qf.push(`collection:${curatedEntity.genre}`);
      } else {
        const entityQuery = getEntityQuery(entityUri);
        overrideParams.qf.push(entityQuery);

        if (!userParams.query) {
          const englishPrefLabel = getters.englishPrefLabel;
          if (englishPrefLabel) {
            overrideParams.query = englishPrefLabel;
          }
        }
      }

      commit('search/set', ['userParams', userParams], { root: true });
      commit('search/set', ['overrideParams', overrideParams], { root: true });

      await dispatch('search/run', {}, { root: true });
    },
    getFeatured({ commit, state, dispatch }) {
      const searchParams = {
        query: 'type:EntityBestItemsSet',
        qf: `subject:${state.id}`
      };
      return this.$apis.set.search(searchParams)
        .then(searchResponse => {
          searchResponse.data.total > 0 ? commit('setFeatureSetId', searchResponse.data.items[0]) : ({});
          if (state.featureSetId) {
            // set exists
            dispatch('getPins', state.featuredSetId);
          }
        });
    },
    pin({ dispatch, state }, itemId) {
      return this.$apis.set.modifyItems('add', state.featureSetId, itemId)
        .then(() => {
          dispatch('getPins', state.featureSetId);
        })
        .catch(() => {
          dispatch('getPins', state.featuredSetId);
        });
    },
    getPins({ state, commit }) {
      return this.$apis.set.getSet(state.featureSetId, {
        pageSize: 100,
        profile: 'itemDescriptions'
      }).then(featured => featured.pinned ? commit('setFeatured', featured.items.slice(0, featured.pinned - 1)) : []);
    }
  }
};
