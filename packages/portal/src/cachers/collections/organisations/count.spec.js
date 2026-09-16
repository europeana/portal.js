import * as cacher from '@/cachers/collections/organisations/count.js';
import sinon from 'sinon';

describe('@/cachers/collections/organisations/count', () => {
  afterEach(sinon.resetHistory);
  it('counts entities with type: organization', () => {
    const context = { $apis: { entity: { search: sinon.stub().resolves({}) } } };

    cacher.data(context);

    expect(context.$apis.entity.search.calledWith({
      query: '*:*',
      scope: 'europeana',
      pageSize: 0,
      type: 'organization'
    })).toBe(true);
  });

  it('picks nothing', () => {
    expect(cacher.PICK).toBe(false);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBe(false);
  });
});
