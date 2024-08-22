import axios from 'axios';

export default {
  config: {},

  async userinfo(req) {
    const keycloakUserinfoResponse = await axios({
      baseURL: this.config.origin,
      url: `/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
      method: 'get',
      headers: { authorization: req.headers.authorization }
    });
    return keycloakUserinfoResponse.data;
  }
};
