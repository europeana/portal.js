import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

import {
  JSON_MEDIA_TYPE,
  JSON_LD_MEDIA_TYPE,
  IIIF_PRESENTATION_V2_CONTEXT,
  IIIF_PRESENTATION_V3_CONTEXT
} from './constants.js';

function normalize(thing) {
  if (Array.isArray(thing)) {
    return thing.map(normalize);
  } else if (typeof thing === 'object') {
    return Object.keys(thing).reduce((memo, key) => {
      const normKey = key.startsWith('@') ? key.slice(1) : key;
      memo[normKey] = normalize(thing[key]);
      return memo;
    }, {});
  } else {
    return thing;
  }
}

export default class EuropeanaMediaBase {
  id;
  $axios;
  static $axios;

  static get axios() {
    if (!this.$axios) {
      this.$axios = setupCache(axios);
    }
    return this.$axios;
  }

  constructor(data) {
    this.$axios = EuropeanaMediaBase.axios;
    if (typeof data === 'string') {
      this.id = data;
    } else {
      const parsed = this.parse(this.normalize(data));
      for (const key in parsed) {
        this[key] = parsed[key];
      }
    }
  }

  async fetch() {
    const response = await this.$axios({
      url: this.id,
      method: 'get',
      headers: this.headers,
      params: this.params
    });

    const data = this.parse(this.normalize(response.data));
    for (const key in data) {
      this[key] = data[key];
    }
    return this;
  }

  get headers() {
    const headers = {};

    // NOTE: it would be preferable to do this with all requests, but some providers
    //       CORS support do not permit the Accept header, preventing the manifest
    //       loading
    if (this.isInEuropeanaDomain) {
      headers['Accept'] = [
        `${JSON_LD_MEDIA_TYPE};profile="${IIIF_PRESENTATION_V3_CONTEXT}";q=1.0`,
        `${JSON_LD_MEDIA_TYPE};profile="${IIIF_PRESENTATION_V2_CONTEXT}";q=0.9`,
        `${JSON_LD_MEDIA_TYPE};q=0.8`,
        `${JSON_MEDIA_TYPE};q=0.7`
      ].join(', ');
    }

    return headers;
  }

  get params() {
    return {};
  }

  get isInEuropeanaDomain() {
    const url = typeof (this.id) === 'string' ? new URL(this.id) : this.id;
    return url.origin.endsWith('.europeana.eu') ||
      url.origin.endsWith('.eanadev.org');
  }

  static iiifPresentationApiVersion(context) {
    if (context.includes(IIIF_PRESENTATION_V3_CONTEXT)) {
      return 3;
    } else if (context.includes(IIIF_PRESENTATION_V2_CONTEXT)) {
      return 2;
    } else {
      return undefined;
    }
  }

  parse(data) {
    return data;
  }

  // removes "@" from start of all keys
  // TODO: rm known prefixes from types, e.g. 'dctypes:', 'sc:', 'oa:'
  // TODO: normalize v2/v3 language maps
  normalize(thing) {
    return normalize(thing);
  }
}
