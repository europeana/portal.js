import nock from 'nock';
import * as entities from '../../../../plugins/europeana/entity';
import config from '../../../../modules/apis/defaults';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiUrl = config.entity.origin;
const apiEndpoint = '/entity/concept/base/94.json';
const entityUri = 'http://data.europeana.eu/concept/base/94';
const entityFilterField = 'skos_concept';
const apiKey = 'abcdef';
const baseRequest = nock(apiUrl).get(apiEndpoint);

const recordApiUrl = config.record.origin;
const recordApiEndpoint = `${config.record.path}/search.json`;

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
      },
      depiction: {
        id: 'http://commons.wikimedia.org/wiki/Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg',
        source: 'http://commons.wikimedia.org/wiki/File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg'
      }
    },
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/49928',
      prefLabel: { en: 'Painting' }
    },
    { type: 'Agent',
      id: 'http://data.europeana.eu/agent/base/147831',
      prefLabel: { en: 'Albert Edelfelt' },
      biographicalInformation: [
        {
          '@language': 'en',
          '@value': 'Albert Gustaf Aristides Edelfelt (21 July 1854 – 18 August 1905) was a Finnish painter.'
        }
      ]
    }
  ]
};

const entitySuggestionsResponse = {
  '@context': ['https://www.w3.org/ns/ldp.jsonld', 'http://www.europeana.eu/schemas/context/entity.jsonld'],
  type: 'ResultPage',
  total: 1,
  items: [{
    id: 'http://data.europeana.eu/concept/base/83',
    type: 'Concept',
    depiction: 'http://commons.wikimedia.org/wiki/Special:FilePath/Map_Europe_alliances_1914-en.svg',
    prefLabel: {
      en: 'World War I',
      sq: 'Lufta e Parë Botërore'
    }
  }]
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
            await entities.getEntity(entityType, entityId);
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
          const response = await entities.getEntity(entityType, entityId);
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('returns entity description', async() => {
          const response = await entities.getEntity(entityType, entityId);
          response.entity.note.en[0].should.contain('Architecture is both the process and the product of planning');
        });

        it('returns entity depiction', async() => {
          const response = await entities.getEntity(entityType, entityId);
          response.entity.depiction.id.should.contain('Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('returns entity attribution', async() => {
          const response = await entities.getEntity(entityType, entityId);
          response.entity.depiction.source.should.contain('File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('has a misspelled id and returns entity title', async() => {
          const response = await entities.getEntity(entityType, entityIdMisspelled);
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
    });
  });

  describe('searchEntities()', () => {
    const uris = [
      'http://data.europeana.eu/agent/base/123',
      'http://data.europeana.eu/concept/base/456'
    ];
    const uriQuery = 'entity_uri:("http://data.europeana.eu/agent/base/123" OR "http://data.europeana.eu/concept/base/456")';
    const entitySearchResponse = {
      items: []
    };
    const searchEndpoint = '/entity/search';

    it('searches the API by entity URIs', async() => {
      nock(apiUrl)
        .get(searchEndpoint)
        .query(query => {
          return query.query === uriQuery;
        })
        .reply(200, entitySearchResponse);

      await entities.searchEntities(uris);

      nock.isDone().should.be.true;
    });
  });

  describe('getEntitySuggestions()', () => {
    const text = 'world';
    const suggestEndpoint = '/entity/suggest';

    it('passes `text` to the API', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.text === text;
        })
        .reply(200, entitySuggestionsResponse);

      await entities.getEntitySuggestions(text);

      nock.isDone().should.be.true;
    });

    it('passes `language` to API', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.language === 'fr';
        })
        .reply(200, entitySuggestionsResponse);

      await entities.getEntitySuggestions(text, { language: 'fr' });

      nock.isDone().should.be.true;
    });

    it('restricts types to agent & concept', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(query => {
          return query.type === 'agent,concept';
        })
        .reply(200, entitySuggestionsResponse);

      await entities.getEntitySuggestions(text);

      nock.isDone().should.be.true;
    });

    it('returns the "items"', async() => {
      nock(apiUrl)
        .get(suggestEndpoint)
        .query(true)
        .reply(200, entitySuggestionsResponse);

      const items = await entities.getEntitySuggestions(text);

      items.should.deep.eq(entitySuggestionsResponse.items);
    });
  });

  describe('relatedEntities()', () => {
    beforeEach('stub API response', () => {
      nock(apiUrl)
        .get('/entity/search')
        .query(true)
        .reply(200, entitiesResponse);
    });

    it('returns related entities', async() => {
      nock(recordApiUrl)
        .get(recordApiEndpoint)
        .query(true)
        .reply(200, searchResponse);

      const response = await entities.relatedEntities(entityType, entityId);
      response.length.should.eq(entitiesResponse.items.length);
    });

    it('filters on entity URI', async() => {
      nock(recordApiUrl)
        .get(recordApiEndpoint)
        .query(query => {
          return query.query === `${entityFilterField}:"${entityUri}"`;
        })
        .reply(200, searchResponse);

      await entities.relatedEntities(entityType, entityId);

      nock.isDone().should.be.true;
    });
  });

  describe('getEntityUri', () => {
    context('with an id of "100-test-slug', () => {
      let id = '100-test-slug';
      context('with type Agent', () => {
        let type = 'person';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = entities.getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/agent/base/100');
        });
      });

      context('with type Concept', () => {
        let type = 'topic';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = entities.getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/concept/base/100');
        });
      });
    });
  });

  describe('getEntityQuery', () => {
    context('when entity is a concept', () => {
      const uri = 'http://data.europeana.eu/concept/base/12345';
      it('queries on skos_concept', () => {
        entities.getEntityQuery(uri).should.eq(`skos_concept:"${uri}"`);
      });
    });

    context('when entity is an agent', () => {
      const uri = 'http://data.europeana.eu/agent/base/12345';
      it('queries on edm_agent', () => {
        entities.getEntityQuery(uri).should.eq(`edm_agent:"${uri}"`);
      });
    });

    context('otherwise', () => {
      const uri = 'http://data.europeana.eu/place/base/12345';
      it('is `null`', () => {
        (entities.getEntityQuery(uri) === null).should.be.true;
      });
    });
  });

  describe('getEntitySlug', () => {
    const entity = entitiesResponse.items[0];

    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = entities.getEntitySlug(entity.id, entity.prefLabel.en);
      return slug.should.eq('147831-architecture');
    });
  });

  describe('getEntityDescription', () => {
    context('with a Concept entity', () => {
      const entity = entitiesResponse.items[0];
      const locale = 'nl';

      it('returns the description with values and language code', () => {
        const description = entities.getEntityDescription(entity, locale);
        description.values[0].should.contain('Architecture');
        description.code.should.contain('en');
      });
    });

    context('with an Agent entity', () => {
      const entity = entitiesResponse.items[2];
      const locale = 'nl';

      it('returns the description with values and language code', () => {
        const description = entities.getEntityDescription(entity, locale);
        description.values[0].should.contain('Albert Gustaf Aristides Edelfelt');
        description.code.should.contain('en');
      });
    });
  });

  describe('getWikimediaThumbnailUrl', () => {
    context('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns an wikimedia thumbnail url starting with https://upload.wikimedia.org', () => {
        const thumbnail = entities.getWikimediaThumbnailUrl(entity.depiction.id);
        return thumbnail.should.contain('https://upload.wikimedia.org');
      });
    });
  });
});
