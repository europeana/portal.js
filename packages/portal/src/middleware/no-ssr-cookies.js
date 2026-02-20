export default ({ res }) => {
  res?.removeHeader('Set-Cookie');
};
