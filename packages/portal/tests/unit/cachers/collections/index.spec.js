import nock from 'nock';

import cacher, { countEntities } from '@/cachers/collections/index.js';

const ENTITY_TYPE = 'timespan';
const ENTITY_SCOPE = 'europeana';

const apiResponse = {
  pageOne: {
    items: [
      {
        id: 'http://data.europeana.eu/timespan/1',
        prefLabel: {
          en: '1st century'
        },
        isShownBy: 'http://www.example.eu'
      },
      {
        id: 'http://data.europeana.eu/timespan/2',
        prefLabel: {
          en: '10th century'
        },
        isShownBy: 'http://www.example.eu'
      }
    ],
    next: 'https://api.example.org/entity/search?wskey=entityApiKey&query=*:*&scope=europeana&sort=id&pageSize=100&type=timespan&page=2'
  },
  pageTwo: {
    items: [
      {
        id: 'http://data.europeana.eu/timespan/3',
        prefLabel: {
          en: '2nd century'
        },
        isShownBy: 'http://www.example.eu'
      }
    ]
  }
};

const dataToCache = [
  {
    id: 'http://data.europeana.eu/timespan/1',
    prefLabel: {
      en: '1st century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '1-1st-century'
  },
  {
    id: 'http://data.europeana.eu/timespan/2',
    prefLabel: {
      en: '10th century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '2-10th-century'
  },
  {
    id: 'http://data.europeana.eu/timespan/3',
    prefLabel: {
      en: '2nd century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '3-2nd-century'
  }
];

const params = {
  type: ENTITY_TYPE
};

const config = {
  europeana: {
    apis: {
      entity: {
        url: 'https://api.example.org/entity',
        key: 'entityApiKey'
      }
    }
  }
};

describe('cachers/collections/index', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('default export', () => {
    beforeEach(() => {
      nock(config.europeana.apis.entity.url)
        .get('/search')
        .query((query) => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE)
        .reply(200, apiResponse.pageOne);
      nock(config.europeana.apis.entity.url)
        .get('/search')
        .query((query) => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE && query.page === '2')
        .reply(200, apiResponse.pageTwo);
    });

    it('paginates over data via `next` in response', async() => {
      await cacher(params, config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns all data to cache, with slugs', async() => {
      const data = await cacher(params, config);

      expect(data).toEqual(dataToCache);
    });
  });

  describe('countEntities', () => {
    const countResponse = {
      partOf: {
        total: '2600'
      }
    };

    beforeEach(() => {
      nock(config.europeana.apis.entity.url)
        .get('/search')
        .query((query) => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE && query.pageSize === '0' && query.query === '*:*')
        .reply(200, countResponse);
    });

    it('fetches the count from the Entity API', async() => {
      await countEntities(params, config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns the entity total, to cache', async() => {
      const data = await countEntities(params, config);

      expect(data).toBe(countResponse.partOf.total);
    });
  });
});
