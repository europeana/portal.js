import EuropeanaMediaBase from './base.js';
import WebResource from '@/plugins/europeana/edm/WebResource.js';

export default class EuropeanaMediaPresentation extends EuropeanaMediaBase {
  parse(data) {
    const preParsed = super.parse(data);

    const context = [].concat(preParsed?.context || []);

    const parsed = {
      id: preParsed.id,
      // TODO: find/filter for service matching IIIF search profile
      search: [].concat(preParsed.service || [])
    };

    const version = EuropeanaMediaBase.iiifPresentationApiVersion(context);
    if (version === 3) {
      parsed.canvases = this.#extractV3Canvases(preParsed);
    } else if (version === 2) {
      parsed.canvases = this.#extractV2Canvases(preParsed);
    } else {
      // TODO: throw version unknown error?
      return {};
    }

    return parsed;
  }

  #extractV2Canvases(manifest) {
    // TODO: limit to images w/ motivation "painting"?
    return manifest.sequences.map((sequence) => sequence.canvases.map((canvas) => ({
      id: canvas.id,
      annotations: canvas.otherContent,
      resource: this.#webResource(canvas.images[0].resource)
    }))).flat();
  }

  #extractV3Canvases(manifest) {
    // TODO: limit to "annotations" w/ motivation "painting"?
    return manifest.items.map((canvas) => ({
      id: canvas.id,
      annotations: canvas.annotations,
      resource: this.#webResource(canvas.items[0].items[0].body)
    }));
  }

  #webResource(data) {
    return new WebResource({
      about: data.id,
      ebucoreHasMimeType: data.format,
      ebucoreHeight: data.height,
      ebucoreWidth: data.width,
      // TODO: filter for IIIF Image service
      svcsHasService: [].concat(data.service || [])[0]
    });
  }
}
