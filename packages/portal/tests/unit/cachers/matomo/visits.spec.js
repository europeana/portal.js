import nock from 'nock';
import * as cacher from '@/cachers/matomo/visits.js';

const config = {
  matomo: {
    authToken: 'MY_AUTH_TOKEN',
    host: 'https://stats.example.org',
    siteId: '1'
  }
};

describe('@/cachers/matomo/visits.js', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('data', () => {
    const response = {
      'nb_visits': 16253
    };

    beforeEach(() => {
      nock(config.matomo.host)
        .get('/')
        .query(query => (
          query.date === 'yesterday' &&
          query.format === 'JSON' &&
          query.idSite === config.matomo.siteId &&
          query.method === 'VisitsSummary.get' &&
          query.module === 'API' &&
          query.period === 'day' &&
          query['token_auth'] === config.matomo.authToken
        ))
        .reply(200, response);
    });

    it('fetches the count from the Matomo API', async() => {
      await cacher.data(config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns the number of visits, to cache', async() => {
      const data = await cacher.data(config);

      expect(data).toBe(response['nb_visits']);
    });
  });

  it('picks nothing', () => {
    expect(cacher.PICK).toBe(false);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBe(false);
  });
});
