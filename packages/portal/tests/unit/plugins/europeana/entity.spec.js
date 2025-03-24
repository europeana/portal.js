import nock from 'nock';

import api, {
  getEntityQuery, getEntityUri, entityParamsFromUri, isEntityUri, getWikimediaThumbnailUrl
} from '@/plugins/europeana/entity';
import EuropeanaThumbnailApi from '@/plugins/europeana/thumbnail';

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiEndpoint = '/concept/94.json';
const baseRequest = () => nock(api.BASE_URL).get(apiEndpoint);

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

describe('plugins/europeana/entity', () => {
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
        const entity = await (new api).get(entityType, entityId);
        expect(entity.prefLabel.en).toBe('Architecture');
      });

      it('returns entity description', async() => {
        const entity = await (new api).get(entityType, entityId);
        expect(entity.note.en[0]).toContain('Architecture is both the process and the product of planning');
      });

      it('has a misspelled id and returns entity title', async() => {
        const entity = await (new api).get(entityType, entityIdMisspelled);
        expect(entity.prefLabel.en).toBe('Architecture');
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
        nock(api.BASE_URL)
          .post(retrieveEndpoint, uris)
          .reply(200, orderedEntitySearchResponse);

        await (new api).find(uris);

        expect(nock.isDone()).toBe(true);
      });

      it('resolves with a blank array if there are no URIs', async() => {
        const result = await (new api).find([]);

        expect(result).toEqual([]);
      });

      it('preserves the order of the supplied URIs', async() => {
        nock(api.BASE_URL)
          .post(retrieveEndpoint, uris)
          .reply(200, unorderedEntitySearchResponse);

        const entities = await (new api).find(uris);

        expect(entities).toEqual(orderedEntitySearchResponse.items);
      });
    });

    describe('suggest', () => {
      const text = 'world';
      const suggestEndpoint = '/suggest';

      it('passes `text` to the API', async() => {
        nock(api.BASE_URL)
          .get(suggestEndpoint)
          .query((query) => {
            return query.text === text;
          })
          .reply(200, entitySuggestionsResponse);

        await (new api).suggest(text);

        expect(nock.isDone()).toBe(true);
      });

      it('passes `language` to API', async() => {
        nock(api.BASE_URL)
          .get(suggestEndpoint)
          .query((query) => {
            return query.language === 'fr';
          })
          .reply(200, entitySuggestionsResponse);

        await (new api).suggest(text, { language: 'fr' });

        expect(nock.isDone()).toBe(true);
      });

      it('restricts types to agent, concept, timespan, organization & place', async() => {
        nock(api.BASE_URL)
          .get(suggestEndpoint)
          .query((query) => {
            return query.type === 'agent,concept,timespan,organization,place';
          })
          .reply(200, entitySuggestionsResponse);

        await (new api).suggest(text);

        expect(nock.isDone()).toBe(true);
      });

      it('returns the "items"', async() => {
        nock(api.BASE_URL)
          .get(suggestEndpoint)
          .query(true)
          .reply(200, entitySuggestionsResponse);

        const items = await (new api).suggest(text);

        expect(items).toEqual(entitySuggestionsResponse.items);
      });

      it('returns an empty array when there are no items', async() => {
        nock(api.BASE_URL)
          .get(suggestEndpoint)
          .query(true)
          .reply(200,   { type: 'ResultPage', total: 0 });

        const items = await (new api).suggest(text);

        expect(items).toEqual([]);
      });
    });

    describe('imageUrl', () => {
      const europeanaThumbnailUrl = 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fwww.example.org%2Fimage.jpeg&type=IMAGE';
      const wikimediaImageUrl = 'http://commons.wikimedia.org/wiki/Special:FilePath/Europeana_logo_2015_basic.svg';

      const context = {
        $apis: {
          thumbnail: new EuropeanaThumbnailApi
        }
      };

      describe('when entity has Europeana thumbnail in `image`', () => {
        const entity = {
          image: europeanaThumbnailUrl
        };

        it('uses it at 200px size', () => {
          const imageUrl = (new api(context)).imageUrl(entity);

          expect(imageUrl).toBe('https://api.europeana.eu/thumbnail/v3/200/6c0a0d323f07cbfd98f575e88c782474');
        });
      });

      describe('when entity has Europeana thumbnail in `isShownBy.thumbnail`', () => {
        const entity = {
          isShownBy: {
            thumbnail: europeanaThumbnailUrl
          }
        };

        it('uses it at 200px size', () => {
          const imageUrl = (new api(context)).imageUrl(entity);

          expect(imageUrl).toBe('https://api.europeana.eu/thumbnail/v3/200/6c0a0d323f07cbfd98f575e88c782474');
        });
      });

      describe('when entity has Wikimedia image in `logo.id`', () => {
        const entity = {
          logo: {
            id: wikimediaImageUrl
          }
        };

        it('uses it at 28px size', () => {
          const imageUrl = (new api).imageUrl(entity);

          expect(imageUrl).toBe('https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Europeana_logo_2015_basic.svg/28px-Europeana_logo_2015_basic.svg.png');
        });
      });

      describe('otherwise', () => {
        const entity = {};

        it('is `null`', () => {
          const imageUrl = (new api).imageUrl(entity);

          expect(imageUrl).toBe(null);
        });
      });
    });
  });

  describe('getEntityUri', () => {
    describe('with an id of "100-test-slug"', () => {
      const id = '100-test-slug';
      describe('with type Agent', () => {
        const type = 'person';
        it('returns an agent URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/agent/100');
        });
      });

      describe('with type Concept', () => {
        const type = 'topic';
        it('returns a concept URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/concept/100');
        });
      });

      describe('with type Timespan', () => {
        const type = 'time';
        it('returns a timespan URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/timespan/100');
        });
      });

      describe('with type Organization', () => {
        const type = 'organisation';
        it('returns an organization URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/organization/100');
        });
      });
    });
  });

  describe('isEntityUri', () => {
    describe('with an uri of "http://data.europeana.eu/agent/100"', () => {
      const uri = 'http://data.europeana.eu/agent/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/concept/100"', () => {
      const uri = 'http://data.europeana.eu/concept/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/place/100"', () => {
      const uri = 'http://data.europeana.eu/place/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://example.org/not-an-entity"', () => {
      const uri = 'http://example.org/not-an-entity';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(false);
      });
    });
  });

  describe('entityParamsFromUri', () => {
    describe('with an agent uri of "http://data.europeana.eu/agent/100"', () => {
      const uri = 'http://data.europeana.eu/agent/100';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('100');
        expect(params.type).toBe('person');
      });
    });

    describe('with a timespan uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('20');
        expect(params.type).toBe('time');
      });
    });

    describe('with an organisation uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('999');
        expect(params.type).toBe('organisation');
      });
    });
  });

  describe('getEntityQuery', () => {
    describe('when entity is a concept', () => {
      const uri = 'http://data.europeana.eu/concept/12345';
      it('queries on skos_concept', () => {
        expect(getEntityQuery(uri)).toBe(`skos_concept:"${uri}"`);
      });
    });

    describe('when entity is an agent', () => {
      const uri = 'http://data.europeana.eu/agent/12345';
      it('queries on edm_agent', () => {
        expect(getEntityQuery(uri)).toBe(`edm_agent:"${uri}"`);
      });
    });

    describe('when entity is a timespan', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('queries on edm_timespan', () => {
        expect(getEntityQuery(uri)).toBe(`edm_timespan:"${uri}"`);
      });
    });

    describe('when entity is an organization', () => {
      const uri = 'http://data.europeana.eu/organization/12345';
      it('queries on foaf_organization', () => {
        expect(getEntityQuery(uri)).toBe(`foaf_organization:"${uri}"`);
      });
    });

    describe('when entity is a place', () => {
      const uri = 'http://data.europeana.eu/place/12345';
      it('queries on edm_place', () => {
        expect(getEntityQuery(uri)).toBe(`edm_place:"${uri}"`);
      });
    });

    describe('when multiple entity URIs supplied', () => {
      const uris = ['http://data.europeana.eu/organization/12345', 'http://data.europeana.eu/organization/67890', 'https://www.example.org/404'];
      it('queries on all Europeana entities, joined with OR', () => {
        expect(getEntityQuery(uris)).toBe('foaf_organization:"http://data.europeana.eu/organization/12345" OR foaf_organization:"http://data.europeana.eu/organization/67890"');
      });
    });

    describe('otherwise', () => {
      const uri = 'http://data.europeana.eu/item/12345';
      it('throws an error', () => {
        expect(() => getEntityQuery(uri) === null).toThrow(`Unsupported entity URI "${uri}"`);
      });
    });
  });

  describe('getWikimediaThumbnailUrl', () => {
    const logo = 'http://commons.wikimedia.org/wiki/Special:FilePath/Uni-Leiden-seal.png';

    it('returns an wikimedia thumbnail url starting with https://upload.wikimedia.org', () => {
      const thumbnail = getWikimediaThumbnailUrl(logo, 60);
      expect(thumbnail).toContain('https://upload.wikimedia.org');
    });
  });

  describe('search()', () => {
    beforeEach(() => {
      nock(api.BASE_URL)
        .get('/search')
        .query(true)
        .reply(200, conceptEntitiesResponse);
    });

    describe('with a Concept entity', () => {
      const eParams = {
        query: '*:*',
        page: 1,
        type: 'topic',
        pageSize: 2,
        scope: 'europeana'
      };

      it('returns a list of concept entities', async() => {
        const response = await (new api).search(eParams, 'topic');
        expect(response.entities.length).toBe(conceptEntitiesResponse.items.length);
      });

      it('returns the total number of entities', async() => {
        const response = await (new api).search(eParams, 'topic');
        expect(response.total).toBe(conceptEntitiesResponse.partOf.total);
      });

      it('returns a thumbnail for each entity', async() => {
        const response = await (new api).search(eParams, 'topic');
        expect(response.entities[0].isShownBy.thumbnail).toBe(conceptEntitiesResponse.items[0].isShownBy.thumbnail);
      });
    });
  });
});
