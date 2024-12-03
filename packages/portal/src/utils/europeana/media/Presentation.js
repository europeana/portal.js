import Base from './Base.js';
import Resource from './Resource.js';
import { IIIFManifestError } from './errors.js';
import {
  IIIF_PRESENTATION_V2_CONTEXT,
  IIIF_PRESENTATION_V3_CONTEXT
} from './constants.js';

export default class EuropeanaMediaPresentation extends Base {
  static async fetch(options = {}) {
    try {
      const response = await super.fetch(options);
      return response;
    } catch (e) {
      const error = new IIIFManifestError(e.message);
      error.url = e.config?.url;
      throw error;
    }
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

  parseData(data) {
    data = super.parseData(data);

    const context = [].concat(data?.context || []);

    const parsed = {
      id: data.id,
      // TODO: find/filter for service matching IIIF search profile
      search: [].concat(data.service || [])
    };

    const version = EuropeanaMediaPresentation.iiifPresentationApiVersion(context);
    if (version === 3) {
      parsed.canvases = EuropeanaMediaPresentation.extractV3Canvases(data);
    } else if (version === 2) {
      parsed.canvases = EuropeanaMediaPresentation.extractV2Canvases(data);
    }

    return parsed;
  }

  static extractV2Canvases(manifest) {
    return (manifest.sequences || []).map((sequence) => sequence.canvases.map((canvas) => ({
      id: canvas.id,
      annotations: canvas.otherContent,
      resource: Resource.parse(canvas.images[0].resource),
      rights: canvas.license
    }))).flat();
  }

  static extractV3Canvases(manifest) {
    return (manifest.items || []).map((canvas) => ({
      id: canvas.id,
      annotations: canvas.annotations,
      resource: Resource.parse(canvas.items[0].items[0].body),
      // TODO: rights should be a string, not an object, but it's not in our own iiif service...
      rights: canvas.rights?.id || canvas.rights
    }));
  }
}
