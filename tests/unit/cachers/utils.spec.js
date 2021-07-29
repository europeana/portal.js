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
});
