import nock from 'nock';

import EuropeanaEntityApi from '@/entity/index.js';

const entityId = 94;
const entityType = 'concept';
const apiEndpoint = '/concept/94.json';
const baseRequest = () => nock(EuropeanaEntityApi.BASE_URL).get(apiEndpoint);

const entitiesResponse = {
  items: [
    {
      type: 'Concept',
      id: 'http://data.europeana.eu/concept/147831',
      prefLabel: { en: 'Architecture' },
      note: {
        en: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.']
      }
    },
    {
      type: 'Concept',
      id: 'http://data.europeana.eu/concept/49928',
      prefLabel: { en: 'Painting' }
    },
    {
      type: 'Agent',
      id: 'http://data.europeana.eu/agent/59832',
      prefLabel: { en: 'Vincent van Gogh' },
      biographicalInformation: [
        {
          '@language': 'en',
          '@value': 'Vincent Willem van Gogh was a post-Impressionist painter of Dutch origin whose work, notable for its rough beauty, emotional honesty and bold color, had a far-reaching influence on 20th-century art. After years of painful anxiety and frequent bouts of mental illness, he died aged 37 from a gunshot wound, generally accepted to be self-inflicted (although no gun was ever found).'
        }
      ],
      isShownBy: {
        id: 'https://lh3.googleusercontent.com/Ckjq-HkB2XhEsbuMsei0MR5fLTODfkcXY8qQTG-XLHVxE0jLO9DnSYaVE8n1kCrcm9AMKzoWB2w03LrY0v7eoj5hYw=s0',
        type: 'WebResource',
        source: 'http://data.europeana.eu/item/90402/SK_A_3262',
        thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https://www.rijksmuseum.nl/assetimage2.jsp?id=SK-A-3262&type=IMAGE'
      }
    },
    {
      type: 'Timespan',
      id: 'http://data.europeana.eu/timespan/20',
      prefLabel: { en: 'Painting' }
    }
  ]
};

const entitySuggestionsResponse = {
  '@context': ['https://www.w3.org/ns/ldp.jsonld', 'http://www.europeana.eu/schemas/context/entity.jsonld'],
  type: 'ResultPage',
  total: 1,
  items: [
    {
      id: 'http://data.europeana.eu/concept/83',
      type: 'Concept',
      prefLabel: {
        en: 'World War I',
        sq: 'Lufta e Parë Botërore'
      }
    }
  ]
};

const conceptEntitiesResponse = {
  partOf: { total: 120 },
  items: [
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/123',
      prefLabel: { en: 'Folklore' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F627971486_640.jpg&type=VIDEO' } },
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/135',
      prefLabel: { en: 'Alchemy' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fiiif.archivelab.org%2Fiiif%2Fmiraculummundisi00glau%241%2Ffull%2Ffull%2F0%2Fdefault.jpg&type=TEXT' } }
  ]
};

describe('@/entity/index.js', () => {
  describe('EuropeanaEntityApi', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(nock.cleanAll);

    afterAll(() => {
      nock.enableNetConnect();
    });

    describe('default export', () => {
      describe('get', () => {
        const apiResponse = entitiesResponse.items[0];

        beforeEach(() => {
          baseRequest()
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async() => {
          const entity = await (new EuropeanaEntityApi).get(entityType, entityId);
          expect(entity.prefLabel.en).toBe('Architecture');
        });

        it('returns entity description', async() => {
          const entity = await (new EuropeanaEntityApi).get(entityType, entityId);
          expect(entity.note.en[0]).toContain('Architecture is both the process and the product of planning');
        });
      });

      describe('find', () => {
        const uris = ['http://data.europeana.eu/agent/123', 'http://data.europeana.eu/concept/456'];
        const orderedEntitySearchResponse = {
          items: [
            { id: 'http://data.europeana.eu/agent/123' },
            { id: 'http://data.europeana.eu/concept/456' }
          ]
        };
        const unorderedEntitySearchResponse = {
          items: [
            { id: 'http://data.europeana.eu/concept/456' },
            { id: 'http://data.europeana.eu/agent/123' }
          ]
        };
        const retrieveEndpoint = '/retrieve';

        it('uses the API retrieve method', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .post(retrieveEndpoint, uris)
            .reply(200, orderedEntitySearchResponse);

          await (new EuropeanaEntityApi).find(uris);

          expect(nock.isDone()).toBe(true);
        });

        it('resolves with a blank array if there are no URIs', async() => {
          const result = await (new EuropeanaEntityApi).find([]);

          expect(result).toEqual([]);
        });

        it('preserves the order of the supplied URIs', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .post(retrieveEndpoint, uris)
            .reply(200, unorderedEntitySearchResponse);

          const entities = await (new EuropeanaEntityApi).find(uris);

          expect(entities).toEqual(orderedEntitySearchResponse.items);
        });
      });

      describe('suggest', () => {
        const text = 'world';
        const suggestEndpoint = '/suggest';

        it('passes `text` to the API', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .get(suggestEndpoint)
            .query(query => {
              return query.text === text;
            })
            .reply(200, entitySuggestionsResponse);

          await (new EuropeanaEntityApi).suggest(text);

          expect(nock.isDone()).toBe(true);
        });

        it('passes `language` to API', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .get(suggestEndpoint)
            .query(query => {
              return query.language === 'fr';
            })
            .reply(200, entitySuggestionsResponse);

          await (new EuropeanaEntityApi).suggest(text, { language: 'fr' });

          expect(nock.isDone()).toBe(true);
        });

        it('restricts types to agent, concept, timespan, organization & place', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .get(suggestEndpoint)
            .query(query => {
              return query.type === 'agent,concept,timespan,organization,place';
            })
            .reply(200, entitySuggestionsResponse);

          await (new EuropeanaEntityApi).suggest(text);

          expect(nock.isDone()).toBe(true);
        });

        it('returns the "items"', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .get(suggestEndpoint)
            .query(true)
            .reply(200, entitySuggestionsResponse);

          const items = await (new EuropeanaEntityApi).suggest(text);

          expect(items).toEqual(entitySuggestionsResponse.items);
        });

        it('returns an empty array when there are no items', async() => {
          nock(EuropeanaEntityApi.BASE_URL)
            .get(suggestEndpoint)
            .query(true)
            .reply(200,   { type: 'ResultPage', total: 0 });

          const items = await (new EuropeanaEntityApi).suggest(text);

          expect(items).toEqual([]);
        });
      });
    });

    describe('search()', () => {
      beforeEach(() => {
        nock(EuropeanaEntityApi.BASE_URL)
          .get('/search')
          .query(true)
          .reply(200, conceptEntitiesResponse);
      });

      it('queries the entity API', async() => {
        await (new EuropeanaEntityApi).search();

        expect(nock.isDone()).toBe(true);
      });

      it('returns the response data', async() => {
        const response = await (new EuropeanaEntityApi).search();

        expect(response).toEqual(conceptEntitiesResponse);
      });
    });
  });
});
