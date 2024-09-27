import Base from './Base.js';
import Annotation from './Annotation.js';

export default class EuropeanaMediaAnnotationList extends Base {
  parseData(data) {
    data = super.parseData(data);

    const parsed = {
      id: data.id,
      language: data.language,
      textGranularity: data.textGranularity
    };

    if (data.type === 'AnnotationPage') {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=3
      parsed.items = data.items.map((item) => Annotation.parse(item));
    } else if (data.type === 'sc:AnnotationList') {
      // e.g. https://iiif.europeana.eu/presentation/9200338/BibliographicResource_3000127242400/annopage/90b837b?lang=de&format=2
      parsed.items = data.resources.map((resource) => Annotation.parse({
        id: resource.id,
        motivation: resource.motivation,
        textGranularity: resource.textGranularity,
        body: resource.resource,
        target: resource.on
      }));
    } else {
      parsed.items = [];
    }

    return parsed;
  }

  annotationsForTarget(target) {
    return this.items.filter((anno) => anno.targetFor(target).length > 0);
  }
}
