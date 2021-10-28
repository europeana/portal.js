import pick from '@/server-middleware/api/cache/pick.js';

describe('@/server-middleware/api/cache/pick', () => {
  it('returns as-is any non-Array argument', () => {
    const argument = 'not an Array';

    const filtered = pick(argument);

    filtered.should.eq(argument);
  });

  it('reduces Array argument object elements to picked properties', () => {
    const argument = [
      { id: '/a', name: 'A', alt: 'a' },
      { id: '/b', name: 'B', alt: 'b' }
    ];
    const expected = [
      { id: '/a', name: 'A' },
      { id: '/b', name: 'B' }
    ];

    const picked = pick(argument, ['id', 'name']);
    picked.should.eql(expected);
  });
});
