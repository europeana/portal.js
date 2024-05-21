import { keycloakResponseErrorHandler } from '@/auth/keycloak.js';

import merge from 'deepmerge';
import sinon from 'sinon';

const mockContext = (options = {}) => {
  const defaults = {
    $auth: {
      getRefreshToken: () => null,
      setToken: sinon.spy(),
      strategy: {
        name: 'strategy',
        options: {
          'token_key': 'accessToken'
        },
        _setToken: sinon.spy()
      },
      options: {
        redirect: {
          login: 'http://example.org/login'
        }
      },
      request: sinon.stub().resolves({}),
      loggedIn: false
    },
    redirect: sinon.spy(),
    route: {
      path: '/en'
    }
  };

  return merge(defaults, options);
};

const mockError = (status = 401) => ({
  response: { status },
  config: {
    headers: {
      'Authorization': 'Bearer token'
    }
  }
});

describe('@/auth/keycloak.js', () => {
  describe('keycloakResponseErrorHandler', () => {
    describe('when response status is 401', () => {
      describe('and the user has a refresh token', () => {
        const ctx = mockContext({
          $auth: {
            getRefreshToken: () => 'token'
          }
        });

        it('attempts to refresh the access token', async() => {
          await keycloakResponseErrorHandler(ctx, mockError());

          expect(ctx.$auth.request.calledWith(sinon.match.has('headers', {
            'content-type': 'application/x-www-form-urlencoded'
          }))).toBe(true);
        });

        describe('when it has refreshed the access token', () => {
          const ctx = mockContext({
            $auth: {
              getRefreshToken: () => 'token',
              request: sinon.stub().resolves({
                accessToken: 'new'
              })
            },
            $axios: {
              request: sinon.spy()
            }
          });

          it('stores the new access token', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            expect(ctx.$auth.setToken.calledWith('strategy', 'new')).toBe(true);
            expect(ctx.$auth.strategy['_setToken'].calledWith('new')).toBe(true);
          });

          it('retries the original request', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            expect(ctx.$axios.request.called).toBe(true);
          });
        });

        describe('when the access token refresh request fails', () => {
          const ctx = mockContext({
            $auth: {
              getRefreshToken: () => 'token',
              request: sinon.stub().throws(),
              logout: sinon.spy()
            },
            $axios: {
              request: sinon.spy()
            }
          });

          it('logs out', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            expect(ctx.$auth.logout.called).toBe(true);
          });

          it('retries the original request without authorization', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            expect(ctx.$axios.request.calledWith({ headers: {} })).toBe(true);
          });
        });

        describe('when it could not refresh the access token', () => {
          it('redirects to the login URL', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            expect(ctx.redirect.calledWith('http://example.org/login', { redirect: ctx.route.path })).toBe(true);
          });
        });
      });

      describe('but the user is not logged in with a refresh token', () => {
        const ctx = mockContext({
          $auth: {
            getRefreshToken: () => null,
            loggedIn: false
          }
        });

        it('redirects to the login URL', async() => {
          await keycloakResponseErrorHandler(ctx, mockError());

          expect(ctx.redirect.calledWith('http://example.org/login', { redirect: ctx.route.path })).toBe(true);
        });
      });
    });

    describe('when response status is not 401', () => {
      it('rejects it', async() => {
        const response = keycloakResponseErrorHandler({}, mockError(500));
        await expect(response).rejects.toEqual(mockError(500));
      });
    });
  });
});
