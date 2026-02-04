export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('Cache-Control');
    res.setHeader('Cache-Control', 'private');
  }
};
