import sinon from 'sinon';

import plugin from './cookieless-redirect.server.js';

const factory = () => ({ res: { removeHeader: sinon.spy() }, redirect: sinon.spy() });

describe('plugins/cookieless-redirect.server.js', () => {
  it('replaces redirect in the context to remove Set-Cookie header from the response', () => {
    const ctx = factory();
    plugin(ctx);

    ctx.redirect('/es');

    expect(ctx.res.removeHeader.calledWith('Set-Cookie')).toBe(true);
  });

  it('delegates to original Nuxt redirect', () => {
    const ctx = factory();
    const redirect = ctx.redirect;
    plugin(ctx);

    ctx.redirect('/es');

    expect(redirect.calledWith('/es')).toBe(true);
  });
});
