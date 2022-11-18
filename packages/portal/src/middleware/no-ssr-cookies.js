export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('Set-Cookie');
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
};
