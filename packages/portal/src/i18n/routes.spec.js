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

  // describe('when route path is for gallery skipped for migration', () => {
  //   const route = { path: '/en/galleries/postcards' };

  //   it('issues a 410 error', () => {
  //     middleware({ route, redirect, error });

  //     expect(error.calledWith(sinon.match.has('status', 410))).toEqual(true);
  //   });
  // });

  // describe('when route path is not for known gallery', () => {
  //   const route = { path: '/en/galleries/i-dont-think-so' };

  //   it('does not redirect', () => {
  //     middleware({ route, redirect, error });

  //     expect(redirect.called).toEqual(false);
  //   });
  // });
});
