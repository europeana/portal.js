import nock from 'nock';
import * as entities from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/entity/concept/base/94';
const entityUri = 'http://data.europeana.eu/concept/base/94';
const entityFilterField = 'skos_concept';
const apiKey = 'abcdef';
const baseRequest = nock(apiUrl).get(apiEndpoint);

const apiUrlSearch = 'https://api.europeana.eu';
const apiEndpointSearch = '/api/v2/search.json';

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
      id: 'http://data.europeana.eu/agent/base/147831',
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
      id: 'http://data.europeana.eu/agent/base/49928',
      prefLabel: { en: 'Painting' }
    }
  ]
};

describe('plugins/europeana/entity', () => {
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
            await entities.getEntity(entityType, entityId, { wskey: apiKey });
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
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async() => {
          const response = await entities.getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('returns entity description', async() => {
          const response = await entities.getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.note.en[0].should.contain('Architecture is both the process and the product of planning');
        });

        it('returns entity depiction', async() => {
          const response = await entities.getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.depiction.id.should.contain('Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('returns entity attribution', async() => {
          const response = await entities.getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.depiction.source.should.contain('File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('has a misspelled id and returns entity title', async() => {
          const response = await entities.getEntity(entityType, entityIdMisspelled, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
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
      nock(apiUrlSearch)
        .get(apiEndpointSearch)
        .query(true)
        .reply(200, searchResponse);

      const response = await entities.relatedEntities(entityType, entityId, { wskey: apiKey, entityKey: apiKey });
      response.length.should.eq(entitiesResponse.items.length);
    });

    context('without `theme` param', () => {
      it('filters on entity URI', async() => {
        nock(apiUrlSearch)
          .get(apiEndpointSearch)
          .query(query => {
            return query.qf === `${entityFilterField}:"${entityUri}"`;
          })
          .reply(200, searchResponse);

        await entities.relatedEntities(entityType, entityId, { wskey: apiKey, entityKey: apiKey });

        nock.isDone().should.be.true;
      });
    });

    context('with `theme` param', () => {
      it('filters on theme', async() => {
        const entityTheme = 'music';

        nock(apiUrlSearch)
          .get(apiEndpointSearch)
          .query(query => {
            return query.theme === entityTheme;
          })
          .reply(200, searchResponse);

        await entities.relatedEntities(entityType, entityId, { wskey: apiKey, entityKey: apiKey, theme: entityTheme });

        nock.isDone().should.be.true;
      });
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
    context('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns an agent URI, without any human readable labels', () => {
        const slug = entities.getEntitySlug(entity);
        return slug.should.eq('147831-architecture');
      });
    });
  });

  describe('getEntityDescription', () => {
    context('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns a description', () => {
        const description = entities.getEntityDescription(entity);
        return description.should.contain('Architecture');
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
