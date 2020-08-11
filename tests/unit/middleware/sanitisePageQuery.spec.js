import { pageFromQuery } from '../../../middleware/sanitisePageQuery';

describe('middleware/sanitisePageQuery', () => {
  describe('pageFromQuery()', () => {
    context('with no value', () => {
      it('returns `1`', () => {
        for (const queryPage of [null, undefined]) {
          pageFromQuery(queryPage).should.eq(1);
        }
      });
    });

    context('with invalid value', () => {
      it('returns `null`', () => {
        for (const queryPage of ['0', '-1', '3.5', 'one', 'last']) {
          (pageFromQuery(queryPage) === null).should.be.true;
        }
      });
    });

    context('with valid value', () => {
      it('returns it typecast as `Number`', () => {
        for (const queryPage of ['1', '2', '20']) {
          pageFromQuery(queryPage).should.eq(Number(queryPage));
        }
      });
    });
  });
});
