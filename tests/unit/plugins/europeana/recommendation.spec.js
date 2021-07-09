import nock from 'nock';

import recommendation, { BASE_URL } from '@/plugins/europeana/recommendation';

const axios = require('axios');

const recommendations = ['/123/def', '/123/ghi'];

describe('plugins/europeana/recommendation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('recommend()', () => {
    context('when type is "record"', () => {
      it('requests and returns recommendations for the given item ID', async() => {
        nock(BASE_URL)
          .get('/record/123/abc')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('record', '/123/abc');

        nock.isDone().should.be.true;
        response.should.eql(recommendations);
      });
    });

    context('when type is "set"', () => {
      it('requests and returns recommendations for the given set ID', async() => {
        nock(BASE_URL)
          .get('/set/123')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('set', '/123');

        nock.isDone().should.be.true;
        response.should.eql(recommendations);
      });
    });
  });
});
