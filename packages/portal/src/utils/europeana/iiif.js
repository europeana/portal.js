import axios from 'axios';

export const isInEuropeanaDomain = (id) => {
  const url = typeof (id) === 'string' ? new URL(id) : id;
  return url.origin.endsWith('.europeana.eu') ||
    url.origin.endsWith('.eanadev.org');
};

export const isForEuropeanaPresentationManifest = (id) => {
  const url = typeof (id) === 'string' ? new URL(id) : id;
  return isInEuropeanaDomain(id) && url.pathname.endsWith('/manifest');
};

export const IIIF_PRESENTATION_V2_CONTEXT = 'http://iiif.io/api/presentation/2/context.json';
export const IIIF_PRESENTATION_V3_CONTEXT = 'http://iiif.io/api/presentation/3/context.json';
export const JSON_LD_MEDIA_TYPE = 'application/ld+json';
export const JSON_MEDIA_TYPE = 'application/json';

export default class EuropeanaPresentationManifest {
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
    if (isForEuropeanaPresentationManifest(this.id)) {
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
      service: [].concat(data.service || [])
    };

    if (context.includes(IIIF_PRESENTATION_V3_CONTEXT)) {
      parsed.canvases = this.#extractV3Canvases(data);
    } else if (context.includes(IIIF_PRESENTATION_V2_CONTEXT)) {
      parsed.canvases = this.#extractV2Canvases(data);
    } else {
      // TODO: throw version unknown error?
      return {};
    }

    for (const canvas of parsed.canvases) {
      if (canvas.content.service && Array.isArray(canvas.content.service)) {
        canvas.content.service = canvas.content.service[0];
      }
    }

    return parsed;
  }

  static #extractV2Canvases(manifest) {
    return manifest.sequences.map((sequence) => {
      return sequence.canvases.map((canvas) => {
        // TODO: limit to motivation "painting"?
        const content = canvas.images[0].resource;
        return {
          id: canvas.id,
          content
        };
      });
    }).flat();
  }

  static #extractV3Canvases(manifest) {
    return manifest.items.map((canvas) => {
      // TODO: limit to motivation "painting"?
      const content = canvas.items[0].items[0].body;
      return {
        id: canvas.id,
        content
      };
    });
  }

  // removes "@" from start of all keys
  // TODO: rm known prefixes from types, e.g. 'dctypes:', 'sc:', 'oa:'
  // TODO: normalize v2/v3 language maps
  static normalize(thing) {
    if (Array.isArray(thing)) {
      return thing.map(EuropeanaPresentationManifest.normalize);
    } else if (typeof thing === 'object') {
      return Object.keys(thing).reduce((memo, key) => {
        const normKey = key.startsWith('@') ? key.slice(1) : key;
        memo[normKey] = EuropeanaPresentationManifest.normalize(thing[key]);
        return memo;
      }, {});
    } else {
      return thing;
    }
  }
}
