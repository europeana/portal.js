import nock from 'nock';

import EuropeanaPresentationManifest from '@/utils/europeana/iiif.js';

describe('@/utils/europeana/iiif', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaPresentationManifest', () => {
    const factory = (options = {}) => {
      const defaults = {
        origin: 'https://iiif.example.org',
        path: '/123/abc/manifest',
        reqHeaders: {},
        responseStatus: 200,
        responseData: {}
      };
      const { origin, path, reqHeaders, responseStatus, responseData } = { ...defaults, ...options };

      nock(origin, { reqHeaders }).get(path).reply(responseStatus, responseData);

      const url = `${origin}${path}`;
      return url;
    };

    describe('fetch', () => {
      it('makes an HTTP GET request for the manifest URL', async() => {
        const url = factory();
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('includes Accept header preferring v3 manifests for .europeana.eu manifest URLs', async() => {
        const origin = 'https://iiif.europeana.eu';
        const reqHeaders = {
          accept: (value) => value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const url = factory({ origin, reqHeaders });
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('includes Accept header preferring v3 manifests for .eanadev.org manifest URLs', async() => {
        const origin = 'https://iiif.eanadev.org';
        const reqHeaders = {
          accept: (value) => value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const url = factory({ origin, reqHeaders });
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('omits Accept header preference for v3 manifest for non-Europeana manifest URLs', async() => {
        const origin = 'https://iiif.example.org';
        const reqHeaders = {
          accept: (value) => !value.startsWith('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0')
        };
        const url = factory({ origin, reqHeaders });
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(nock.isDone()).toBe(true);
      });

      it('normalizes and parses v2 response data', async() => {
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
          ],
          sequences: [
            {
              '@type': 'sc:Sequence',
              canvases: [
                {
                  '@type': 'sc:Canvas',
                  '@id': 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
                  images: [
                    {
                      '@type': 'oa:Annotation',
                      motivation: 'sc:painting',
                      resource: {
                        '@id': 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                        format: 'image/jpeg'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        };
        const url = factory({ responseData });
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(manifest).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          service: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              content: [
                {
                  id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                  format: 'image/jpeg'
                }
              ]
            }
          ]
        });
      });

      it('normalizes and parses v3 response data', async() => {
        const responseData = {
          '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://iiif.io/api/presentation/3/context.json'],
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          type: 'Manifest',
          service: [
            {
              '@context': 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          items: [
            {
              type: 'Canvas',
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              items: [
                {
                  type: 'AnnotationPage',
                  items: [
                    {
                      type: 'Annotation',
                      motivation: 'painting',
                      body: {
                        id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                        format: 'image/jpeg'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        };
        const url = factory({ responseData });
        const manifest = new EuropeanaPresentationManifest(url);

        await manifest.fetch();

        expect(manifest).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          service: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              content: [
                {
                  id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                  format: 'image/jpeg'
                }
              ]
            }
          ]
        });
      });
    });
  });
});
