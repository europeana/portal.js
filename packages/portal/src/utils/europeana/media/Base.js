import axios from 'axios';

import {
  JSON_MEDIA_TYPE,
  JSON_LD_MEDIA_TYPE,
  IIIF_PRESENTATION_V2_CONTEXT,
  IIIF_PRESENTATION_V3_CONTEXT
} from './constants.js';

// removes "@" from start of all keys
// TODO: rm known prefixes from types, e.g. 'dctypes:', 'sc:', 'oa:'
// TODO: normalize v2/v3 language maps
function normalize(thing) {
  if (Array.isArray(thing)) {
    return thing.map(normalize);
  } else if (thing && typeof thing === 'object') {
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
  #fetched = false;
  static $axios;

  static get axios() {
    if (!this.$axios) {
      this.$axios = axios.create();
    }
    return this.$axios;
  }

  constructor(data) {
    if (!data) {
      return;
    } else if (typeof data === 'string') {
      this.id = data;
    } else {
      const parsed = this.parse(data);
      for (const key in parsed) {
        // preserve id, e.g. for hash
        this[key] = parsed[key];
      }
    }
  }

  async fetch({ params } = {}) {
    const response = await this.constructor.axios({
      url: this.axiosUrl,
      method: 'get',
      headers: this.headers,
      params
    });

    this.#fetched = true;

    const data = this.parse(response.data);

    for (const key in data) {
      // TODO: store in one data property instead of multiple arbitrary top-level
      //       properties, to avoid naming clashes with class getters etc?
      this[key] = data[key];
    }
    return this;
  }

  get axiosUrl() {
    const url = new URL(this.id);
    url.hash = ''; // so that axios caching works
    return url.toString();
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

  get isInEuropeanaDomain() {
    if (!this.id) {
      return undefined;
    }
    const url = this.id instanceof URL ? this.id : new URL(this.id);
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

  // sub-classes may implement their own parsing logic
  parse(data) {
    return this.normalize(data);
  }

  normalize(thing) {
    return normalize(thing);
  }

  getHashParam(hash, key) {
    if (hash?.startsWith?.('#')) {
      return new URLSearchParams(hash.slice(1)).get(key);
    } else {
      return undefined;
    }
  }
}
