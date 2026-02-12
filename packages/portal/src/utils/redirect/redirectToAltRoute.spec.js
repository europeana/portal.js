import sinon from 'sinon';

import { redirectToAltRoute } from './redirectToAltRoute.js';

const name = 'item-all';
const route = { name, params: { pathMatch: '123/abc' }, query: { lang: 'es' } };
const changes = { params: { pathMatch: '123/def' } };
const redirect = sinon.spy();

describe('utils/redirect/redirectToAltRoute.js', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  it('replaces the current route with supplied changes and redirects', async() => {
    redirectToAltRoute(changes, { redirect, route });

    expect(redirect.calledWith(302, {
      hash: '',
      name,
      params: changes.params,
      query: route.query,
      replace: true
    })).toBe(true);
  });
});
