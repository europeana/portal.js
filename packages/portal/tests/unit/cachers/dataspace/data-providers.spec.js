import * as cacher from '@/cachers/dataspace/data-providers.js';

describe('cachers/dataspace/data-providers', () => {
  describe('.data', () => {
    it('returns 3500', () => {
      const data = cacher.data();

      expect(data).toBe(3500);
    });
  });
});
