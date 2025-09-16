import EuropeanaApi from './apis/base.js';

export default class EuropeanaAuthApi extends EuropeanaApi {
  static ID = 'auth';
  static BASE_URL = 'https://auth.europeana.eu/auth/realms/europeana';
  // static AUTHENTICATING = true;
  static AUTHORISING = true;
  static ERROR_CODES = {
    '400_key_limit_reached': 'authKeyLimitReached',
    '400_duplicate_key': 'authDuplicateKey',
    '410_client_disabled': 'authClientDisabled'
  };

  createClient() {
    return this.request({
      method: 'post',
      url: '/client'
    });
  }

  deleteClient(id) {
    return this.request({
      method: 'delete',
      url: `/client/${id}`
    });
  }

  getUserClients() {
    return this.request({
      method: 'get',
      url: '/user/clients'
    });
  }

  createOpenidConnectToken(data) {
    return this.request({
      data,
      method: 'post',
      url: '/protocol/openid-connect/token'
    });
  }
}
