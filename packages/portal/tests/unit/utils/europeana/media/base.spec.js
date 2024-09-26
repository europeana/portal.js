import nock from 'nock';

import EuropeanaMediaBase from '@/utils/europeana/media/base.js';

describe('@/utils/europeana/media/base', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaMediaBase', () => {
    const factory = (options = {}) => {
      const defaults = {
        origin: 'https://example.org',
        path: '/something',
        reqHeaders: {},
        responseStatus: 200,
        responseData: {}
      };
      const { origin, path, reqHeaders, responseStatus, responseData } = { ...defaults, ...options };

      nock(origin, { reqHeaders }).get(path).reply(responseStatus, responseData);

      const url = `${origin}${path}`;
      return { url };
    };

    describe('fetch', () => {
      it('makes an HTTP GET request for the resource URL', async() => {
        const { url } = factory();
        const resource = new EuropeanaMediaBase(url);

        await resource.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('includes Accept header preferring Presentation v3 format for .europeana.eu manifest URLs', async() => {
        const origin = 'https://iiif.europeana.eu';
        const reqHeaders = {
          accept: (value) => value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const { url } = factory({ origin, reqHeaders });
        const resource = new EuropeanaMediaBase(url);

        await resource.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('includes Accept header preferring Presentation v3 format for .eanadev.org manifest URLs', async() => {
        const origin = 'https://iiif.eanadev.org';
        const reqHeaders = {
          accept: (value) => value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const { url } = factory({ origin, reqHeaders });
        const resource = new EuropeanaMediaBase(url);

        await resource.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('omits Accept header preference for Presentation v3 format for non-Europeana manifest URLs', async() => {
        const origin = 'https://iiif.example.org';
        const reqHeaders = {
          accept: (value) => !value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const { url } = factory({ origin, reqHeaders });
        const resource = new EuropeanaMediaBase(url);

        await resource.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('normalizes response data', async() => {
        const responseData = {
          '@context': 'http://iiif.io/api/presentation/2/context.json',
          '@id': 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          '@type': 'sc:Manifest',
          service: [
            {
              '@context': 'http://iiif.io/api/search/1/context.json',
              '@id': 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ]
        };
        const { url } = factory({ responseData });
        const resource = new EuropeanaMediaBase(url);

        await resource.fetch();

        expect(resource).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          context: 'http://iiif.io/api/presentation/2/context.json',
          type: 'sc:Manifest',
          service: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ]
        });
      });
    });
  });
});
