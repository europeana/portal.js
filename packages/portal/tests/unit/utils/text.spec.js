import { stringify, truncate } from '@/utils/text.js';

describe('utils/text', () => {
  describe('stringify', () => {
    describe('when field is not a literal', () => {
      it('returns a literal value', () => {
        const input = { values: ['provider'] };

        const string = stringify(input);

        expect(string).toBe('provider');
      });
    });

    describe('when field is a literal', () => {
      it('returns the value', () => {
        const input = 'provider';

        const string = stringify(input);

        expect(string).toBe('provider');
      });
    });
  });

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
