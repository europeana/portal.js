import stringify from '@/utils/text/stringify.js';

describe('@/utils/text/stringify.js', () => {
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
});
