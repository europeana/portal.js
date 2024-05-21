import sinon from 'sinon';

import { daily } from '@/daily.js';

describe('@europeana/utils/daily.js', () => {
  describe('daily', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = daily(argument, 4);

      expect(filtered).toBe(argument);
    });

    it('filters Array arguments to requested number for the current day', () => {
      const argument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const tests = [
        { now: 0, expected: [0, 1, 2, 3] },
        { now: 1634556628480, expected: [3, 4, 5, 6] }
      ];

      for (const test of tests) {
        sinon.stub(Date, 'now').returns(test.now);
        const filtered = daily(argument, 4);
        expect(filtered).toEqual(test.expected);
        Date.now.restore();
      }
    });
  });
});
