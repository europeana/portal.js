import { contentfulEntryUrl } from '@/utils/contentful/entry-url.js';

describe('@/utils/contentful/entity-url', () => {
  describe('contentfulEntryUrl', () => {
    it('prefixes BlogPosting entries with /blog', () => {
      const url = contentfulEntryUrl({
        '__typename': 'BlogPosting',
        identifier: 'interesting'
      });

      expect(url).toBe('/blog/interesting');
    });

    it('prefixes ExhibitionPage entries with /exhibitions', () => {
      const url = contentfulEntryUrl({
        '__typename': 'ExhibitionPage',
        identifier: 'educational'
      });

      expect(url).toBe('/exhibitions/educational');
    });

    it('prefixes Story entries with /stories', () => {
      const url = contentfulEntryUrl({
        '__typename': 'Story',
        identifier: 'told'
      });

      expect(url).toBe('/stories/told');
    });
  });
});
