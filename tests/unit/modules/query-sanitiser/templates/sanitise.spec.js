import { page } from '@/modules/query-sanitiser/templates/sanitise';

describe('sanitise', () => {
  describe('page()', () => {
    context('with no value', () => {
      it('returns `1`', () => {
        for (const queryPage of [null, undefined]) {
          page(queryPage).should.eq(1);
        }
      });
    });

    context('with invalid value', () => {
      it('returns `null`', () => {
        for (const queryPage of ['0', '-1', '3.5', 'one', 'last']) {
          (page(queryPage) === null).should.be.true;
        }
      });
    });

    context('with valid value', () => {
      it('returns it typecast as `Number`', () => {
        for (const queryPage of ['1', '2', '20']) {
          page(queryPage).should.eq(Number(queryPage));
        }
      });
    });
  });
});
