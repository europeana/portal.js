export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('set-cookie');
  }
};
