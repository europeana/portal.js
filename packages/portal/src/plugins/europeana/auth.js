import EuropeanaApi from './apis/base.js';

export default class EuropeanaAuthApi extends EuropeanaApi {
  static ID = 'auth';
  static BASE_URL = 'https://auth.europeana.eu';
  // static AUTHENTICATING = true;
  static AUTHORISING = true;

  deleteClient(id) {
    return this.request({
      method: 'delete',
      url: `/auth/realms/europeana/client/${id}`
    });
  }

  getUserClients() {
    return this.request({
      method: 'get',
      url: '/auth/realms/europeana/user/clients'
    });
  }
}
