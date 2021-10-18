import sinon from 'sinon';
import dailyEntries from '@/server-middleware/api/cache/daily.js';

describe('@/server-middleware/api/cache/daily', () => {
  it('returns as-is any non-Array argument', () => {
    const argument = 'not an Array';

    const filtered = dailyEntries(argument);

    filtered.should.eq(argument);
  });

  it('filters Array arguments to 4 items for the current day', () => {
    const argument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const tests = [
      { now: 0, expected: [0, 1, 2, 3] },
      { now: 1634556628480, expected: [3, 4, 5, 6] }
    ];

    for (const test of tests) {
      sinon.stub(Date, 'now').returns(test.now);
      const filtered = dailyEntries(argument);
      filtered.should.eql(test.expected);
      Date.now.restore();
    }
  });
});
