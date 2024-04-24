import VueRouterQuery, { parseQuery, stringifyQuery } from '@/index.js';

describe('VueRouterQuery', () => {
  describe('install', () => {
    it('adds parseQuery function to router options', () => {
      const router = { options: {} };

      VueRouterQuery.install(null, { router });

      expect(router.options.parseQuery).toBe(parseQuery);
    });

    it('adds stringifyQuery function to router options', () => {
      const router = { options: {} };

      VueRouterQuery.install(null, { router });

      expect(router.options.stringifyQuery).toBe(stringifyQuery);
    });
  });

  describe('parseQuery', () => {
    it('combines multiple instances of same param into array', () => {
      const query = 'qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Greece%22';

      const parsed = parseQuery(query);

      expect(parsed).toEqual({ qf: ['TYPE:"IMAGE"', 'COUNTRY:"Greece"'] });
    });
  });

  describe('stringifyQuery', () => {
    it('repeats param for arrays', () => {
      const query = { qf: ['TYPE:"IMAGE"', 'COUNTRY:"Greece"'] };

      const stringified = stringifyQuery(query);

      expect(stringified).toEqual('?qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Greece%22');
    });

    it('includes "=" for blank params', () => {
      const query = { query: '' };

      const stringified = stringifyQuery(query);

      expect(stringified).toEqual('?query=');
    });

    it('equals "" if no params', () => {
      const query = {};

      const stringified = stringifyQuery(query);

      expect(stringified).toEqual('');
    });
  });
});
