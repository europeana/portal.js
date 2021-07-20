import nock from 'nock';

import entitymanage, { BASE_URL } from '@/plugins/europeana/entity-management';

const axios = require('axios');

const proxyBody = { type: 'Concept',
  prefLabel: { en: 'Painting' },
  note: {
    en: ['A two-dimensional visual language']
  } };

const updatedEntity = { id: 'http://data.europeana.eu/concept/base/124',
  type: 'Concept',
  prefLabel: { en: 'Painting' },
  note: {
    en: ['A two-dimensional visual language']
  } };

const entityResponses = {
  items: [
    {
      id: 'http://data.europeana.eu/concept/base/123',
      type: 'Concept',
      prefLabel: { en: 'Book' },
      note: {
        en: ['A medium for recording information in the form of writing or images']
      }
    },
    {
      id: 'http://data.europeana.eu/concept/base/124',
      type: 'Concept',
      prefLabel: { en: 'Painting' },
      note: {
        en: ['The practice of applying paint to a solid surface']
      }
    }
  ]
};

describe('plugins/europeana/entity-management', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getEntity()', () => {
    it('get the entity data', async() => {
      const entityId = '123';
      const type = 'topic';
      const profile = 'internal';
      nock(BASE_URL)
        .get(`/concept/base/${entityId}?profile=internal`)
        .reply(200, entityResponses.items[0]);
      const response =  await entitymanage(axios).getEntity(type, entityId, { profile });
      response.note['en'].should.deep.equal(['A medium for recording information in the form of writing or images']);
    });
  });

  describe('updateEntity()', () => {
    it('updates the data', async() => {
      const entityId = '124';
      nock(BASE_URL)
        .put(`/concept/base/${entityId}`)
        .reply(200, updatedEntity);
      const response =  await entitymanage(axios).updateEntity(entityId, proxyBody);
      response.id.should.eq('http://data.europeana.eu/concept/base/124');
    });
  });
});
