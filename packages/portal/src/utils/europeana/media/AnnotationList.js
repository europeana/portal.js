import EuropeanaMediaBase from './Base.js';
import EuropeanaMediaAnnotation from './Annotation.js';

export default class EuropeanaMediaAnnotationList extends EuropeanaMediaBase {
  parse(data) {
    data = super.parse(data);

    const context = [].concat(data?.context || []);

    const parsed = {
      id: data.id,
      language: data.language,
      textGranularity: data.textGranularity
    };

    const version = EuropeanaMediaBase.iiifPresentationApiVersion(context);
    if (version === 3) {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=3
      parsed.items = data.items.map((item) => new EuropeanaMediaAnnotation(item));
    } else if (version === 2) {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=2
      // TODO: convert to body/target as w/ v3
    } else {
      // TODO: throw version unknown error?
    }

    return parsed;
  }

  annotationsForTarget(target) {
    return this.items.filter((anno) => anno.targetFor(target).length > 0);
  }
}
