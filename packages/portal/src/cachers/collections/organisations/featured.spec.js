import * as cacher from '@/cachers/collections/organisations/featured.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';

describe('@/cachers/collections/organisations/featured', () => {
  it('fetches data with type: organization', () => {
    sinon.stub(baseCacher, 'default');

    cacher.data();

    expect(baseCacher.default.calledWith({ type: 'organization' }, {})).toBe(true);
    sinon.resetHistory();
  });

  it('picks id, prefLabel and logo', () => {
    expect(cacher.PICK).toEqual(['id', 'prefLabel', 'logo']);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBeUndefined();
  });

  it('features 4 daily', () => {
    expect(cacher.DAILY).toBe(4);
  });

  it('internationalises by native prefLabel', () => {
    const data = [
      { type: 'Organization', prefLabel: { en: 'Museum', es: 'Museo' } },
      { type: 'Organization', prefLabel: { en: 'Gallery' } }
    ];
    const expected = [
      { type: 'Organization', prefLabel: { es: 'Museo' } },
      { type: 'Organization', prefLabel: { en: 'Gallery' } }
    ];

    expect(cacher.INTERNATIONALISE(data)).toEqual(expected);
  });

  it('sorts by the first (pre-internationalised) prefLabel value', () => {
    const organisation = { prefLabel: ['Museo'] };

    expect(cacher.SORT(organisation)).toEqual('Museo');
  });
});
