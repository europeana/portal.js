import { codes } from '@europeana/i18n';

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
