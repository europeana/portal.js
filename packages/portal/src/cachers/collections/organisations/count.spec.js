import * as cacher from '@/cachers/collections/organisations/count.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';

describe('@/cachers/collections/organisations/count', () => {
  it('counts entities with type: organization', () => {
    sinon.stub(baseCacher, 'countEntities');

    cacher.data();

    expect(baseCacher.countEntities.calledWith({ type: 'organization' }, {})).toBe(true);
    sinon.resetHistory();
  });

  it('picks nothing', () => {
    expect(cacher.PICK).toBe(false);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBe(false);
  });
});
