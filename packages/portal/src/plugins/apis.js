import * as annotation from './europeana/annotation.js';
import * as entity from './europeana/entity.js';
import * as entityManagement from './europeana/entity-management.js';
import * as fulltext from './europeana/fulltext.js';
import * as iiif from './europeana/iiif.js';
import * as mediaProxy from './europeana/mediaProxy.js';
import * as recommendation from './europeana/recommendation.js';
import * as record from './europeana/record.js';
import * as set from './europeana/set.js';
import * as thumbnail from './europeana/thumbnail.js';

import { apiUrlFromRequestHeaders } from './europeana/utils.js';

const MODULE_NAME = 'apis';

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      entityManagement: null,
      recommendation: null,
      record: null,
      set: null,
      thumbnail: null
    }
  }),

  mutations: {
    init(state, { req }) {
      for (const api in state.urls) {
        const apiBaseURL = apiUrlFromRequestHeaders(api, req.headers);

        if (apiBaseURL && this.$apis?.[api]?.$axios) {
          this.$apis[api].$axios.defaults.baseURL = apiBaseURL;
        }
        state.urls[api] = apiBaseURL;
      }
    }
  }
};

export const baseURLs = {
  annotation: annotation.BASE_URL,
  entity: entity.BASE_URL,
  entityManagement: entityManagement.BASE_URL,
  fulltext: fulltext.BASE_URL,
  iiifPresentation: iiif.PRESENTATION_URL,
  mediaProxy: mediaProxy.BASE_URL,
  recommendation: recommendation.BASE_URL,
  record: record.BASE_URL,
  set: set.BASE_URL,
  thumbnail: thumbnail.BASE_URL
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = {
    annotation: annotation.default(context),
    entity: entity.default(context),
    entityManagement: entityManagement.default(context),
    recommendation: recommendation.default(context),
    record: record.default(context),
    set: set.default(context),
    thumbnail: thumbnail.default(context)
  };

  inject(MODULE_NAME, plugin);
};
