import Base from '../Base.js';
import Annotation from './Annotation.js';
import EuropeanaFullTextResource from '../Europeana/FullTextResource.js';

export default class IIIFPresentationV3AnnotationPage extends Base {
  static MAPPINGS = [
    { as: Annotation, from: 'items', to: 'annotations' }
  ];

  get url() {
    const url = super.url;

    // TODO: move preference for line to param or instance property?
    let textGranularity = 'line';
    if (!([].concat(this.textGranularity).includes(textGranularity))) {
      textGranularity = [].concat(this.textGranularity)[0];
    }

    if (textGranularity) {
      url.searchParams.set('textGranularity', textGranularity);
    }

    if (this.isInEuropeanaDomain) {
      url.searchParams.set('format', '3');
    }

    return url;
  }

  // Dereferences annotations
  //
  // Annotation bodies may be links to the content. This fetches that content,
  // accounting for links on multiple annotations' body sharing the same content
  // source but with sections selected by the #char= URL hash (and not wanting
  // to duplicate the request for each annotation)
  // TODO: skip if body has content already
  async deferenceAnnotations() {
    const urls = [];
    for (const anno of this.annotations) {
      const url = new URL(anno.body.id);
      url.hash = '';
      if (!urls.includes(url.toString())) {
        urls.push(url.toString());
      }
    }

    const responses = await Promise.all(urls.map((url) => this.constructor.fetch(url)));

    for (const response of responses) {
      const data = response.data;

      for (const anno of this.annotations) {
        if (anno.body.id.startsWith(`${data.id}#`)) {
          // TODO: handle other types of linked resource
          if (data.type === 'FullTextResource') {
            anno.body = new EuropeanaFullTextResource({
              ...data,
              // overwrite id last, so that the #char= hash is intact
              id: anno.body.id
            });
          }
        }
      }
    }
  }
}
