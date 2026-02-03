import * as i18nRoutes from './routes.js';

describe('i18n/routes', () => {
  describe('extractLocaleFromRoutePath', () => {
    describe('when route path is for home page', () => {
      describe('and does not include locale', () => {
        const routePath = '/';

        it('returns just the path', () => {
          expect(i18nRoutes.extractLocaleFromRoutePath(routePath)).toEqual({ path: '/' });
        });
      });

      describe('and includes locale', () => {
        const routePath = '/nl';

        it('returns path and locale', () => {
          expect(i18nRoutes.extractLocaleFromRoutePath(routePath)).toEqual({ locale: 'nl', path: '/' });
        });
      });
    });

    describe('when route path is not for home page', () => {
      describe('and does not include locale', () => {
        const routePath = '/news/routing';

        it('returns just the path', () => {
          expect(i18nRoutes.extractLocaleFromRoutePath(routePath)).toEqual({ path: '/news/routing' });
        });
      });

      describe('and includes locale', () => {
        const routePath = '/nl/news/routing';

        it('returns path and locale', () => {
          expect(i18nRoutes.extractLocaleFromRoutePath(routePath)).toEqual({ locale: 'nl', path: '/news/routing' });
        });
      });
    });
  });
});
