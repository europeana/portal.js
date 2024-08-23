import axios from 'axios';

export default {
  config: {},

  async userInfo(authorization) {
    const keycloakUserinfoResponse = await axios({
      baseURL: this.config.origin,
      url: `/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
      method: 'get',
      headers: { authorization }
    });
    return keycloakUserinfoResponse.data;
  },

  async userId(authorization) {
    let id = null;
    if (authorization) {
      const userInfo = await this.userInfo(authorization);
      id = userInfo?.sub || null;
    }
    return id;
  }
};
