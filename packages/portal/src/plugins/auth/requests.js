// @see https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
export const createTokenRequestConfig = ({ code, clientId, redirectUri }) => ({
  url: '/token',
  method: 'post',
  data: new URLSearchParams({
    'client_id': clientId,
    code,
    'grant_type': 'authorization_code',
    'redirect_uri': redirectUri,
    'response_type': 'code'
  }),
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
export const createUserInfoRequestConfig = ({ clientId }) => ({
  url: '/userinfo',
  method: 'get',
  params: {
    'client_id': clientId
  }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken
export const createRefreshRequestConfig = ({ clientId, refreshToken, scope }) => ({
  url: '/token',
  method: 'post',
  data: new URLSearchParams({
    'client_id': clientId,
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken,
    scope
  }),
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
});
