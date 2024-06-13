import contentfulEntryHasContentType from '@/utils/contentful/entryHasContentType.js';

describe('utils/contentful/entryHasContentType', () => {
  describe('contentfulEntryHasContentType', () => {
    it('is true when `__typename` property matches', () => {
      const hasType = contentfulEntryHasContentType(
        { '__typename': 'blogPosting' }, 'blogPosting'
      );

      expect(hasType).toBe(true);
    });

    it('is false when `__typename` property does not match', () => {
      const hasType = contentfulEntryHasContentType(
        { '__typename': 'landingPage' }, 'blogPosting'
      );

      expect(hasType).toBe(false);
    });
  });
});
