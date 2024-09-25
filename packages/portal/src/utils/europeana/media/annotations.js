import EuropeanaMediaBase from './base.js';
import EuropeanaMediaAnno from './anno.js';

export default class EuropeanaMediaAnnotations extends EuropeanaMediaBase {
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

  async for(target, { embed, reduce } = {}) {
    let annos = this.items.map((anno) => anno.for(target)).flat().filter(Boolean);

    if (embed) {
      await Promise.all(annos.map((anno) => anno.embedBodies()));
    }

    if (reduce) {
      annos = annos.map((anno) => anno.reduce());
    }

    return annos;
  }
}
