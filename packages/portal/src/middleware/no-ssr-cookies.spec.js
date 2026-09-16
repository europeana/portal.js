import sinon from 'sinon';

import middleware from './no-ssr-cookies.js';

describe('no-ssr-cookies middleware', () => {
  afterEach(sinon.resetHistory);

  it('removes Set-Cookie header from response', () => {
    const ctx = { res: { removeHeader: sinon.spy() } };

    middleware(ctx);

    expect(ctx.res.removeHeader.calledWith('Set-Cookie')).toBe(true);
  });
});
