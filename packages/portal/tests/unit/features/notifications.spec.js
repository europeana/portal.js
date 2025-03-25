import features, {
  activeFeatureNotification,
  featureNotificationExpiration
} from '@/features/notifications.js';

describe('features/notifications', () => {
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

  describe('activeFeatureNotification', () => {
    describe('when feature notification is not configured', () => {
      it('is null', () => {
        const $config = { app: { featureNotification: { name: undefined } } };

        expect(activeFeatureNotification({ $config })).toBeNull();
      });
    });

    describe('when feature notification is configured', () => {
      describe('but feature is not known', () => {
        it('is null', () => {
          const $config = { app: { featureNotification: { name: 'unknown' } } };

          expect(activeFeatureNotification({ $config })).toBeNull();
        });
      });

      describe('and feature is known', () => {
        const feature = features[0];
        const name = feature.name;

        it('returns feature', () => {
          const $config = { app: { featureNotification: { name } } };

          expect(activeFeatureNotification({ $config })).toEqual(feature);
        });

        describe('and expiration is configured', () => {
          describe('and expiration has passed', () => {
            const expiration = new Date('2011-11-20');

            it('is null', () => {
              const $config = { app: { featureNotification: { expiration, name } } };

              expect(activeFeatureNotification({ $config })).toBeNull();
            });
          });

          describe('and expiration has not passed', () => {
            const expiration = new Date('3011-11-20');

            it('returns feature', () => {
              const $config = { app: { featureNotification: { expiration, name } } };

              expect(activeFeatureNotification({ $config })).toEqual(feature);
            });
          });
        });

        describe('and locales are configured', () => {
          const locales = ['en', 'nl'];

          describe('and UI locale is not included', () => {
            const uiLocale = 'de';

            it('is null', () => {
              const $config = { app: { featureNotification: { locales, name } } };
              const i18n = { locale: uiLocale };

              expect(activeFeatureNotification({ $config, i18n })).toBeNull();
            });
          });

          describe('and UI locale is included', () => {
            const uiLocale = 'nl';

            it('returns feature', () => {
              const $config = { app: { featureNotification: { locales, name } } };
              const i18n = { locale: uiLocale };

              expect(activeFeatureNotification({ $config, i18n })).toEqual(feature);
            });
          });
        });
      });
    });
  });
});
