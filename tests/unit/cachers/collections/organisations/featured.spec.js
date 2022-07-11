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

  it('localises prefLabel', () => {
    expect(cacher.LOCALISE).toBe('prefLabel');
  });

  it('features 4 daily', () => {
    expect(cacher.DAILY).toBe(4);
  });
});
