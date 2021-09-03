import { keycloakResponseErrorHandler } from '@/plugins/europeana/auth';

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

describe('plugins/europeana/auth', () => {
  describe('keycloakResponseErrorHandler', () => {
    context('when response status is 401', () => {
      context('and the user has a refresh token', () => {
        const ctx = mockContext({
          $auth: {
            getRefreshToken: () => 'token'
          }
        });

        it('attempts to refresh the access token', async() => {
          await keycloakResponseErrorHandler(ctx, mockError());

          ctx.$auth.request.should.have.been.calledWith(sinon.match.has('headers', {
            'content-type': 'application/x-www-form-urlencoded'
          }));
        });

        context('when it has refreshed the access token', () => {
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

            ctx.$auth.setToken.should.have.been.calledWith('strategy', 'new');
            ctx.$auth.strategy['_setToken'].should.have.been.calledWith('new');
          });

          it('retries the original request', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            ctx.$axios.request.should.have.been.called;
          });
        });

        context('when the access token refresh request fails', () => {
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

            ctx.$auth.logout.should.have.been.called;
          });

          it('retries the original request without authorization', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            ctx.$axios.request.should.have.been.calledWith({ headers: {} });
          });
        });

        context('when it could not refresh the access token', () => {
          it('redirects to the login URL', async() => {
            await keycloakResponseErrorHandler(ctx, mockError());

            ctx.redirect.should.have.been.calledWith('http://example.org/login', { redirect: ctx.route.path });
          });
        });
      });

      context('but the user is not logged in with a refresh token', () => {
        const ctx = mockContext({
          $auth: {
            getRefreshToken: () => null,
            loggedIn: false
          }
        });

        it('redirects to the login URL', async() => {
          await keycloakResponseErrorHandler(ctx, mockError());

          ctx.redirect.should.have.been.calledWith('http://example.org/login', { redirect: ctx.route.path });
        });
      });
    });

    context('when response status is not 401', () => {
      it('rejects it', () => {
        const response = keycloakResponseErrorHandler({}, mockError(500));
        response.should.be.rejected;
      });
    });
  });
});
