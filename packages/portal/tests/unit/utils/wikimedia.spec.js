import { getWikimediaThumbnailUrl } from '@/utils/wikimedia.js';

describe('@europeana/portal/utils/wikimedia.js', () => {
  describe('getWikimediaThumbnailUrl', () => {
    it('returns an wikimedia thumbnail url', () => {
      const logo = 'http://commons.wikimedia.org/wiki/Special:FilePath/Uni-Leiden-seal.png';

      const thumbnail = getWikimediaThumbnailUrl(logo, 60);

      expect(thumbnail).toBe('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Uni-Leiden-seal.png/60px-Uni-Leiden-seal.png');
    });
  });
});
