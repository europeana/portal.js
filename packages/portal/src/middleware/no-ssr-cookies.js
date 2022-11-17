export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('set-cookie');
    const vary = res.getHeader('vary');
    if (vary) {
      res.setHeader('vary', `${vary}, cookie`);
    } else {
      res.setHeader('vary', 'cookie');
    }
  }
};
