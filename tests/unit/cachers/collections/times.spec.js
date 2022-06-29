import * as cacher from '@/cachers/collections/times.js';
import * as baseCacher from '@/cachers/collections/index.js'
import sinon from 'sinon';

describe('@/cachers/collections/times', () => {
  it('fetches data with config and type: timespan', () => {
    sinon.stub(baseCacher, 'default');

    const config = {};
    cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'timespan' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug and prefLabel', () => {
    expect(cacher.PICK).toEqual(['slug', 'prefLabel']);
  });

  it('localises prefLabel', () => {
    expect(cacher.LOCALISE).toBe('prefLabel');
  });
});
