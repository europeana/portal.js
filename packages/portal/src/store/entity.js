import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from '@/plugins/europeana/data.js';

const itemUri = (itemId) => {
  return itemId.startsWith(EUROPEANA_DATA_URL_ITEM_PREFIX) ? itemId : `${EUROPEANA_DATA_URL_ITEM_PREFIX}${itemId}`;
};

export default {
  state: () => ({
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
    setPinned(state, value) {
      state.pinned = value || [];
    },
    setFeaturedSetId(state, value) {
      state.featuredSetId = value;
    },
    setEntityDescription(state, value) {
      state.entity.note = value;
    },
    setEditable(state, value) {
      state.editable = value;
    }
  },

  getters: {
    id(state) {
      return state.id ? state.id : null;
    },

    featuredSetId(state) {
      return state.featuredSetId ? state.featuredSetId : null;
    },

    // itemId may be a full URI or just the identifier part
    isPinned: (state) => (itemId) => {
      return state.pinned ? state.pinned.includes(itemUri(itemId)) : false;
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
    async pin({ dispatch, state }, itemId) {
      try {
        await dispatch('getPins');
        if (state.pinned && state.pinned.length >= 24) {
          throw new Error('too many pins');
        } else {
          await this.$apis.set.modifyItems('add', state.featuredSetId, itemId, true);
        }
      } finally {
        dispatch('getPins');
      }
    },
    async unpin({ dispatch, state }, itemId) {
      try {
        await this.$apis.set.modifyItems('delete', state.featuredSetId, itemId);
      } finally {
        dispatch('getPins');
      }
    },
    async getPins({ state, commit }) {
      const featured = await this.$apis.set.get(state.featuredSetId, {
        profile: 'standard',
        pageSize: 100
      });
      if ((featured.pinned > 0) && featured.items) {
        commit('setPinned', featured.items.slice(0, featured.pinned));
      } else {
        commit('setPinned', []);
      }
    }
  }
};
