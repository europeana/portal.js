import * as redis from 'redis';
import sinon from 'sinon';

const utils = require('@/cachers/utils');

let redisClientStub;

describe('cachers/utils', () => {
  describe('createRedisClient', () => {
    beforeAll(() => {
      redisClientStub = {
        on: sinon.spy(),
        get: sinon.spy(),
        set: sinon.spy(),
        quit: sinon.spy()
      };

      sinon.stub(redis, 'createClient').returns(redisClientStub);
    });
    afterAll(() => {
      redis.createClient.restore();
    });

    it('creates a redis client from config', () => {
      const config = {
        url: 'redis://localhost:6370/0'
      };

      utils.createRedisClient(config);

      expect(redis.createClient.calledWith({ url: config.url })).toBe(true);
    });

    it('adds an error handler to report to the console', () => {
      utils.createRedisClient();

      expect(redisClientStub.on.calledWith('error', console.error)).toBe(true);
    });
  });

  describe('errorMessage', () => {
    describe('with property .response', () => {
      describe('having property .data.error', () => {
        const error = { response: { data: { error: 'Uh oh' } } };
        it('uses property .response.data.error', () => {
          expect(utils.errorMessage(error)).toBe(error.response.data.error);
        });
      });

      describe('not having property .data.error', () => {
        const error = { response: { data: {}, status: 404, statusText: 'Not Found' } };
        it('combines properties .response.status and .response.statusText', () => {
          expect(utils.errorMessage(error)).toBe('404 Not Found');
        });
      });
    });

    describe('without property .response', () => {
      const error = { message: 'Uh oh' };
      it('uses property .message', () => {
        expect(utils.errorMessage(error)).toBe(error.message);
      });
    });
  });

  describe('fallbackApiUrl', () => {
    describe('when the API config is for the record API', () => {
      it('returns the default BASE_URL from the record API', () => {
        let fallback = utils.fallbackApiUrl('record');

        expect(fallback).toBe('https://api.europeana.eu/record');
      });
    });

    describe('when the API config is for the entity API', () => {
      it('returns the default BASE_URL from the entity API', () => {
        let fallback = utils.fallbackApiUrl('entity');

        expect(fallback).toBe('https://api.europeana.eu/entity');
      });
    });
  });

  describe('localise', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.localise(argument, 'prefLabel', 'fr');

      expect(filtered).toBe(argument);
    });

    it('localises Array members\' prefLabel to the specified locale', () => {
      const argument = [
        { id: '1', prefLabel: { en: 'English 1', fr: 'Français 1' } },
        { id: '2', prefLabel: { en: 'English 2', fr: 'Français 2' } }
      ];

      const expected = [
        { id: '1', prefLabel: 'Français 1' },
        { id: '2', prefLabel: 'Français 2' }
      ];

      const localised = utils.localise(argument, 'prefLabel', 'fr');
      expect(localised).toEqual(expected);
    });
  });

  describe('pick', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.pick(argument);

      expect(filtered).toBe(argument);
    });

    it('reduces Array argument object elements to picked properties', () => {
      const argument = [
        { id: '/a', name: 'A', alt: 'a' },
        { id: '/b', name: 'B', alt: 'b' }
      ];
      const expected = [
        { id: '/a', name: 'A' },
        { id: '/b', name: 'B' }
      ];

      const picked = utils.pick(argument, ['id', 'name']);

      expect(picked).toEqual(expected);
    });
  });

  describe('sort', () => {
    it('gets property to sort by from callback if 2nd arg is a function', () => {
      const data = ['b', 'c', 'a'];
      const sortFn = (val) => val;

      const sorted = utils.sort(data, sortFn);

      expect(sorted).toEqual(['a', 'b', 'c']);
    });

    it('gets property to sort by from object property if 2nd arg is not a function', () => {
      const data = [{ id: 'b' }, { id: 'c' }, { id: 'a' }];

      const sorted = utils.sort(data, 'id');

      expect(sorted).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    });

    it('sorts numeric text by number', () => {
      const data = [{ id: '1-one' }, { id: '12-twelve' }, { id: '2-two' }];

      const sorted = utils.sort(data, 'id');

      expect(sorted).toEqual([{ id: '1-one' }, { id: '2-two' }, { id: '12-twelve' }]);
    });
  });
});
