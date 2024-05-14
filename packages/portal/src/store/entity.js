import { data as EuropeanaDataApi } from '@europeana/apis';

const itemUri = (itemId) => {
  return itemId.startsWith(EuropeanaDataApi.ITEM_URL_PREFIX) ? itemId : `${EuropeanaDataApi.ITEM_URL_PREFIX}${itemId}`;
};

export default {
  state: () => ({
    bestItemsSetId: null,
    editable: false,
    entity: null,
    id: null,
    pinned: null
  }),

  mutations: {
    setBestItemsSetId(state, value) {
      state.bestItemsSetId = value;
    },
    setEntity(state, value) {
      state.entity = value;
    },
    setId(state, value) {
      state.id = value;
    },
    setPinned(state, value) {
      // items may be full objects, or just IDs; we only need the IDs here
      state.pinned = (value || []).map((item) => typeof item === 'object' ? itemUri(item.id) : item);
    },
    setEntityDescription(state, value) {
      state.entity.note = value;
    },
    setEditable(state, value) {
      state.editable = value;
    }
  },

  getters: {
    // itemId may be a full URI or just the identifier part
    isPinned: (state) => (itemId) => {
      return state.pinned ? state.pinned.includes(itemUri(itemId)) : false;
    }
  }
};
