import nock from 'nock';
import sinon from 'sinon';

import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
import EuropeanaMediaPresentation from '@/utils/europeana/media/Presentation.js';

const origin = 'https://iiif.example.org';
const canvasId = `${origin}/canvas/1`;
const bodyPath = '/fulltext/1';
const bodyUri = `${origin}${bodyPath}`;
const bodyResponseData = {
  id: bodyUri,
  type: 'TextualBody',
  value: 'full text'
};
const listPath = '/annos/1';
const listUri = `${origin}${listPath}`;
const listResponseData = {
  id: listUri,
  type: 'AnnotationPage',
  items: [{
    type: 'Annotation',
    body: {
      id: bodyUri
    },
    target: {
      id: canvasId
    }
  }]
};
const manifestPath = '/presentation/123/abc/manifest';
const manifestUri = `${origin}${manifestPath}`;
const manifestResponseData = {
  '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://iiif.io/api/presentation/3/context.json'],
  id: 'https://iiif.example.org/presentation/123/abc/manifest',
  type: 'Manifest',
  service: [
    {
      '@context': 'http://iiif.io/api/search/1/context.json',
      id: 'https://iiif.example.org/presentation/123/abc/search',
      profile: 'http://iiif.io/api/search/1/search'
    }
  ],
  items: [
    {
      type: 'Canvas',
      id: 'https://iiif.example.org/presentation/123/abc/canvas/1',
      items: [
        {
          type: 'AnnotationPage',
          items: [
            {
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.example.org/presentation/123/abc/image1.jpg',
                format: 'image/jpeg',
                service: {
                  id: 'https://iiif.example.org/image/123/abc/image1.jpg'
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
const textGranularity = 'line';

const presentationValue = new EuropeanaMediaPresentation({
  canvases: [
    {
      id: canvasId,
      annotations: [
        {
          id: listUri,
          textGranularity
        }
      ],
      resource: {}
    }
  ]
});

describe('useItemMediaPresentation', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
    nock.cleanAll();
  });
  afterAll(() => {
    sinon.restore();
    nock.enableNetConnect();
  });

  describe('fetchCanvasAnnotations', () => {
    beforeEach(() => {
      nock(origin).get(listPath).query({ textGranularity }).reply(200, listResponseData);
      nock(origin).get(bodyPath).reply(200, bodyResponseData);
    });

    it('fetches annotation list w/ text granularity and embeds bodies', async() => {
      const { presentation, fetchCanvasAnnotations } = useItemMediaPresentation();
      presentation.value = presentationValue;

      await fetchCanvasAnnotations(listUri);

      expect(nock.isDone()).toBe(true);
    });

    it('stores relevant annotations', async() => {
      const { annotations, presentation, fetchCanvasAnnotations } = useItemMediaPresentation();
      presentation.value = presentationValue;

      await fetchCanvasAnnotations(listUri);

      expect(annotations.value).toEqual([
        {
          body: {
            id: 'https://iiif.example.org/fulltext/1',
            value: 'full text'
          },
          target: { id: 'https://iiif.example.org/canvas/1' }
        }
      ]);
    });
  });

  describe('fetchPresentation', () => {
    beforeEach(() => {
      nock(origin).get(manifestPath).reply(200, manifestResponseData);
    });

    it('fetches the manifest', async() => {
      const { fetchPresentation } = useItemMediaPresentation();

      await fetchPresentation(manifestUri);

      expect(nock.isDone()).toBe(true);
    });

    it('stores the parsed data to `presentation`', async() => {
      const { fetchPresentation, presentation } = useItemMediaPresentation();

      await fetchPresentation(manifestUri);

      expect(presentation.value).toEqual({
        id: 'https://iiif.example.org/presentation/123/abc/manifest',
        search: [
          {
            context: 'http://iiif.io/api/search/1/context.json',
            id: 'https://iiif.example.org/presentation/123/abc/search',
            profile: 'http://iiif.io/api/search/1/search'
          }
        ],
        canvases: [
          {
            id: 'https://iiif.example.org/presentation/123/abc/canvas/1',
            resource: {
              id: 'https://iiif.example.org/presentation/123/abc/image1.jpg',
              format: 'image/jpeg',
              service: {
                id: 'https://iiif.example.org/image/123/abc/image1.jpg'
              }
            }
          }
        ]
      });
    });
  });

  describe('setPresentationFromWebResources', () => {
    it('initialises presentation value from web resources', () => {
      const { presentation, setPresentationFromWebResources } = useItemMediaPresentation();
      const webResources = [
        { about: 'https://example.org/video.mp4', ebucoreHasMimeType: 'video/mp4' }
      ];

      setPresentationFromWebResources(webResources);

      expect(presentation.value).toEqual({
        canvases: [
          {
            resource: {
              id: webResources[0].about,
              format: webResources[0].ebucoreHasMimeType
            }
          }
        ]
      });
    });
  });

  describe('pageForAnnotationTarget', () => {
    it('finds the page/canvas number for an annotation target', () => {
      const { pageForAnnotationTarget, presentation } = useItemMediaPresentation();
      presentation.value = presentationValue;

      const page = pageForAnnotationTarget(canvasId);

      expect(page).toBe(1);
    });
  });
});
