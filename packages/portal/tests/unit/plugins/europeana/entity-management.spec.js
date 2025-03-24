import nock from 'nock';

import entityManagement from '@/plugins/europeana/entity-management';

const proxyBody = { type: 'Concept',
  prefLabel: { en: 'Painting' },
  note: {
    en: ['A two-dimensional visual language']
  } };

const updatedEntity = { id: 'http://data.europeana.eu/concept/124',
  type: 'Concept',
  prefLabel: { en: 'Painting' },
  note: {
    en: ['A two-dimensional visual language']
  } };

const entityResponses = {
  items: [
    {
      id: 'http://data.europeana.eu/concept/123',
      type: 'Concept',
      prefLabel: { en: 'Book' },
      note: {
        en: ['A medium for recording information in the form of writing or images']
      }
    },
    {
      id: 'http://data.europeana.eu/concept/124',
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

  describe('get', () => {
    it('gets the entity data, defaulting to profile internal', async() => {
      const entityId = '123';
      const entityUri = 'http://data.europeana.eu/concept/123';
      const profile = 'internal';
      nock(entityManagement.BASE_URL)
        .get(`/concept/${entityId}`)
        .query((query) => query.profile === profile)
        .reply(200, entityResponses.items[0]);

      const response = await (new entityManagement).get(entityUri);

      expect(response.note.en).toEqual(['A medium for recording information in the form of writing or images']);
    });

    it('supports overriding the default profile', async() => {
      const entityId = '123';
      const entityUri = 'http://data.europeana.eu/concept/123';
      const profile = 'external';
      nock(entityManagement.BASE_URL)
        .get(`/concept/${entityId}`)
        .query((query) => query.profile === profile)
        .reply(200, entityResponses.items[0]);

      await (new entityManagement).get(entityUri, { profile });

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('update', () => {
    it('updates the data', async() => {
      const entityId = '124';
      const entityUri = 'http://data.europeana.eu/concept/124';
      nock(entityManagement.BASE_URL)
        .put(`/concept/${entityId}`)
        .reply(200, updatedEntity);

      const response = await (new entityManagement).update(entityUri, proxyBody);

      expect(response.id).toBe('http://data.europeana.eu/concept/124');
    });
  });
});
