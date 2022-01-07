import nock from 'nock';

import recommendation, { BASE_URL } from '@/plugins/europeana/recommendation';

import axios from 'axios';

const recommendations = ['/123/def', '/123/ghi'];
const oldRecommendedItem = ['/123/jkl'];
const newRecommendedItem = ['/123/mno'];

describe('plugins/europeana/recommendation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('recommend()', () => {
    describe('when type is "record"', () => {
      it('requests and returns recommendations for the given item ID', async() => {
        nock(BASE_URL)
          .get('/record/123/abc')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('record', '/123/abc');

        expect(nock.isDone()).toBe(true);
        expect(response).toEqual(recommendations);
      });
    });

    describe('when type is "set"', () => {
      it('requests and returns recommendations for the given set ID', async() => {
        nock(BASE_URL)
          .get('/set/123')
          .reply(200, recommendations);

        const response = await recommendation(axios).recommend('set', '/123');

        expect(nock.isDone()).toBe(true);
        expect(response).toEqual(recommendations);
      });
    });
  });

  describe('accept()', () => {
    describe('when type is "set"', () => {
      it('accepts a recommended item and returns a new recommendation for the given set ID', async() => {
        nock(BASE_URL)
          .post('/set/123')
          .reply(200, newRecommendedItem);

        const response = await recommendation(axios).accept('set', '/123', oldRecommendedItem);

        expect(nock.isDone()).toBe(true);
        expect(response).toEqual(newRecommendedItem);
      });
    });
  });

  describe('reject()', () => {
    describe('when type is "set"', () => {
      it('rejects a recommended item and returns a new recommendation for the given set ID', async() => {
        nock(BASE_URL)
          .post('/set/123')
          .reply(200, newRecommendedItem);

        const response = await recommendation(axios).accept('set', '/123', oldRecommendedItem);

        expect(nock.isDone()).toBe(true);
        expect(response).toEqual(newRecommendedItem);
      });
    });
  });
});
