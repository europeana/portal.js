import nock from 'nock';
import * as cacher from '@/cachers/matomo/visits.js';

const config = {
  matomo: {
    authToken: 'MY_AUTH_TOKEN',
    host: 'https://stats.example.org',
    siteId: '1'
  }
};

const matomoApiRequest = () => nock(config.matomo.host)
  .get('/')
  .query((query) => (
    query.date === 'last30' &&
    query.format === 'JSON' &&
    query.idSite === config.matomo.siteId &&
    query.method === 'VisitsSummary.get' &&
    query.module === 'API' &&
    query.period === 'day' &&
    query['token_auth'] === config.matomo.authToken
  ));

describe('@/cachers/matomo/visits.js', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('data', () => {
    const response = {
      '2023-01-01': {
        'nb_visits': undefined
      },
      '2023-01-02': {
        'nb_visits': 10
      },
      '2023-01-03': {
        'nb_visits': 15
      }
    };
    const averageVisits = 8;

    it('fetches the count from the Matomo API', async() => {
      matomoApiRequest().reply(200, response);

      await cacher.data(config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns the average number of visits, to cache', async() => {
      matomoApiRequest().reply(200, response);

      const data = await cacher.data(config);

      expect(data).toBe(averageVisits);
    });

    it('throws an error if the Matomo API returns an error', async() => {
      // (weird because it has status code 200)
      const weirdMatomoErrorResponse = {
        result: 'error'
      };
      matomoApiRequest().reply(200, weirdMatomoErrorResponse);

      let error;
      try {
        await cacher.data(config);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Failed to get visits data from Matomo');
    });
  });

  it('picks nothing', () => {
    expect(cacher.PICK).toBe(false);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBe(false);
  });
});
