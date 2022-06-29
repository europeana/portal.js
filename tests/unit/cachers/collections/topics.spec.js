import * as cacher from '@/cachers/collections/topics.js';
import * as baseCacher from '@/cachers/collections/index.js'
import sinon from 'sinon';

describe('@/cachers/collections/topics', () => {
  it('fetches data with config and type: topic', () => {
    sinon.stub(baseCacher, 'default');

    const config = {};
    cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'concept' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug and prefLabel', () => {
    expect(cacher.PICK).toEqual(['slug', 'prefLabel']);
  });

  it('localises prefLabel', () => {
    expect(cacher.LOCALISE).toBe('prefLabel');
  });
});
