import { baseVariantEntityUris } from '@/plugins/europeana/entity';

export default {
  state: () => ({
    curatedEntities: null,
    entity: null,
    id: null,
    recordsPerPage: 24,
    pinned: null,
    featuredSetId: null,
    editable: false
  }),

  mutations: {
    setEntity(state, value) {
      state.entity = value;
    },
    setId(state, value) {
      state.id = value;
    },
    setCuratedEntities(state, value) {
      state.curatedEntities = value;
    },
    setPinned(state, value) {
      state.pinned = value || [];
    },
    setFeaturedSetId(state, value) {
      state.featuredSetId = value;
    },
    pin(state, itemId) {
      state.pinned.push(itemId);
    },
    unpin(state, itemId) {
      state.pinned.splice(state.pinned.indexOf(itemId), 1);
    },
    setEntityDescription(state, value) {
      state.entity.note = value;
    },
    setEditable(state, value) {
      state.editable = value;
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
      // TODO: baseVariantEntityUris lookup won't be needed when the entity API returns consistent URIs.
      return state.curatedEntities.find(entity => baseVariantEntityUris(entity.identifier)[0] === baseVariantEntityUris(uri)[0]);
    },

    id(state) {
      return state.id ? state.id : null;
    },

    featuredSetId(state) {
      return state.featuredSetId ? state.featuredSetId : null;
    },

    isPinned: (state) => (itemId) => {
      return state.pinned ? state.pinned.includes(itemId) : false;
    }
  },

  actions: {
    getFeatured({ commit, state, dispatch }) {
      const searchParams = {
        query: 'type:EntityBestItemsSet',
        qf: `subject:${state.id}`
      };
      return this.$apis.set.search(searchParams)
        .then(searchResponse => {
          if (searchResponse.data.total > 0) {
            commit('setFeaturedSetId', searchResponse.data.items[0].split('/').pop());
            dispatch('getPins');
          }
        });
    },
    pin({ dispatch, state, commit }, itemId) {
      return dispatch('getPins')
        .then(() => {
          if (state.pinned && state.pinned.length >= 24) {
            return Promise.reject(new Error('too many pins'));
          } else {
            return this.$apis.set.modifyItems('add', state.featuredSetId, itemId, true)
              .then(() =>  commit('pin', itemId));
          }
        })
        .catch((e) => {
          dispatch('getPins');
          throw e;
        });
    },
    unpin({ dispatch, state }, itemId) {
      return this.$apis.set.modifyItems('delete', state.featuredSetId, itemId)
        .then(() =>  {
          dispatch('set/fetchActive', state.featuredSetId, { root: true });
          dispatch('getPins');
        })
        .catch((e) => {
          dispatch('getPins');
          throw e;
        });
    },
    getPins({ state, commit }) {
      return this.$apis.set.get(state.featuredSetId, {
        profile: 'standard',
        pageSize: 100
      }).then(featured => featured.pinned > 0 ? commit('setPinned', featured.items.slice(0, featured.pinned)) : commit('setPinned', []));
    },
    createFeaturedSet({ getters, commit }) {
      const featuredSetBody = {
        type: 'EntityBestItemsSet',
        title: { 'en': getters.englishPrefLabel + ' Page' },
        subject: [getters.id]
      };
      return this.$apis.set.create(featuredSetBody)
        .then(response => commit('setFeaturedSetId', response.id));
    }
  }
};
