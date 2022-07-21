import * as cacher from '@/cachers/collections/organisations.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';

describe('@/cachers/collections/organisations', () => {
  it('fetches data with type: organization', () => {
    sinon.stub(baseCacher, 'default');

    cacher.data();

    expect(baseCacher.default.calledWith({ type: 'organization' }, {})).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug and prefLabel', () => {
    expect(cacher.PICK).toEqual(['slug', 'prefLabel']);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBeUndefined();
  });
});
