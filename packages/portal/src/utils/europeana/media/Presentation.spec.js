import nock from 'nock';

import EuropeanaMediaPresentation from '@/utils/europeana/media/Presentation.js';

describe('@/utils/europeana/media/Presentation', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaMediaPresentation', () => {
    describe('Static methods', () => {
      describe('EuropeanaMediaPresentation.fetch()', () => {
        describe('on request error', () => {
          it('throws a custom error with url from request config', async() => {
            const origin = 'https://iiif.example.org';
            const path = '/123/abc/manifest';
            const url = `${origin}${path}`;
            const options = { url };
            nock(origin).get(path).reply(404);

            let error;
            try {
              await EuropeanaMediaPresentation.fetch(options);
            } catch (e) {
              error = e;
            }

            expect(error.message).toBe('Request failed with status code 404');
          });
        });
      });
    });

    describe('parse', () => {
      it('normalizes and parses v2 response data', () => {
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
        const presentation = new EuropeanaMediaPresentation();

        presentation.parse(responseData);

        expect(presentation).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          search: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              resource: {
                id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                format: 'image/jpeg'
              }
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
        const presentation = new EuropeanaMediaPresentation();

        presentation.parse(responseData);

        expect(presentation).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          search: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              resource: {
                id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                format: 'image/jpeg'
              }
            }
          ]
        });
      });
    });
  });
});
