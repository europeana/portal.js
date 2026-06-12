import axios from 'axios';

export class HTTPService {
  static BASE_URL;
  #axiosInstance;
  #baseURL;

  constructor({ baseURL = this.prototype.BASE_URL }) {
    this.baseURL = baseURL;
    this.request.withAuth = this.requestWithAuth;
  }

  get axiosInstance() {
    if (!this.#axiosInstance) {
      this.#axiosInstance = axios.create({
        baseURL: this.baseURL
      });
    }

    return this.#axiosInstance;
  }

  request(config = {}) {
    return this.axiosInstance.request(config);
  }
}

export class EuropeanaAuthService extends HTTPService {
  static BASE_URL = 'https://auth.europeana.eu/auth/realms/europeana/protocol/openid-connect';
  // constructor({ baseURL = EuropeanaAuthService.BASE_URL }) {
  //   super({ baseURL });
  // }

  createToken(config = {}) {
    return this.request({
      ...config,
      url: '/token',
      method: 'post',
      data: new URLSearchParams(config.data),
      headers: {
        ...config.headers,
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
  }

  getUserinfo(config = {}) {
    return this.request({
      ...config,
      url: '/userinfo',
      method: 'get'
    });
  }
}
