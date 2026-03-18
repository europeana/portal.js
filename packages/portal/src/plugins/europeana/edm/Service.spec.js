import Service from '@/plugins/europeana/edm/Service';

describe('plugins/europeana/edm/Service', () => {
  describe('Service', () => {
    describe('conformsToIIIFImageAPI', () => {
      it('is `true` if dctermsConformsTo includes IIIF Image API URL', () => {
        const edm = {
          dctermsConformsTo: ['http://iiif.io/api/image']
        };

        const conformsToIIIFImageAPI = new Service(edm).conformsToIIIFImageAPI;

        expect(conformsToIIIFImageAPI).toBe(true);
      });

      it('is `false` otherwise', () => {
        const edm = {};

        const conformsToIIIFImageAPI = new Service(edm).conformsToIIIFImageAPI;

        expect(conformsToIIIFImageAPI).toBe(false);
      });
    });
  });
});
