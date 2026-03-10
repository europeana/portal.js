import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';

describe('EuropeanaMediaResource', () => {
  describe('Static methods', () => {
    describe('EuropeanaMediaResource.fromEDM()', () => {
      it('creates an instance from EDM', () => {
        const edm = {
          about: 'https://example.org/image.jpeg',
          ebucoreHasMimeType: 'image/jpeg',
          ebucoreHeight: 1000,
          ebucoreWidth: 500,
          svcsHasService: [
            'https://iiif.example.org/image.jpeg'
          ]
        };
        const services = [
          {
            about: edm.svcsHasService[0]
          }
        ];

        const resource = EuropeanaMediaResource.fromEDM(edm, services);

        expect(resource).toEqual({
          id: edm.about,
          format: edm.ebucoreHasMimeType,
          height: edm.ebucoreHeight,
          width: edm.ebucoreWidth,
          service: {
            id: edm.svcsHasService[0]
          }
        });
      });
    });
  });

  describe('Instance methods', () => {
    describe('EuropeanaMediaResource.prototype.parseData()', () => {
      it('picks relevant properties', () => {
        const data = {
          id: 'https://example.org/image.jpeg',
          format: 'image/jpeg',
          height: 1000,
          language: 'de',
          service: [
            {
              id: 'https://iiif.example.org/image.jpeg'
            }
          ],
          type: 'dctypes:Image',
          width: 500
        };
        const resource = new EuropeanaMediaResource();

        const parsed = resource.parseData(data);

        expect(parsed).toEqual({
          id: 'https://example.org/image.jpeg',
          format: 'image/jpeg',
          height: 1000,
          service: {
            id: 'https://iiif.example.org/image.jpeg'
          },
          width: 500
        });
      });
    });
  });

  describe('Instance getters', () => {
    describe('EuropeanaMediaResource.prototype.isIIIFImageService', () => {
      describe('when the resource has a service with type "ImageService2"', () => {
        const data = {
          service: {
            type: 'ImageService2'
          }
        };

        it('is `true`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(true);
        });
      });

      describe('when the resource has a service with type "ImageService3"', () => {
        const data = {
          service: {
            type: 'ImageService3'
          }
        };

        it('is `true`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(true);
        });
      });

      describe('when the resource has a service profile starting with "http://iiif.io/api/image"', () => {
        const data = {
          service: {
            profile: 'http://iiif.io/api/image/'
          }
        };

        it('is `true`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(true);
        });
      });

      describe('when the resource has a service context starting with "http://iiif.io/api/image"', () => {
        const data = {
          service: {
            context: 'http://iiif.io/api/image/'
          }
        };

        it('is `true`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(true);
        });
      });

      describe('when the resource has a service dctermsConformsTo starting with "http://iiif.io/api/image"', () => {
        const data = {
          service: {
            dctermsConformsTo: 'http://iiif.io/api/image/'
          }
        };

        it('is `true`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(true);
        });
      });

      describe('when the resource has another type of service', () => {
        const data = {
          service: {
            dctermsConformsTo: 'https://oembed.com/'
          }
        };

        it('is `false`', () => {
          const resource = new EuropeanaMediaResource(data);

          const isIIIFImageService = resource.isIIIFImageService;

          expect(isIIIFImageService).toBe(false);
        });
      });
    });
  });

  describe('Instance properties', () => {
    describe('EuropeanaMediaResource.prototype.edm', () => {
      it('converts properties to EDM equivalent', () => {
        const data = {
          id: 'https://example.org/image.jpeg',
          format: 'image/jpeg',
          height: 1000,
          width: 500,
          service: {
            edm: {
              about: 'https://iiif.example.org/image.jpeg'
            }
          }
        };
        const resource = new EuropeanaMediaResource(data);

        const edm = resource.edm;

        expect(edm).toEqual({
          about: data.id,
          ebucoreHasMimeType: data.format,
          ebucoreHeight: data.height,
          ebucoreWidth: data.width,
          svcsHasService: data.service.edm
        });
      });
    });
  });
});
