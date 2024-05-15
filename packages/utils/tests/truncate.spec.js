import { truncate } from '@/truncate.js';

describe('@europeana/utils/truncate.js', () => {
  describe('truncate', () => {
    it('returns null if text is falsy', () => {
      const text = undefined;

      const truncated = truncate(text);

      expect(truncated).toBeNull();
    });

    it('returns full text if not too long', () => {
      const text = 'short';

      const truncated = truncate(text);

      expect(truncated).toBe('short');
    });

    it('truncates text if needed, and adds ellipsis', () => {
      const text = 'short';

      const truncated = truncate(text, 3);

      expect(truncated).toBe('sho…');
    });
  });
});
