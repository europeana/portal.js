export default ({ res }) => {
  res?.removeHeader('Cache-Control');
};
