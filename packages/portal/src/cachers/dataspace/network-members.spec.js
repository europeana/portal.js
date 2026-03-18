import * as cacher from '@/cachers/dataspace/network-members.js';

describe('cachers/dataspace/network-members', () => {
  describe('.data', () => {
    it('returns 4500', () => {
      const data = cacher.data();

      expect(data).toBe(4500);
    });
  });
});
