import * as cacher from '@/cachers/dataspace/hq-data.js';

describe('cachers/dataspace/hq-data', () => {
  describe('.data', () => {
    it('returns "+10%"', () => {
      const data = cacher.data();

      expect(data).toBe('+10%');
    });
  });
});
