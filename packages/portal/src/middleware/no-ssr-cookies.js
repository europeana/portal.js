export default ({ res, store, $auth }) => {
  if (process.server && res) {
    res.removeHeader('Set-Cookie');
  }
};
