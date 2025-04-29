import { isoCodes } from '@europeana/i18n';

const defaults = {
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
