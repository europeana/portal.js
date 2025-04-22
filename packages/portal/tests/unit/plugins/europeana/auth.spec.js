import nock from 'nock';

import auth from '@/plugins/europeana/auth';

const client = { 'client_id': 'myKey', id: 'api-key-id', type: 'PersonalKey' };

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

  describe('createClient', () => {
    it('creates a client via the auth service', async() => {
      nock(auth.BASE_URL)
        .post('/auth/realms/europeana/client')
        .reply(200, client);

      const response = await (new auth).createClient();

      expect(nock.isDone()).toBe(true);
      expect(response).toEqual(client);
    });
  });

  describe('deleteClient', () => {
    it('deletes the client from the auth service', async() => {
      nock(auth.BASE_URL)
        .delete(`/auth/realms/europeana/client/${client.id}`)
        .reply(204);

      await (new auth).deleteClient(client.id);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('getUserClients', () => {
    it('gets the user clients from the auth service', async() => {
      const clients = [client];
      nock(auth.BASE_URL)
        .get('/auth/realms/europeana/user/clients')
        .reply(200, clients);

      const response = await (new auth).getUserClients();

      expect(nock.isDone()).toBe(true);
      expect(response).toEqual(clients);
    });
  });
});
