import nock from 'nock';

import api, {
  getEntityQuery, getEntityDescription, getEntitySlug, getEntityUri
} from '../../../../plugins/europeana/entity';
import config from '../../../../plugins/europeana';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiUrl = config.entity.url;
const apiEndpoint = '/concept/base/94.json';
const entityUri = 'http://data.europeana.eu/concept/base/94';
const entityFilterField = 'skos_concept';
const apiKey = 'abcdef';
const baseRequest = nock(apiUrl).get(apiEndpoint);

const recordApiUrl = config.record.url;
const recordApiEndpoint = '/search.json';

const searchResponse = {
  facets: [
    { name: 'edm_agent', fields: [
      { label: 'http://data.europeana.eu/agent/base/147831' },
      { label: 'http://data.europeana.eu/agent/base/49928' }
    ] }
  ]
};

const entitiesResponse = {
  items: [
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/147831',
      prefLabel: { en: 'Architecture' },
      note: {
        en: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.']
      } },
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/49928',
      prefLabel: { en: 'Painting' } },
    { type: 'Agent',
      id: 'http://data.europeana.eu/agent/base/59832',
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
      } }
  ]
};

const entitySuggestionsResponse = {
  '@context': ['https://www.w3.org/ns/ldp.jsonld', 'http://www.europeana.eu/schemas/context/entity.jsonld'],
  type: 'ResultPage',
  total: 1,
  items: [
    {
      id: 'http://data.europeana.eu/concept/base/83',
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
      id: 'http://data.europeana.eu/concept/base/123',
      prefLabel: { en: 'Folklore' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F627971486_640.jpg&type=VIDEO' } },
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/135',
      prefLabel: { en: 'Alchemy' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fiiif.archivelab.org%2Fiiif%2Fmiraculummundisi00glau%241%2Ffull%2Ffull%2F0%2Fdefault.jpg&type=TEXT' } }
  ]
};

describe('plugins/europeana/entity', () => {
  beforeEach(() => {
    config.entity.key = apiKey;
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getEntity()', () => {
    describe('API response', () => {
      context('with "No resource found with ID: ..." error', () => {
        const errorMessage = 'No resource found with ID:';

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(404, {
              error: errorMessage
            });
        });

        it('throws error with API error message and status code', async() => {
          let error;
          try {
            await api().getEntity(entityType, entityId);
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(404);
        });
      });

      context('with object in response', () => {
        const apiResponse = entitiesResponse.items[0];

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async() => {
          const response = await api().getEntity(entityType, entityId);
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('returns entity description', async() => {
          const response = await api().getEntity(entityType, entityId);
          response.entity.note.en[0].should.contain('Architecture is both the process and the product of planning');
        });

        it('has a misspelled id and returns entity title', async() => {
          const response = await api().getEntity(entityType, entityIdMisspelled);
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
    });
  });

  describe('findEntities()', () => {
    const uris = ['http://data.europeana.eu/agent/base/123', 'http://data.europeana.eu/concept/base/456'];
    const uriQuery = 'entity_uri:("http://data.europeana.eu/agent/base/123" OR "http://data.europeana.eu/concept/base/456")';
    const entitySearchResponse = {
      items: []
    };
    const searchEndpoint = '/search';

    it('searches the API by entity URIs', async() => {
      nock(apiUrl)
        .get(searchEndpoint)
        .query(query => {
          return query.query === uriQuery;
        })
        .reply(200, entitySearchResponse);

      await api().findEntities(uris);

      nock.isDone().should.be.true;
    });
  });

  describe('getEntitySuggestions()', () => {
    const text = 'world';
    const suggestEndpoint = '/suggest';

    it('passes `text` to the API', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.text === text;
        })
        .reply(200, entitySuggestionsResponse);

      await api().getEntitySuggestions(text);

      nock.isDone().should.be.true;
    });

    it('passes `language` to API', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.language === 'fr';
        })
        .reply(200, entitySuggestionsResponse);

      await api().getEntitySuggestions(text, { language: 'fr' });

      nock.isDone().should.be.true;
    });

    it('restricts types to agent & concept', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.type === 'agent,concept';
        })
        .reply(200, entitySuggestionsResponse);

      await api().getEntitySuggestions(text);

      nock.isDone().should.be.true;
    });

    it('returns the "items"', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(true)
        .reply(200, entitySuggestionsResponse);

      const items = await api().getEntitySuggestions(text);

      items.should.deep.eq(entitySuggestionsResponse.items);
    });
  });

  describe('relatedEntities()', () => {
    beforeEach('stub API response', () => {
      nock(apiUrl)
        .get('/search')
        .query(true)
        .reply(200, entitiesResponse);
    });

    it('returns related entities', async() => {
      nock(recordApiUrl)
        .get(recordApiEndpoint)
        .query(true)
        .reply(200, searchResponse);

      const response = await api().relatedEntities(entityType, entityId);
      response.length.should.eq(entitiesResponse.items.length);
    });

    it('filters on entity URI', async() => {
      nock(recordApiUrl)
        .get(recordApiEndpoint)
        .query(query => {
          return query.query === `${entityFilterField}:"${entityUri}"`;
        })
        .reply(200, searchResponse);

      await api().relatedEntities(entityType, entityId);

      nock.isDone().should.be.true;
    });
  });

  describe('getEntityUri', () => {
    context('with an id of "100-test-slug', () => {
      let id = '100-test-slug';
      context('with type Agent', () => {
        let type = 'person';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/agent/base/100');
        });
      });

      context('with type Concept', () => {
        let type = 'topic';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/concept/base/100');
        });
      });
    });
  });

  describe('getEntityQuery', () => {
    context('when entity is a concept', () => {
      const uri = 'http://data.europeana.eu/concept/base/12345';
      it('queries on skos_concept', () => {
        getEntityQuery(uri).should.eq(`skos_concept:"${uri}"`);
      });
    });

    context('when entity is an agent', () => {
      const uri = 'http://data.europeana.eu/agent/base/12345';
      it('queries on edm_agent', () => {
        getEntityQuery(uri).should.eq(`edm_agent:"${uri}"`);
      });
    });

    context('otherwise', () => {
      const uri = 'http://data.europeana.eu/place/base/12345';
      it('is `null`', () => {
        (getEntityQuery(uri) === null).should.be.true;
      });
    });
  });

  describe('getEntitySlug', () => {
    const entity = entitiesResponse.items[0];

    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = getEntitySlug(entity.id, entity.prefLabel.en);
      return slug.should.eq('147831-architecture');
    });
  });

  describe('getEntityDescription', () => {
    context('with a Concept entity', () => {
      const entity = entitiesResponse.items[0];
      const locale = 'nl';

      it('returns the description with values and language code', () => {
        const description = getEntityDescription(entity, locale);
        description.values[0].should.contain('Architecture');
        description.code.should.contain('en');
      });
    });

    context('with an Agent entity', () => {
      const entity = entitiesResponse.items[2];
      const locale = 'nl';

      it('returns the description with values and language code', () => {
        const description = getEntityDescription(entity, locale);
        description.values[0].should.contain('Vincent Willem van Gogh was');
        description.code.should.contain('en');
      });
    });
  });

  describe('searchEntities()', () => {
    beforeEach('stub API response', () => {
      nock(apiUrl)
        .get('/search')
        .query(true)
        .reply(200, conceptEntitiesResponse);
    });

    context('with a Concept entity', () => {
      const eParams = {
        query: '*:*',
        page: 1,
        type: 'topic',
        pageSize: 2,
        scope: 'europeana'
      };

      it('returns a list of concept entities', async() => {
        const response = await api().searchEntities(eParams, 'topic');
        response.entities.length.should.eq(conceptEntitiesResponse.items.length);
      });

      it('returns the total number of entities', async() => {
        const response = await api().searchEntities(eParams, 'topic');
        response.total.should.eq(conceptEntitiesResponse.partOf.total);
      });

      it('returns a thumbnail for each entity', async() => {
        const response = await api().searchEntities(eParams, 'topic');
        response.entities[0].isShownBy.thumbnail.should.eq(conceptEntitiesResponse.items[0].isShownBy.thumbnail);
      });
    });
  });
});
