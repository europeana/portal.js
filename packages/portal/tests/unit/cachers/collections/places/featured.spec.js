import * as cacher from '@/cachers/collections/places/featured.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';

describe('@/cachers/collections/places/featured', () => {
  it('fetches data with type: place', () => {
    sinon.stub(baseCacher, 'default');

    cacher.data();

    expect(baseCacher.default.calledWith({ type: 'place' }, {})).toBe(true);
    sinon.resetHistory();
  });

  it('picks id, prefLabel and isShownBy', () => {
    expect(cacher.PICK).toEqual(['id', 'prefLabel', 'isShownBy']);
  });

  it('localises prefLabel', () => {
    expect(cacher.LOCALISE).toBe('prefLabel');
  });

  it('sorts on prefLabel', () => {
    expect(cacher.SORT).toBe('prefLabel');
  });

  it('features 4 daily', () => {
    expect(cacher.DAILY).toBe(4);
  });
});
