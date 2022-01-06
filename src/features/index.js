import decamelize from 'decamelize';
import featureToggles from './toggles.js';

export const featureIsEnabled = (value) => Boolean(Number(value));

export default () => featureToggles
  .reduce((memo, featureToggle) => {
    const envKey = `ENABLE_${decamelize(featureToggle.name).toUpperCase()}`;
    memo[featureToggle.name] = featureIsEnabled(process.env[envKey]);
    return memo;
  }, {});
