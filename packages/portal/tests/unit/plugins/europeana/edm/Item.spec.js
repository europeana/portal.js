import Item from '@/plugins/europeana/edm/Item';

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
        const edm = {
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
        };

        const item = new Item(edm);

        expect(item.iiifPresentationManifest).toBe('https://example.org/iiif/manifest');
      });

      it('falls back to whatever references a web resource with IIIF Image service', () => {
        const edm = {
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
        };

        const item = new Item(edm);

        expect(item.iiifPresentationManifest).toBe('https://example.org/iiif/manifest');
      });
    });
  });
});
