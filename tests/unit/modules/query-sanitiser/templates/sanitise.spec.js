import { page } from '@/modules/query-sanitiser/templates/sanitise';

describe('sanitise', () => {
  describe('page()', () => {
    describe('with no value', () => {
      it('returns `1`', () => {
        for (const queryPage of [null, undefined]) {
          expect(page(queryPage)).toBe(1);
        }
      });
    });

    describe('with invalid value', () => {
      it('returns `null`', () => {
        for (const queryPage of ['0', '-1', '3.5', 'one', 'last']) {
          expect(page(queryPage)).toBe(null);
        }
      });
    });

    describe('with valid value', () => {
      it('returns it typecast as `Number`', () => {
        for (const queryPage of ['1', '2', '20']) {
          expect(page(queryPage)).toBe(Number(queryPage));
        }
      });
    });
  });
});
