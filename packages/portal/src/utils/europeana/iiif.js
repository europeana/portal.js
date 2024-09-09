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

export default class EuropeanaPresentationManifest {
  static async fetch(uri) {
    const options = {
      url: uri,
      method: 'get',
      headers: {}
    };
    // NOTE: it would be preferable to do this with all requests, but some providers
    //       CORS support do not permit the Accept header, preventing the manifest
    //       loading
    if (isForEuropeanaPresentationManifest(uri)) {
      options.headers['Accept'] = (
        'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0, application/ld+json;profile="http://iiif.io/api/presentation/2/context.json";q=0.9, application/ld+json;q=0.8, application/json;q=0.7'
      );
    }
    const response = await axios(options);

    const data = EuropeanaPresentationManifest.normalize(response.data);

    const context = [].concat(data?.context || []);
    if (context.includes('http://iiif.io/api/presentation/3/context.json')) {
      return this.parseV3Manifest(data);
    } else if (context.includes('http://iiif.io/api/presentation/2/context.json')) {
      return this.parseV2Manifest(data);
    }

    // TODO: throw version unknown error?
    return data;
  }

  static parseV2Manifest(manifest) {
    return {
      id: manifest.id,
      service: [].concat(manifest.service || []),
      canvases: manifest.sequences.map((sequence) => {
        return sequence.canvases.map((canvas) => {
          return {
            id: canvas.id,
            // TODO: limit to motivation "painting"?
            content: canvas.images.map((image) => image.resource)
          };
        });
      }).flat()
    };
  }

  static parseV3Manifest(manifest) {
    return {
      id: manifest.id,
      service: [].concat(manifest.service || []),
      canvases: manifest.items.map((canvas) => {
        return {
          id: canvas.id,
          content: canvas.items.map((annoPage) => {
            // TODO: limit to motivation "painting"?
            return annoPage.items.map((anno) => anno.body);
          }).flat()
        };
      })
    };
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
