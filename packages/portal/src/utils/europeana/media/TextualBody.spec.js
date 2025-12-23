import nock from 'nock';

import EuropeanaMediaTextualBody from '@/utils/europeana/media/TextualBody.js';

describe('@/utils/europeana/media/TextualBody', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('EuropeanaMediaTextualBody', () => {
    describe('parse', () => {
      it('parses value from `chars` (cnt:ContentAsText)', () => {
        const responseData = {
          '@type': 'cnt:ContentAsText',
          chars: 'content'
        };
        const textualBody = new EuropeanaMediaTextualBody();

        textualBody.parse(responseData);

        expect(textualBody).toEqual({
          value: 'content'
        });
      });

      it('parses value from `value` (oa:TextualBody/edm:FullTextResource)', () => {
        const responseData = {
          type: 'oa:TextualBody',
          value: 'content'
        };
        const textualBody = new EuropeanaMediaTextualBody();

        textualBody.parse(responseData);

        expect(textualBody).toEqual({
          value: 'content'
        });
      });

      it('keeps wanted data, drops the rest', () => {
        const responseData = {
          id: 'http://data.example.org/TextualBody/1',
          type: 'oa:TextualBody',
          language: 'de'
        };
        const textualBody = new EuropeanaMediaTextualBody();

        textualBody.parse(responseData);

        expect(textualBody).toEqual({
          id: 'http://data.example.org/TextualBody/1',
          language: 'de'
        });
      });

      it('slices value if ID contains char selector in hash', () => {
        const responseData = {
          id: 'http://data.example.org/TextualBody/1#char=0,4',
          value: 'this or that'
        };
        const textualBody = new EuropeanaMediaTextualBody();

        textualBody.parse(responseData);

        expect(textualBody.value).toBe('this');
      });
    });

    describe('embed', () => {
      describe('when value is already present', () => {
        it('does not fetch the resource', async() => {
          const data = {
            value: 'content'
          };
          const textualBody = new EuropeanaMediaTextualBody(data);

          await textualBody.embed();

          expect(nock.isDone()).toBe(true);
        });
      });

      describe('when value is not yet present', () => {
        const origin = 'http://data.example.org';
        const path = '/TextualBody/1';
        const id = `${origin}${path}`;
        const responseData = {
          id,
          value: 'content'
        };

        beforeEach(() => {
          nock(origin).get(path).reply(200, responseData);
        });

        it('fetches the resource', async() => {
          const textualBody = new EuropeanaMediaTextualBody({ id });

          await textualBody.embed();

          expect(nock.isDone()).toBe(true);
        });

        it('parses the response data', async() => {
          const textualBody = new EuropeanaMediaTextualBody({ id });

          await textualBody.embed();

          expect(textualBody.value).toBe('content');
        });
      });
    });
  });
});
