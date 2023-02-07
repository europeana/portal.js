import themes from '@/plugins/europeana/themes';

describe('@/plugins/europeana/themes', () => {
  describe('themes', () => {
    it('includes the 13 europeana themes', async() => {
      expect(themes.length).toBe(13);
    });
  });
});
