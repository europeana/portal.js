import localise from '@/server-middleware/api/cache/localise.js';

describe('@/server-middleware/api/cache/localise', () => {
  it('returns as-is any non-Array argument', () => {
    const argument = 'not an Array';

    const filtered = localise(argument);

    filtered.should.eq(argument);
  });

  it('localises Array members\' prefLabel to the specified locale', () => {
    const argument = [
      { id: '1', prefLabel: { en: 'English 1', fr: 'Français 1' } },
      { id: '2', prefLabel: { en: 'English 2', fr: 'Français 2' } }
    ];

    const expected = [
      { id: '1', prefLabel: 'Français 1' },
      { id: '2', prefLabel: 'Français 2' }
    ];

    const localised = localise(argument, 'fr');
    localised.should.eql(expected);
  });

  it('omits any Array members without localised prefLabel', () => {
    const argument = [
      { id: '1' },
      { id: '2', prefLabel: { en: 'English 2', fr: 'Français 2' } }
    ];

    const expected = [
      { id: '2', prefLabel: 'Français 2' }
    ];

    const localised = localise(argument, 'fr');
    localised.should.eql(expected);
  });
});
