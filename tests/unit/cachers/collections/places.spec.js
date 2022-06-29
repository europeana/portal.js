import * as cacher from '@/cachers/collections/places.js';
import * as baseCacher from '@/cachers/collections/index.js'
import sinon from 'sinon';

describe('@/cachers/collections/places', () => {
  it('fetches data with config and type: place', () => {
    sinon.stub(baseCacher, 'default');

    const config = {};
    cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'place' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug and prefLabel', () => {
    expect(cacher.PICK).toEqual(['slug', 'prefLabel']);
  });

  it('localises prefLabel', () => {
    expect(cacher.LOCALISE).toBe('prefLabel');
  });
});
