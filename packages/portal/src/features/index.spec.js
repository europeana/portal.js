import snakeCase from 'lodash/snakeCase';
import featureToggles from '@/features/toggles.js';
import features from '@/features/index.js';

describe('features/index', () => {
  describe('default', () => {
    it('returns an object with a false value for the feature toggles that are not enabled', () => {
      const feature = featureToggles[0].name;

      const featuresObject = features();
      expect(featuresObject[feature]).toBe(false);
    });

    it('returns an object with a true value for the feature toggles that are enabled', () => {
      const enabledFeature = featureToggles[0].name;
      process.env[`ENABLE_${snakeCase(enabledFeature).toUpperCase()}`] = 1;

      const featuresObject = features();
      expect(featuresObject[enabledFeature]).toBe(true);
    });
  });
});
