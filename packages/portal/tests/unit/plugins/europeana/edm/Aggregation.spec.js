import Aggregation from '@/plugins/europeana/edm/Aggregation';

describe('plugins/europeana/edm/Aggregation', () => {
  describe('Aggregation', () => {
    describe('displayableWebResources', () => {
      it('filters web resources for edm:isShownBy and edm:hasView', () => {
        const edmIsShownBy = 'https://example.org/isShownBy.jpeg';
        const edmHasView = ['https://example.org/hasView.jpeg'];
        const edm = {
          edmIsShownBy,
          edmHasView,
          webResources: [
            { about: edmIsShownBy },
            { about: edmHasView[0] },
            { about: 'https://example.org/other' }
          ]
        };

        const displayableWebResources = new Aggregation(edm).displayableWebResources;

        expect(displayableWebResources.length).toBe(2);
        expect(displayableWebResources.find((wr) => wr.about === edmIsShownBy)).toBeTruthy();
        expect(displayableWebResources.find((wr) => wr.about === edmHasView[0])).toBeTruthy();
      });
    });

    describe('iiifPresentationManifestWebResources', () => {
      it('filters web resources by rdf:type for IIIF Presentation manifest', () => {
        const edm = {
          webResources: [
            { about: 'https://example.org/iiif/manifest', rdfType: 'http://iiif.io/api/presentation/3#Manifest' },
            { about: 'https://example.org/other' }
          ]
        };

        const iiifPresentationManifestWebResources = new Aggregation(edm).iiifPresentationManifestWebResources;

        expect(iiifPresentationManifestWebResources.length).toBe(1);
        expect(iiifPresentationManifestWebResources[0].rdfType).toBe('http://iiif.io/api/presentation/3#Manifest');
      });
    });
  });
});
