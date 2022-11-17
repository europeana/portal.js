export default ({ res }) => {
  if (process.server && res) {
    console.log('no-ssr-cookies', res.getHeaders())
    res.removeHeader('set-cookie')
    console.log('no-ssr-cookies', res.getHeaders())
  }
};
