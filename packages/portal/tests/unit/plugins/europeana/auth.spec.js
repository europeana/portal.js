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

  describe('deleteClient', () => {
    it('deletes the client from the auth service', async() => {
      const id = 'api-key-id';
      nock(auth.BASE_URL)
        .delete(`/auth/realms/europeana/client/${id}`)
        .reply(204);

      await (new auth).deleteClient(id);

      expect(nock.isDone()).toBe(true);
    });
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
