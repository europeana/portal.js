import nock from 'nock';

import EuropeanaMediaService from '@/utils/europeana/media/Service.js';

describe('EuropeanaMediaService', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('Static methods', () => {
    describe('EuropeanaMediaService.fromEDM()', () => {
      it('creates an instance from EDM', () => {
        const edm = {
          about: 'https://example.org/image.jpeg',
          doapImplements: 'http://iiif.io/api/image/2/level1.json'
        };

        const service = EuropeanaMediaService.fromEDM(edm);

        expect(service).toEqual({
          context: 'http://iiif.io/api/image/2/context.json',
          id: edm.about,
          profile: edm.doapImplements
        });
      });
    });
  });

  describe('Instance methods', () => {
    describe('EuropeanaMediaService.prototype.fetchInfo()', () => {
      const origin = 'http://example.org';
      const path = '/image.jpeg';
      const id = `${origin}${path}`;
      const responseData = {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': id,
        height: 500,
        protocol: 'http://iiif.io/api/image',
        sizes: [
          { height: 500, width: 1000 }
        ],
        width: 1000
      };

      beforeEach(() => {
        nock(origin).get(`${path}/info.json`).reply(200, responseData);
      });

      it('retrieves info.json resource', async() => {
        const service = new EuropeanaMediaService({ id });

        await service.fetchInfo();

        expect(nock.isDone()).toBe(true);
      });
    });
  });

  describe('Instance properties', () => {
    describe('EuropeanaMediaService.prototype.infoUrl', () => {
      it('appends /info.json to id property', () => {
        const service = new EuropeanaMediaService({ id: 'https://example.org/image.jpeg' });

        const infoUrl = service.infoUrl;

        expect(infoUrl).toBe('https://example.org/image.jpeg/info.json');
      });
    });

    describe('EuropeanaMediaService.prototype.edm', () => {
      it('converts properties to EDM equivalent', () => {
        const data = {
          id: 'https://example.org/image.jpeg',
          profile: 'http://iiif.io/api/image/2/level1.json'
        };
        const service = new EuropeanaMediaService(data);

        const edm = service.edm;

        expect(edm).toEqual({
          about: data.id,
          doapImplements: data.profile,
          dctermsConformsTo: ['http://iiif.io/api/image']
        });
      });
    });
  });
});
