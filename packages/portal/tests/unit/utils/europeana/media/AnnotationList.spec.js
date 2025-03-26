import nock from 'nock';

import EuropeanaMediaAnnotationList from '@/utils/europeana/media/AnnotationList.js';

describe('@/utils/europeana/media/AnnotationList', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaMediaAnnotationList', () => {
    describe('parse', () => {
      it('parses items from `items` (AnnotationPage)', () => {
        const responseData = {
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://data.example.org/annotation/1'
            },
            {
              id: 'http://data.example.org/annotation/2'
            }
          ]
        };
        const annotationList = new EuropeanaMediaAnnotationList();

        annotationList.parse(responseData);

        expect(annotationList.items).toEqual(responseData.items);
      });

      it('parses items from `resources` (sc:AnnotationList)', () => {
        const responseData = {
          type: 'sc:AnnotationList',
          resources: [
            {
              id: 'http://data.example.org/annotation/1'
            },
            {
              id: 'http://data.example.org/annotation/2'
            }
          ]
        };
        const annotationList = new EuropeanaMediaAnnotationList();

        annotationList.parse(responseData);

        expect(annotationList.items).toEqual(responseData.resources);
      });

      it('otherwise sets items to an empty array', () => {
        const responseData = {
          type: 'SomethingElse'
        };
        const annotationList = new EuropeanaMediaAnnotationList();

        annotationList.parse(responseData);

        expect(annotationList.items).toEqual([]);
      });
    });

    describe('annotationsForTarget', () => {
      it('returns annotations for target', () => {
        const data = {
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://data.example.org/annotation/1',
              target: 'http://data.example.org/canvas/1'
            },
            {
              id: 'http://data.example.org/annotation/2',
              target: 'http://data.example.org/canvas/1'
            },
            {
              id: 'http://data.example.org/annotation/3',
              target: 'http://data.example.org/canvas/2'
            }
          ]
        };
        const annotationList = new EuropeanaMediaAnnotationList();
        annotationList.parse(data);

        const annotations = annotationList.annotationsForTarget('http://data.example.org/canvas/1');

        expect(annotations).toEqual([
          {
            id: 'http://data.example.org/annotation/1',
            target: 'http://data.example.org/canvas/1'
          },
          {
            id: 'http://data.example.org/annotation/2',
            target: 'http://data.example.org/canvas/1'
          }
        ]);
      });
    });
  });
});
