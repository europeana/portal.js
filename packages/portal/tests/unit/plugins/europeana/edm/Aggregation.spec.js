import Aggregation from '@/plugins/europeana/edm/Aggregation';

describe('plugins/europeana/edm/Aggregation', () => {
  describe('Aggregation', () => {
    describe('constructor', () => {
      describe('edm:isShownBy web resource', () => {
        const edmIsShownBy = 'https://example.org/isShownBy.jpeg';
        const edmObject = 'https://example.org/object.jpeg';
        const edm = {
          edmIsShownBy,
          edmObject,
          webResources: [
            { about: edmIsShownBy }
          ]
        };

        it('gets edm:object as thumbnail', () => {
          const aggregation = new Aggregation(edm);

          expect(aggregation.webResources[0].thumbnail.url).toBe(edmObject);
        });
      });

      describe('edm:isShownAt web resource', () => {
        const edmIsShownAt = 'https://example.org/isShownBy.jpeg';
        const edmObject = 'https://example.org/object.jpeg';
        const edm = {
          edmIsShownAt,
          edmObject,
          webResources: [
            { about: edmIsShownAt }
          ]
        };

        it('gets edm:object as thumbnail', () => {
          const aggregation = new Aggregation(edm);

          expect(aggregation.webResources[0].thumbnail.url).toBe(edmObject);
        });

        it('gets forEdmIsShownAt set to `true`', () => {
          const aggregation = new Aggregation(edm);

          expect(aggregation.webResources[0].forEdmIsShownAt).toBe(true);
        });
      });
    });

    describe('displayableWebResources', () => {
      it('filters web resources for edm:isShownBy and edm:hasView', () => {
        const edmIsShownAt = 'https://example.org/isShownAt.jpeg';
        const edmIsShownBy = 'https://example.org/isShownBy.jpeg';
        const hasView = ['https://example.org/hasView.jpeg'];
        const edm = {
          edmIsShownBy,
          edmIsShownAt,
          hasView,
          webResources: [
            { about: edmIsShownBy },
            { about: hasView[0] },
            { about: 'https://example.org/other' }
          ]
        };

        const displayableWebResources = new Aggregation(edm).displayableWebResources;

        expect(displayableWebResources.length).toBe(2);
        expect(displayableWebResources.find((wr) => wr.about === edmIsShownBy)).toBeTruthy();
        expect(displayableWebResources.find((wr) => wr.about === hasView[0])).toBeTruthy();
      });

      it('includes edm:isShownAt if no edm:isShownBy', () => {
        const edmIsShownAt = 'https://example.org/isShownAt.jpeg';
        const hasView = ['https://example.org/hasView.jpeg'];
        const edm = {
          edmIsShownAt,
          hasView,
          webResources: [
            { about: edmIsShownAt },
            { about: hasView[0] },
            { about: 'https://example.org/other' }
          ]
        };

        const displayableWebResources = new Aggregation(edm).displayableWebResources;

        expect(displayableWebResources.length).toBe(2);
        expect(displayableWebResources.find((wr) => wr.about === edmIsShownAt)).toBeTruthy();
        expect(displayableWebResources.find((wr) => wr.about === hasView[0])).toBeTruthy();
      });

      it('sorts by isNextInSequence', () => {
        const edmIsShownBy = 'https://example.org/isShownBy.jpeg';
        const hasView = [
          'https://example.org/hasView1.jpeg',
          'https://example.org/hasView2.jpeg',
          'https://example.org/hasView3.jpeg'
        ];
        const edm = {
          edmIsShownBy,
          hasView,
          webResources: [
            { about: edmIsShownBy },
            { about: hasView[2], isNextInSequence: hasView[1] },
            { about: hasView[0], isNextInSequence: edmIsShownBy },
            { about: hasView[1], isNextInSequence: hasView[0] }
          ]
        };

        const displayableWebResources = new Aggregation(edm).displayableWebResources;

        expect(displayableWebResources[0].about).toBe(edmIsShownBy);
        expect(displayableWebResources[1].about).toBe(hasView[0]);
        expect(displayableWebResources[2].about).toBe(hasView[1]);
        expect(displayableWebResources[3].about).toBe(hasView[2]);
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
