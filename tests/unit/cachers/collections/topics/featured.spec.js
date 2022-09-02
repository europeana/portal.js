import * as cacher from '@/cachers/collections/topics/featured.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';

describe('@/cachers/collections/topics/featured', () => {
  it('fetches data with type: topic and hard-coded id filter', () => {
    sinon.stub(baseCacher, 'default');

    cacher.data();

    expect(baseCacher.default.calledWith(
      sinon.match.has('type', 'concept').and(sinon.match.has('qf', sinon.match(/^id:/))), {}
    )).toBe(true);
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
