import sinon from 'sinon';

import initContentfulPlugin from '@/plugins/contentful/index.js';

describe('@/plugins/contentful/index.js', () => {
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    sinon.restore();
  });

  it('injects "contentful" plugin', () => {
    const inject = sinon.spy();

    initContentfulPlugin({}, inject);

    expect(inject.calledWith('contentful', sinon.match.hasOwn('assets').and(sinon.match.hasOwn('query')))).toBe(true);
  });
});
