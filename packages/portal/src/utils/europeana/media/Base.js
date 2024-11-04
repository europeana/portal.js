import axios from 'axios';
import isUndefined from 'lodash/isUndefined.js';
import omitBy from 'lodash/omitBy.js';

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
  static $axios;

  static get axios() {
    if (!this.$axios) {
      this.$axios = axios.create({
        timeout: 10000
      });
    }
    return this.$axios;
  }

  static axiosUrl(id) {
    const url = new URL(id);
    url.hash = ''; // so that axios caching works
    return url.toString();
  }

  // factory method to create an instance, fetch it, and parse the response to
  // initialise its properties
  static async from(id, fetchOptions) {
    const resource = new this(id);
    const response = await resource.fetch(fetchOptions);
    resource.parse(response.data);
    return resource;
  }

  // factory method to create an instance and parse some data to initialise its
  // properties
  static parse(data) {
    if (!data) {
      return undefined;
    }

    const resource = new this;
    resource.parse(data);

    return resource;
  }

  static fetch(options = {}) {
    return this.axios({
      method: 'get',
      ...options,
      url: this.axiosUrl(options.url)
    });
  }

  static omitIsUndefined(data) {
    return omitBy(data, isUndefined);
  }

  static getHashParam(hash, key) {
    if (hash?.startsWith?.('#')) {
      return new URLSearchParams(hash.slice(1)).get(key);
    } else {
      return undefined;
    }
  }

  constructor(idOrData) {
    if (typeof idOrData === 'string') {
      this.id = idOrData;
    } else if (idOrData && (typeof idOrData === 'object')) {
      for (const key in idOrData) {
        this[key] = idOrData[key];
      }
    }
  }

  parseData(data) {
    return data || {};
  }

  preParseData(data) {
    return normalize(data);
  }

  postParseData(data) {
    return this.constructor.omitIsUndefined(data);
  }

  parse(data) {
    data = this.preParseData(data);

    // preserve original id, e.g. w/ hash which may not be included in a fetched
    // representation
    if (this.id && (data.id !== this.id)) {
      data.id = this.id;
    }

    data = this.parseData(data);
    data = this.postParseData(data);

    for (const key in data) {
      this[key] = data[key];
    }

    return this;
  }

  getHashParam(hash, key) {
    return this.constructor.getHashParam(hash, key);
  }

  fetch({ params } = {}) {
    return this.constructor.fetch({
      url: this.id,
      headers: this.headers,
      params
    });
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
      return false;
    }
    const url = this.id instanceof URL ? this.id : new URL(this.id);
    return url.origin.endsWith('.europeana.eu') ||
      url.origin.endsWith('.eanadev.org');
  }
}
