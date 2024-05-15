import { getLabelledSlug } from '@/slug.js';

describe('@europeana/utils/slug.js', () => {
  describe('getLabelledSlug', () => {
    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = getLabelledSlug('http://data.euroepana.eu/concept/147831', 'Architecture');
      expect(slug).toBe('147831-architecture');
    });
  });
});
