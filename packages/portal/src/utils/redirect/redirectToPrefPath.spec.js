import sinon from 'sinon';

import { redirectToPrefPath } from './redirectToPrefPath.js';

const name = 'collections-type-all';
const id = '123';
const label = 'label';
const pathMatch = '123-label';
const redirect = sinon.spy();

describe('redirectToPrefPath', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('when the slug already uses the label', () => {
    const route = { name, params: { pathMatch } };

    it('does not redirect', () => {
      redirectToPrefPath(id, label, { redirect, route });

      expect(redirect.called).toBe(false);
    });
  });

  describe('when the URL slug does not use the label', () => {
    const route = { name, params: { pathMatch: '123-not-the-label' } };

    it('redirects', async() => {
      redirectToPrefPath(id, label, { redirect, route });

      expect(redirect.calledWith(302, {
        hash: '',
        name,
        params: { pathMatch },
        query: {},
        replace: true
      })).toBe(true);
    });
  });
});

