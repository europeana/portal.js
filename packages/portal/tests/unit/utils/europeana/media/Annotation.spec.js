import nock from 'nock';
import sinon from 'sinon';

import EuropeanaMediaAnnotation from '@/utils/europeana/media/Annotation.js';

describe('@/utils/europeana/media/Annotation', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaMediaAnnotation', () => {
    describe('parse', () => {
      it('parses body and target from `resource` and `on`', () => {
        const responseData = {
          on: {
            id: 'http://data.example.org/canvas/1'
          },
          resource: {
            id: 'http://data.example.org/annotation/1'
          }
        };
        const annotation = new EuropeanaMediaAnnotation();

        annotation.parse(responseData);

        expect(annotation.body.id).toBe(responseData.resource.id);
        expect(annotation.target.id).toBe(responseData.on.id);
      });

      it('parses body and target from `body` and `target`', () => {
        const responseData = {
          body: {
            id: 'http://data.example.org/annotation/1'
          },
          target: {
            id: 'http://data.example.org/canvas/1'
          }
        };
        const annotation = new EuropeanaMediaAnnotation();

        annotation.parse(responseData);

        expect(annotation.body.id).toBe(responseData.body.id);
        expect(annotation.target.id).toBe(responseData.target.id);
      });
    });

    describe('targetFor', () => {
      it('filters target(s) including exact matches and hash matches', () => {
        const data = {
          target: [
            { id: 'http://data.example.org/canvas/1' },
            'http://data.example.org/canvas/1#xywh=0,0,20,10',
            { id: 'http://data.example.org/canvas/2' },
            'http://data.example.org/canvas/2#xywh=0,0,20,10'
          ]
        };
        const annotation = new EuropeanaMediaAnnotation(data);

        const targetFor = annotation.targetFor('http://data.example.org/canvas/1');

        expect(targetFor).toEqual([
          { id: 'http://data.example.org/canvas/1' },
          'http://data.example.org/canvas/1#xywh=0,0,20,10'
        ]);
      });
    });

    describe('embedBodies', () => {
      it('embeds all the bodies', async() => {
        const data = {
          body: [
            { id: 'http://data.example.org/annotation/1', embed: sinon.spy() },
            { id: 'http://data.example.org/annotation/2', embed: sinon.spy() }
          ]
        };
        const annotation = new EuropeanaMediaAnnotation(data);

        await annotation.embedBodies();

        expect(data.body[0].embed.calledOnce).toBe(true);
        expect(data.body[1].embed.calledOnce).toBe(true);
      });
    });
  });
});
