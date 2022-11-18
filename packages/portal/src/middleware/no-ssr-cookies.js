export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('Set-Cookie');
  }
};
