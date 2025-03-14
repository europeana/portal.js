import { useCardinality } from '@/composables/cardinality.js';

describe('useCardinality', () => {
  describe('cardinality', () => {
    describe('when argument is an array', () => {
      const value = [1, 2];

      it('is "many"', () => {
        const { cardinality } = useCardinality(value);

        expect(cardinality.value).toBe('many');
      });
    });

    describe('when argument is a scalar', () => {
      const value = 3;

      it('is "one"', () => {
        const { cardinality } = useCardinality(value);

        expect(cardinality.value).toBe('one');
      });
    });
  });
});
