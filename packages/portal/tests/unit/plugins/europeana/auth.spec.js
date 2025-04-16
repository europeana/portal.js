import nock from 'nock';

import auth from '@/plugins/europeana/auth';

describe('plugins/europeana/auth', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('getUserClients', () => {
    it('gets the user clients from the auth service', async() => {
      const apiKeys = [{ 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' }];
      nock(auth.BASE_URL)
        .get('/auth/realms/europeana/user/clients')
        .reply(200, apiKeys);

      const response = await (new auth).getUserClients();

      expect(nock.isDone()).toBe(true);
      expect(response).toEqual(apiKeys);
    });
  });
});
