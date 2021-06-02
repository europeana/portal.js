import { getEntityQuery } from '../plugins/europeana/entity';

export default {
  state: () => ({
    curatedEntities: null,
    entity: null,
    id: null,
    page: null,
    recordsPerPage: 24,
    relatedEntities: null,
    editable: false
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
    setEntityDescription(state, value) {
      state.entity.note = value;
    },
    setEditable(state, value) {
      state.editable = value;
    },
    setProxy(state, value) {
      state.entity.proxy = value;
    },
    setProxyDescription(state, value) {
      state.entity.proxy.note = value;
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

    updateEntity({ commit }, { id, body }) {
      return this.$apis.entityManagement.updateEntity(id.split('/').pop(), body)
        .then(response => {
          commit('setProxyDescription', body.note);
          commit('setEntityDescription', response.note);
        });
    }

  }
};
