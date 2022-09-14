import decamelize from 'decamelize';
import featureToggles from '@/features/toggles.js';
import features, { featureNotificationExpiration } from '@/features/index.js';

describe('features/index', () => {
  describe('default', () => {
    it('returns an object with a false value for the feature toggles that are not enabled', () => {
      const feature = featureToggles[0].name;

      const featuresObject = features();
      expect(featuresObject[feature]).toBe(false);
    });

    it('returns an object with a true value for the feature toggles that are enabled', () => {
      const enabledFeature = featureToggles[0].name;
      process.env[`ENABLE_${decamelize(enabledFeature).toUpperCase()}`] = 1;

      const featuresObject = features();
      expect(featuresObject[enabledFeature]).toBe(true);
    });
  });

  describe('featureNotificationExpiration', () => {
    it('returns a Date if parseable', () => {
      const expiration = featureNotificationExpiration('2022-01-01');

      expect(expiration instanceof Date).toBe(true);
      expect(expiration.toString()).toContain('Jan 01 2022');
    });

    it('returns `null` if not parseable', () => {
      const expiration = featureNotificationExpiration('typo');

      expect(expiration).toBe(null);
    });
  });
});
