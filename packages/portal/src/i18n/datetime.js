import codes from './codes.js';

const defaults = {
  short: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

export default codes.reduce((memo, code) => {
  memo[code] = defaults;
  return memo;
}, {});
