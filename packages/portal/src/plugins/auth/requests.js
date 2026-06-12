// @see https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
export const createUserInfoRequestConfig = ({ clientId }) => ({
  url: '/userinfo',
  method: 'get',
  params: {
    'client_id': clientId
  }
});

