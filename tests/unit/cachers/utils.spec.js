import redis from 'redis';
import { fakeRedisClient } from '../utils';

const utils = require('@/cachers/utils');

const redisClientStub = fakeRedisClient();

describe('cachers/utils', () => {
  describe('createRedisClient', () => {
    before('stub redis methods', () => {
      redisClientStub.stub();
    });
    after('restore redis methods', () => {
      redisClientStub.restore();
    });

    it('creates a redis client from params', () => {
      const params = {
        redisUrl: 'redis://localhost:6370/0'
      };

      utils.createRedisClient(params);

      redis.createClient.should.have.been.calledWith({ url: params.redisUrl });
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
});
