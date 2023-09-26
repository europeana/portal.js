import Base from '../Base.js';
import Annotation from './Annotation.js';

export default class EuropeanaIIIFPresentationV3AnnotationPage extends Base {
  constructor(data) {
    super(data);

    this.annotations = [].concat(data.items || []).map((ann) => new Annotation(ann));
  }

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

    if (this.isByEuropeana) {
      url.searchParams.set('format', '3');
    }

    return url;
  }
}
