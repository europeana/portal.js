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
    featuredSetId: null
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
    setPinned(state, value) {
      if (value) {
        state.pinned = value.map(item => item.id);
      } else {
        state.pinned = [];
      }
    },
    setFeaturedSetId(state, value) {
      state.featuredSetId = value;
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

    isPinned: (state) => (itemId) => {
      return state.pinned ? state.pinned.includes(itemId) : false;
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
          searchResponse.data.total > 0 ? commit('setFeaturedSetId', searchResponse.data.items[0].split('/').pop()) : ({});
          if (state.featuredSetId) {
            dispatch('getPins');
          }
        });
    },
    pin({ dispatch, state }, itemId) {
      return dispatch('getPins')
        .then(() => {
          if (state.pinned && state.pinned.length >= 24) {
            throw new Error('too many pins');
          }
        })
        .then(() => {
          this.$apis.set.modifyItems('add', state.featuredSetId, itemId, true)
            .then(() =>  dispatch('getPins'))
            .catch(() => dispatch('getPins'));
        });
    },
    unpin({ dispatch, state }, itemId) {
      return this.$apis.set.modifyItems('delete', state.featuredSetId, itemId)
        .then(() =>  dispatch('getPins'))
        .catch(() => dispatch('getPins'));
    },
    getPins({ state, commit }) {
      return this.$apis.set.getSet(state.featuredSetId, {
        pageSize: 100,
        profile: 'itemDescriptions'
      }).then(featured => featured.pinned > 0 ? commit('setPinned', featured.items.slice(0, featured.pinned)) : commit('setPinned', []));
    },
    createFeaturedSet({ getters, commit }) {
      const featuredSetBody = {
        type: 'EntityBestItemsSet',
        title: { 'en': getters.englishPrefLabel + ' Page' },
        subject: [getters.id]
      };
      return this.$apis.set.createSet(featuredSetBody)
        .then(response => commit('setFeaturedSetId', response.id));
    }
  }
};
