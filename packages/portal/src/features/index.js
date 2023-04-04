import snakeCase from 'lodash/snakeCase';
import featureToggles from './toggles.js';

export const featureIsEnabled = (value) => Boolean(Number(value));

export const featureNotificationExpiration = (value) => {
  const date = new Date(value);
  return date.toString() === 'Invalid Date' ? null : date;
};

export default () => featureToggles
  .reduce((memo, featureToggle) => {
    const envKey = `ENABLE_${snakeCase(featureToggle.name).toUpperCase()}`;
    memo[featureToggle.name] = featureIsEnabled(process.env[envKey]);
    return memo;
  }, {});
