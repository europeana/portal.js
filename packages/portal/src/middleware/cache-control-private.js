export default ({ res }) => {
  if (process.server && res) {
    res.setHeader('Cache-Control', 'private');
  }
};
