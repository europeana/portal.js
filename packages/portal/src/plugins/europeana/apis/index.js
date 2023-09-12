// TODO: move these files into this directory?
import annotation from '../annotation.js';
import entity from '../entity.js';
import entityManagement from '../entity-management.js';
import fulltext from '../fulltext.js';
import iiifPresentation from '../iiif/presentation.js';
import mediaProxy from '../media-proxy.js';
import recommendation from '../recommendation.js';
import record from '../record.js';
import set from '../set.js';
import thumbnail from '../thumbnail.js';

const MODULE_NAME = 'apis';

const APIS = {
  annotation,
  entity,
  entityManagement,
  fulltext,
  iiifPresentation,
  mediaProxy,
  recommendation,
  record,
  set,
  thumbnail
};

export const API_IDS = Object.keys(APIS);

export const storeModule = {
  namespaced: true,

  state: () => ({
    reqHeaderUrls: {}
  }),

  mutations: {
    init(state, { $apis, req }) {
      for (const id in APIS) {
        state.reqHeaderUrls[id] = $apis?.[id]?.config?.apiUrlFromRequestHeaders?.(req?.headers);
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = API_IDS.reduce((memo, id) => {
    memo[id] = new APIS[id](context);
    console.log('API config', id, memo[id].baseURL, memo[id].config);
    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
