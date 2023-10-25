import snakeCase from 'lodash/snakeCase.js';
import featureToggles from './toggles.js';

export const featureIsEnabled = (name) => {
  const envKey = `ENABLE_${snakeCase(name).toUpperCase()}`;
  return valueIsTruthy(process.env[envKey]);
};

export const featureNotificationExpiration = (value) => {
  const date = new Date(value);
  return date.toString() === 'Invalid Date' ? null : date;
};

export const valueIsTruthy = (value) => Boolean(Number(value));

export default () => featureToggles
  .reduce((memo, featureToggle) => {
    memo[featureToggle.name] = featureIsEnabled(featureToggle.name);
    return memo;
  }, {});
