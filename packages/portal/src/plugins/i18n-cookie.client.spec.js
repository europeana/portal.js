import sinon from 'sinon';

import plugin from './i18n-cookie.client.js';

describe('i18n-cookie client plugin', () => {
  it('sets i18n_locale_code cookie from i18n locale', () => {
    const locale = 'es';
    const app = { $cookies: { set: sinon.spy() }, i18n: { locale } };

    plugin({ app });

    expect(app.$cookies.set.calledWith('i18n_locale_code', locale)).toBe(true);
  });
});
