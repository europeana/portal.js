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
const searchPath = '/presentation/123/abc/search';
const searchUri = `${origin}${searchPath}`;
const searchResponseData = {
  id: searchUri,
  type: 'AnnotationPage',
  items: [
    {
      id: 'https://iiif.example.org/annotation/123/abc',
      type: 'Annotation',
      motivation: 'transcribing'
    }
  ],
  hits: [
    {
      type: 'Hit',
      annotations: [
        'https://iiif.example.org/annotation/123/abc'
      ]
    }
  ]
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
      id: searchUri,
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
  ],
  search: {
    id: searchUri
  }
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

  describe('searchTextGranularity', () => {
    it('picks "line" granularity from canvas annotations if available', () => {
      const { searchTextGranularity, presentation } = useItemMediaPresentation();
      presentation.value = new EuropeanaMediaPresentation({
        canvases: [
          { annotations: [{ textGranularity: ['page'] }] },
          { annotations: [{ textGranularity: ['block', 'line'] }] }
        ]
      });

      const granularity = searchTextGranularity.value;

      expect(granularity).toBe('line');
    });

    it('picks first granularity from canvas annotations if "line" not available', () => {
      const { searchTextGranularity, presentation } = useItemMediaPresentation();
      presentation.value = new EuropeanaMediaPresentation({
        canvases: [
          { annotations: [{ textGranularity: ['page'] }] },
          { annotations: [{ textGranularity: ['block'] }] }
        ]
      });

      const granularity = searchTextGranularity.value;

      expect(granularity).toBe('page');
    });

    it('is undefined if no canvas annotation granularities', () => {
      const { searchTextGranularity, presentation } = useItemMediaPresentation();
      presentation.value = new EuropeanaMediaPresentation({
        canvases: [
          { annotations: [{}] },
          { annotations: [{}] }
        ]
      });

      const granularity = searchTextGranularity.value;

      expect(granularity).toBeUndefined();
    });
  });

  describe('searchAnnotations', () => {
    const textGranularity = 'line';

    describe('when there is a query', () => {
      const query = 'dublin';

      beforeEach(() => {
        nock(origin).get(searchPath).query({ query, textGranularity }).reply(200, searchResponseData);
      });

      it('runs search for query and text granularity', async() => {
        const { presentation, searchAnnotations } = useItemMediaPresentation();
        presentation.value = new EuropeanaMediaPresentation({
          canvases: [
            { annotations: [{ textGranularity: [textGranularity] }] }
          ],
          search: { id: searchUri }
        });

        await searchAnnotations(query);

        expect(nock.isDone()).toBe(true);
      });

      it('stores results and hits', async() => {
        const { annotationSearchHits, annotationSearchResults, presentation, searchAnnotations } = useItemMediaPresentation();
        presentation.value = new EuropeanaMediaPresentation({
          canvases: [
            { annotations: [{ textGranularity: [textGranularity] }] }
          ],
          search: { id: searchUri }
        });

        await searchAnnotations(query);

        expect(annotationSearchHits.value).toEqual(searchResponseData.hits);
        expect(annotationSearchResults.value[0].id).toBe(searchResponseData.items[0].id);
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

  describe('annotationAtCoordinate', () => {
    const extent = [0, 0, 400, 600];
    const canvasAnnotations = [
      {
        id: 'https://data.europeana.eu/annotation/123/abc/def',
        body: {
          id: 'https://api.europeana.eu/fulltext/123/abc/2d05ecd#char=0,30',
          value: 'First line of text annotation.',
          language: 'en'
        },
        target: ['https://iiif.example.org/presentation/123/abc/image1.jpg#xywh=20,20,360,40'],
        extent: [20, 20, 380, 60]
      },
      {
        id: 'https://data.europeana.eu/annotation/123/abc/ghi',
        body: {
          id: 'https://api.europeana.eu/fulltext/123/abc/2d05ecd#char=31,62',
          value: 'Second line of text annotation.',
          language: 'en'
        },
        target: ['https://iiif.example.org/presentation/123/abc/image1.jpg#xywh=20,60,360,40'],
        extent: [20, 60, 380, 100]
      }
    ];

    describe('when the cooordinates are outside of any annotations', () => {
      it('returns undefined', () => {
        const { annotations, annotationAtCoordinate } = useItemMediaPresentation();
        annotations.value = canvasAnnotations;
        let annotation = annotationAtCoordinate([1, 1], extent);
        expect(annotation).toBe(undefined);
      });
    });

    describe('when the cooordinates are inside one of the annotations', () => {
      it('returns undefined', () => {
        const { annotations, annotationAtCoordinate } = useItemMediaPresentation();
        annotations.value = canvasAnnotations;
        let annotation = annotationAtCoordinate([40, 535], extent);
        expect(annotation).toBe(canvasAnnotations[1]);
      });
    });
  });

  describe('clear', () => {
    it('resets presentation value to null', () => {
      const { clear, presentation } = useItemMediaPresentation();
      presentation.value = presentationValue;

      clear();

      expect(presentation.value).toBeNull();
    });
  });
});
