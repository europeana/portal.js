import Item from '@/plugins/europeana/edm/Item';

const fixtures = {
  withRdfTypedIIIFWebResource: {
    about: '/123/abc',
    aggregations: [{
      about: '/aggregation/provider/123/abc',
      edmIsShownBy: 'https://example.org/edmIsShownBy.jpeg',
      edmHasView: ['https://example.org/edmHasView.jpeg'],
      webResources: [
        { about: 'https://example.org/edmIsShownBy.jpeg', dctermsIsReferencedBy: ['https://example.org/iiif/manifest'], ebucoreHasMimeType: 'image/jpeg' },
        { about: 'https://example.org/edmHasView.jpeg', dctermsIsReferencedBy: ['https://example.org/iiif/manifest'], ebucoreHasMimeType: 'image/jpeg' },
        { about: 'https://example.org/iiif/manifest', rdfType: 'http://iiif.io/api/presentation/3#Manifest' }
      ]
    }]
  },
  withIIIFImageAPIService: {
    about: '/123/abc',
    aggregations: [{
      about: '/aggregation/provider/123/abc',
      edmIsShownBy: 'https://example.org/edmIsShownBy.jpeg',
      webResources: [
        { about: 'https://example.org/edmIsShownBy.jpeg', dctermsIsReferencedBy: ['https://example.org/iiif/manifest'], svcsHasService: ['https://example.org/iiif/image'] }
      ]
    }],
    services: [{
      about: 'https://example.org/iiif/image',
      dctermsConformsTo: ['http://iiif.io/api/image']
    }]
  }
};

describe('plugins/europeana/edm/Item', () => {
  describe('Item', () => {
    describe('providerAggregation', () => {
      it('gets the aggregation prefixed "/aggregation/provider/"', () => {
        const edm = {
          about: '/123/abc',
          aggregations: [{
            about: '/aggregation/provider/123/abc'
          }]
        };

        const providerAggregation = new Item(edm).providerAggregation;

        expect(providerAggregation.about).toBe(edm.aggregations[0].about);
      });
    });

    describe('iiifPresentationManifest', () => {
      it('favours a typed web resource referencing all displayable web resources', () => {
        const item = new Item(fixtures.withRdfTypedIIIFWebResource);

        expect(item.iiifPresentationManifest).toBe('https://example.org/iiif/manifest');
      });

      it('falls back to whatever references a web resource with IIIF Image service', () => {
        const item = new Item(fixtures.withIIIFImageAPIService);

        expect(item.iiifPresentationManifest).toBe('https://example.org/iiif/manifest');
      });
    });
  });

  describe('webResourceForIIIFPresentationManifest', () => {
    it('gets the first web resource if all are displayable by the same IIIF manifest', () => {
      const item = new Item(fixtures.withRdfTypedIIIFWebResource);

      expect(item.webResourceForIIIFPresentationManifest.about).toBe('https://example.org/edmIsShownBy.jpeg');
    });

    it('gets the web resource with a IIIF Image service, if any', () => {
      const item = new Item(fixtures.withIIIFImageAPIService);

      expect(item.webResourceForIIIFPresentationManifest.about).toBe('https://example.org/edmIsShownBy.jpeg');
    });
  });

  describe('isDeleted', () => {
    it('is false if europeana aggregation has no changelog', () => {
      const item = new Item({
        europeanaAggregation: {}
      });

      const isDeleted = item.isDeleted;

      expect(isDeleted).toBe(false);
    });

    it('is false if last europeana aggregation change is not of type "Delete"', () => {
      const item = new Item({
        europeanaAggregation: {
          changeLog: [
            { type: 'Delete' },
            { type: 'Restore' }
          ]
        }
      });

      const isDeleted = item.isDeleted;

      expect(isDeleted).toBe(false);
    });

    it('is true if last europeana aggregation change is of type "Delete"', () => {
      const item = new Item({
        europeanaAggregation: {
          changeLog: [
            { type: 'Delete' }
          ]
        }
      });

      const isDeleted = item.isDeleted;

      expect(isDeleted).toBe(true);
    });
  });
});
