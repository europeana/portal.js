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
