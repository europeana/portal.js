import * as cacher from '@/cachers/dataspace/partners.js';

describe('cachers/dataspace/partners', () => {
  describe('.data', () => {
    it('returns 19', () => {
      const data = cacher.data();

      expect(data).toBe(19);
    });
  });
});
