import axios from 'axios';
import WebResource from '@/plugins/europeana/edm/WebResource.js';

export const isInEuropeanaDomain = (id) => {
  const url = typeof (id) === 'string' ? new URL(id) : id;
  return url.origin.endsWith('.europeana.eu') ||
    url.origin.endsWith('.eanadev.org');
};

export const isForEuropeanaMediaPresentation = (id) => {
  const url = typeof (id) === 'string' ? new URL(id) : id;
  return isInEuropeanaDomain(id) && url.pathname.endsWith('/manifest');
};

export const IIIF_PRESENTATION_V2_CONTEXT = 'http://iiif.io/api/presentation/2/context.json';
export const IIIF_PRESENTATION_V3_CONTEXT = 'http://iiif.io/api/presentation/3/context.json';
export const JSON_LD_MEDIA_TYPE = 'application/ld+json';
export const JSON_MEDIA_TYPE = 'application/json';

export default class EuropeanaMediaPresentation {
  id;

  constructor(id) {
    this.id = id;
  }

  async fetch() {
    const response = await axios({
      url: this.id,
      method: 'get',
      headers: this.#headers
    });

    const data = this.constructor.parse(this.constructor.normalize(response.data));
    for (const key in data) {
      this[key] = data[key];
    }
    return this;
  }

  get #headers() {
    const headers = {};

    // NOTE: it would be preferable to do this with all requests, but some providers
    //       CORS support do not permit the Accept header, preventing the manifest
    //       loading
    if (isForEuropeanaMediaPresentation(this.id)) {
      headers['Accept'] = [
        `${JSON_LD_MEDIA_TYPE};profile="${IIIF_PRESENTATION_V3_CONTEXT}";q=1.0`,
        `${JSON_LD_MEDIA_TYPE};profile="${IIIF_PRESENTATION_V2_CONTEXT}";q=0.9`,
        `${JSON_LD_MEDIA_TYPE};q=0.8`,
        `${JSON_MEDIA_TYPE};q=0.7`
      ].join(', ');
    }

    return headers;
  }

  static parse(data) {
    const context = [].concat(data?.context || []);

    const parsed = {
      id: data.id,
      // TODO: find/filter for service matching IIIF search profile
      search: [].concat(data.service || [])
    };

    let resources = [];

    if (context.includes(IIIF_PRESENTATION_V3_CONTEXT)) {
      resources = this.#extractV3Resources(data);
    } else if (context.includes(IIIF_PRESENTATION_V2_CONTEXT)) {
      resources = this.#extractV2Resources(data);
    } else {
      // TODO: throw version unknown error?
      return {};
    }

    parsed.resources = resources.map((resource) => {
      const data = {
        about: resource.id,
        ebucoreHasMimeType: resource.format,
        ebucoreHeight: resource.height,
        ebucoreWidth: resource.width,
        // TODO: filter for IIIF Image service
        svcsHasService: [].concat(resource.service || [])[0]
      };
      return new WebResource(data);
    });

    return parsed;
  }

  static #extractV2Resources(manifest) {
    // TODO: limit to images w/ motivation "painting"?
    return manifest.sequences.map((sequence) => sequence.canvases.map((canvas) => canvas.images[0].resource)).flat();
  }

  static #extractV3Resources(manifest) {
    // TODO: limit to "annotations" w/ motivation "painting"?
    return manifest.items.map((canvas) => canvas.items[0].items[0].body);
  }

  // removes "@" from start of all keys
  // TODO: rm known prefixes from types, e.g. 'dctypes:', 'sc:', 'oa:'
  // TODO: normalize v2/v3 language maps
  static normalize(thing) {
    if (Array.isArray(thing)) {
      return thing.map(EuropeanaMediaPresentation.normalize);
    } else if (typeof thing === 'object') {
      return Object.keys(thing).reduce((memo, key) => {
        const normKey = key.startsWith('@') ? key.slice(1) : key;
        memo[normKey] = EuropeanaMediaPresentation.normalize(thing[key]);
        return memo;
      }, {});
    } else {
      return thing;
    }
  }
}
