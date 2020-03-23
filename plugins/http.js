export const isHttps = ({ req }) => {
  if (process.client) {
    return (window.location.protocol === 'https:');
  }

  if (req.headers['x-forwarded-proto']) return req.headers['x-forwarded-proto'] === 'https';

  if (req.connection.encrypted === true) return true;

  if (req.protocol === 'https') return true;

  return false;
};

export const currentHost = ({ req }) => {
  if (process.server) {
    return req.headers['x-forwarded-host'] || req.headers.host;
  } else if (process.client) {
    return window.location.host;
  }
};

export const currentProtocol = ({ req }) => {
  return isHttps({ req }) ? 'https:' : 'http:';
};
