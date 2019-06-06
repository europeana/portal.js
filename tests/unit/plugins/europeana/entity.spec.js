import nock from 'nock';
import { getEntity, relatedEntities, getEntityUri, getEntitySlug, getWikimediaThumbnailUrl, getEntityDescription } from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/entity/concept/base/94';
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
    { type: 'Agent',
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
    { type: 'Agent',
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
      describe('with "No resource found with ID: ..." error', () => {
        const errorMessage = 'No resource found with ID:';

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(404, {
              error: errorMessage
            });
        });

        it('throws API error message', () => {
          const response = getEntity(entityType, entityId, { wskey: apiKey });
          return response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with object in response', () => {
        const apiResponse = {
          prefLabel: {
            en: 'Architecture'
          },
          note: {
            en: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.']
          },
          depiction: {
            id: 'http://commons.wikimedia.org/wiki/Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg',
            source: 'http://commons.wikimedia.org/wiki/File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg'
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async () => {
          const response = await getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('returns entity description', async () => {
          const response = await getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.note.en[0].should.contain('Architecture is both the process and the product of planning');
        });

        it('returns entity depiction', async () => {
          const response = await getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.depiction.id.should.contain('Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('returns entity attribution', async () => {
          const response = await getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.depiction.source.should.contain('File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg');
        });

        it('has a misspelled id and returns entity title', async () => {
          const response = await getEntity(entityType, entityIdMisspelled, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
    });
  });

  describe('relatedEntities()', () => {
    describe('API response', () => {
      describe('with object in response', () => {

        beforeEach('stub API response', () => {
          nock(apiUrlSearch)
            .get(apiEndpointSearch)
            .query(true)
            .reply(200, searchResponse);

          nock(apiUrl)
            .get('/entity/search')
            .query(true)
            .reply(200, entitiesResponse);
        });

        it('returns related entities', async () => {
          const response = await relatedEntities(entityType, entityId, { wskey: apiKey, entityKey: apiKey });
          response.length.should.eq(entitiesResponse.items.length);
        });
      });
    });
  });

  describe('getEntityUri', () => {
    describe('with an id of "100-test-slug', () => {
      let id = '100-test-slug';
      describe('with type Agent', () => {
        let type = 'person';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/agent/base/100');
        });
      });

      describe('with type Concept', () => {
        let type = 'topic';
        it('returns an agent URI, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/concept/base/100');
        });
      });
    });
  });

  describe('getEntitySlug', () => {
    describe('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns an agent URI, without any human readable labels', () => {
        const slug = getEntitySlug(entity);
        return slug.should.eq('147831-architecture');
      });
    });
  });

  describe('getEntityDescription', () => {
    describe('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns a description', () => {
        const description = getEntityDescription('topic', entity);
        return description.should.contain('Architecture');
      });
    });
  });

  describe('getWikimediaThumbnailUrl', () => {
    describe('with an entity', () => {
      let entity = entitiesResponse.items[0];
      it('returns an wikimedia thumbnail url starting with https://upload.wikimedia.org', () => {
        const thumbnail = getWikimediaThumbnailUrl(entity.depiction.id);
        return thumbnail.should.contain('https://upload.wikimedia.org');
      });
    });
  });
});
