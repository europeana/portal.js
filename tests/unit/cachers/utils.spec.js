import redis from 'redis';
import sinon from 'sinon';

const utils = require('@/cachers/utils');

let redisClientStub;

describe('cachers/utils', () => {
  describe('createRedisClient', () => {
    before('stub redis methods', () => {
      redisClientStub = {
        on: sinon.spy(),
        get: sinon.spy(),
        set: sinon.spy(),
        quit: sinon.spy()
      };

      sinon.stub(redis, 'createClient').returns(redisClientStub);
    });
    after('restore redis methods', () => {
      redis.createClient.restore();
    });

    it('creates a redis client from config', () => {
      const config = {
        url: 'redis://localhost:6370/0'
      };

      utils.createRedisClient(config);

      redis.createClient.should.have.been.calledWith({ url: config.url });
    });

    it('adds an error handler to report to the console', () => {
      utils.createRedisClient();

      redisClientStub.on.should.have.been.calledWith('error', console.error);
    });

    it('defines async get, set and quit methods', () => {
      const redisClient = utils.createRedisClient();

      (typeof redisClient.getAsync).should.eq('function');
      (typeof redisClient.setAsync).should.eq('function');
      (typeof redisClient.quitAsync).should.eq('function');
    });
  });

  describe('errorMessage', () => {
    context('with property .response', () => {
      context('having property .data.error', () => {
        const error = { response: { data: { error: 'Uh oh' } } };
        it('uses property .response.data.error', () => {
          utils.errorMessage(error).should.eq(error.response.data.error);
        });
      });

      context('not having property .data.error', () => {
        const error = { response: { data: {}, status: 404, statusText: 'Not Found' } };
        it('combines properties .response.status and .response.statusText', () => {
          utils.errorMessage(error).should.eq('404 Not Found');
        });
      });
    });

    context('without property .response', () => {
      const error = { message: 'Uh oh' };
      it('uses property .message', () => {
        utils.errorMessage(error).should.eq(error.message);
      });
    });
  });

  describe('localise', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.localise(argument, 'prefLabel', 'fr');

      filtered.should.eq(argument);
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
      localised.should.eql(expected);
    });

    // it('omits any Array members without localised prefLabel', () => {
    //   const argument = [
    //     { id: '1' },
    //     { id: '2', prefLabel: { en: 'English 2', fr: 'Français 2' } }
    //   ];
    //
    //   const expected = [
    //     { id: '2', prefLabel: 'Français 2' }
    //   ];
    //
    //   const localised = utils.localise(argument, 'fr');
    //   localised.should.eql(expected);
    // });
  });

  describe('pick', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.pick(argument);

      filtered.should.eq(argument);
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
      picked.should.eql(expected);
    });
  });

  describe('daily', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.daily(argument, 4);

      filtered.should.eq(argument);
    });

    it('filters Array arguments to requested number for the current day', () => {
      const argument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const tests = [
        { now: 0, expected: [0, 1, 2, 3] },
        { now: 1634556628480, expected: [3, 4, 5, 6] }
      ];

      for (const test of tests) {
        sinon.stub(Date, 'now').returns(test.now);
        const filtered = utils.daily(argument, 4);
        filtered.should.eql(test.expected);
        Date.now.restore();
      }
    });
  });
});
