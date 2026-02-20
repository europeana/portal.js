export default ({ res }) => {
  res?.removeHeader('Cache-Control');
  res?.setHeader('Cache-Control', 'no-store');
};
