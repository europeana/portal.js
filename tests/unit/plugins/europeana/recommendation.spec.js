import nock from 'nock';

import recommendation from '../../../../plugins/europeana/recommendation';
import config from '../../../../plugins/europeana';
const apiUrl = `${config.recommendation.origin}${config.recommendation.path}`;

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const recommendations = ['/123/def', '/123/ghi'];

describe('plugins/europeana/recommendation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('recommend()', () => {
    context('when type is "record"', () => {
      it('requests and returns recommendations for the given item ID', async() => {
        nock(apiUrl)
          .get('/record/123/abc')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('record', '/123/abc');

        nock.isDone().should.be.true;
        response.should.eql(recommendations);
      });
    });

    context('when type is "set"', () => {
      it('requests and returns recommendations for the given seet ID', async() => {
        nock(apiUrl)
          .get('/set/123')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('set', '/123');

        nock.isDone().should.be.true;
        response.should.eql(recommendations);
      });
    });
  });
});
