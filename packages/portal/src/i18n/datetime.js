import { isoCodes } from '@europeana/i18n';

const defaults = {
  numeric: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  },
  short: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

export default isoCodes.reduce((memo, code) => {
  memo[code] = defaults;
  return memo;
}, {});
