import EuropeanaMediaBase from './base.js';
import EuropeanaMediaAnno from './anno.js';

export default class EuropeanaMediaAnnotations extends EuropeanaMediaBase {
  get params() {
    const params = super.params;

    if (this.textGranularity && this.isInEuropeanaDomain) {
      // TODO: this needs to be made specifiable somehow
      params.textGranularity = this.textGranularity.includes('line') ? 'line' : this.textGranularity[0];
    }

    return params;
  }

  parse(data) {
    const preParsed = super.parse(data);

    const context = [].concat(preParsed?.context || []);

    const parsed = {
      id: preParsed.id,
      language: preParsed.language,
      textGranularity: preParsed.textGranularity
    };

    const version = EuropeanaMediaBase.iiifPresentationApiVersion(context);
    if (version === 3) {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=3
      parsed.items = preParsed.items.map((anno) => new EuropeanaMediaAnno(anno));
    } else if (version === 2) {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=2
      // TODO: convert to body/target as w/ v3
    } else {
      // TODO: throw version unknown error?
    }

    return parsed;
  }

  for(target) {
    return this.items.map((anno) => anno.for(target)).flat().filter(Boolean);
  }
}
