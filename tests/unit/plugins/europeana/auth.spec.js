import { keycloakResponseErrorHandler } from '../../../../plugins/europeana/auth';

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
    redirect: sinon.spy()
  };

  return merge(defaults, options);
};

describe('plugins/europeana/auth', () => {
  describe('keycloakResponseErrorHandler', () => {
    context('when response status is 401', () => {
      const error = new Error(401);
      error.response = { status: 401 };
      error.config = {
        headers: {}
      };

      context('and the user is logged in with a refresh token', () => {
        const ctx = mockContext({
          $auth: {
            getRefreshToken: () => 'token',
            loggedIn: true
          }
        });

        it('attempts to refresh the access token', async() => {
          await keycloakResponseErrorHandler(ctx, error);

          ctx.$auth.request.should.have.been.called;
        });

        context('when it has refreshed the access token', () => {
          const ctx = mockContext({
            $auth: {
              getRefreshToken: () => 'token',
              loggedIn: true,
              request: sinon.stub().resolves({
                accessToken: 'new'
              })
            },
            $axios: {
              request: sinon.spy()
            }
          });

          it('stores the new access token', async() => {
            await keycloakResponseErrorHandler(ctx, error);

            ctx.$auth.setToken.should.have.been.calledWith('strategy', 'new');
            ctx.$auth.strategy['_setToken'].should.have.been.calledWith('new');
          });

          it('retries the original request', async() => {
            await keycloakResponseErrorHandler(ctx, error);

            ctx.$axios.request.should.have.been.called;
          });
        });

        context('when it could not refresh the access token', () => {
          it('redirects to the login URL', async() => {
            await keycloakResponseErrorHandler(ctx, error);

            ctx.redirect.should.have.been.calledWith('http://example.org/login');
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
          await keycloakResponseErrorHandler(ctx, error);

          ctx.redirect.should.have.been.calledWith('http://example.org/login');
        });
      });
    });

    context('when response status is not 401', () => {
      it('rejects it', () => {
        const error = new Error(500);
        error.response = { status: 500 };
        const response = keycloakResponseErrorHandler({}, error);
        response.should.be.rejected;
      });
    });
  });
});
