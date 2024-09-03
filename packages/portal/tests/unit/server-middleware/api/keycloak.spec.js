import nock from 'nock';

import keycloak from '@/server-middleware/api/keycloak.js';

const auth = { authorization: 'Basic Auth' };
const config = {
  origin: 'http://example.org',
  realm: 'realm'
};

describe('server-middleware/api/keycloak', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  describe('userId', () => {
    it('extracts the ID from the user info', async() => {
      keycloak.config = config;
      nock(config.origin)
        .get(`/auth/realms/${config.realm}/protocol/openid-connect/userinfo`)
        .reply(200, { sub: 'user ID' });

      const id = await keycloak.userId(auth);
      expect(nock.isDone()).toBe(true);
      expect(id).toEqual('user ID');
    });
  });
});