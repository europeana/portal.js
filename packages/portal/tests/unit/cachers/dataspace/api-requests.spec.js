import * as cacher from '@/cachers/dataspace/api-requests.js';

describe('cachers/dataspace/api-requests', () => {
  describe('.data', () => {
    it('returns 13000000', () => {
      const data = cacher.data();

      expect(data).toBe(13000000);
    });
  });
});
