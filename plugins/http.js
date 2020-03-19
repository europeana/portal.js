export const isHttps = ({ req }) => {
  if (process.server) {
    return require('is-https')(req, true);
  } else if (process.client) {
    return (window.location.protocol === 'https:');
  }
};

export const currentHost = ({ req }) => {
  if (process.server) {
    return req.headers['X-Forwarded-Host'] || req.headers['x-forwarded-host'] || req.headers.host;
  } else if (process.client) {
    return window.location.host;
  }
};

export const currentProtocol = ({ req }) => {
  return isHttps({ req }) ? 'https:' : 'http:';
};
