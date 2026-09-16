import themes from '@/utils/europeana/themes.js';

describe('@/utils/europeana/themes', () => {
  describe('themes', () => {
    it('includes the 14 Europeana themes', () => {
      expect(themes.length).toBe(14);
    });
  });
});
