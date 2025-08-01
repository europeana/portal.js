import merge from 'deepmerge';
import sinon from 'sinon';

import { keycloakPlugin } from '@/plugins/keycloak.js';

describe('plugins/keycloak.js', () => {
  describe('keycloakPlugin', () => {
    describe('redirectPath', () => {
      describe('when there is no route', () => {
        const ctx = {};
        it('would redirect to /account', () => {
          expect(keycloakPlugin(ctx).redirectPath()).toBe('/account');
        });
      });

      describe('when the route has a redirect in its query', () => {
        const ctx = {
          route: {
            fullPath: '/de/login',
            query: {
              redirect: '/de/about'
            }
          }
        };
        it('would redirect to the query redirect', () => {
          expect(keycloakPlugin(ctx).redirectPath()).toBe(ctx.route.query.redirect);
        });
      });

      describe('else, when the route path is for /account/login', () => {
        describe('and there is a hash in the route', () => {
          const ctx = {
            route: {
              path: '/en/account/login',
              hash: '#likes'
            }
          };

          it('would redirect to /account, preserving the hash', () => {
            expect(keycloakPlugin(ctx).redirectPath()).toBe('/account#likes');
          });
        });

        describe('but there is no hash in the route', () => {
          const ctx = {
            route: {
              path: '/en/account/login'
            }
          };

          it('would redirect to /account', () => {
            expect(keycloakPlugin(ctx).redirectPath()).toBe('/account');
          });
        });

        describe('otherwise if there is a full path for the route', () => {
          const ctx = {
            route: {
              fullPath: '/de/collections'
            }
          };

          it('would redirect to the route full path', () => {
            expect(keycloakPlugin(ctx).redirectPath()).toBe(ctx.route.fullPath);
          });
        });
      });
    });

    describe('login', () => {
      const ctx = {
        $auth: {
          loginWith: sinon.spy(),
          $storage: {
            setUniversal: sinon.spy()
          }
        },
        i18n: {
          locale: 'de'
        }
      };

      it('sets universal auth storage for redirect', () => {
        keycloakPlugin(ctx).login();

        expect(ctx.$auth.$storage.setUniversal.calledWith('redirect', '/account')).toBe(true);
      });

      it('sets universal auth storage for logging in flag', () => {
        keycloakPlugin(ctx).login();

        expect(ctx.$auth.$storage.setUniversal.calledWith('portalLoggingIn', true)).toBe(true);
      });

      it('calls auth login with keycloak scheme and ui_locales param', () => {
        keycloakPlugin(ctx).login();

        expect(ctx.$auth.loginWith.calledWith('keycloak', { params: { 'ui_locales': ctx.i18n.locale } })).toBe(true);
      });
    });

    describe('accountUrl', () => {
      it('includes referrer and referrer_uri', () => {
        const ctx = {
          $auth: { strategy: { options: {
            origin: 'https://auth.example.org', realm: 'europeana', 'client_id': 'portal.js'
          } } },
          $config: { app: { baseUrl: 'https://www.example.eu' } }
        };

        expect(keycloakPlugin(ctx).accountUrl()).toBe(
          'https://auth.example.org/auth/realms/europeana/account?referrer=portal.js&referrer_uri=https%3A%2F%2Fwww.example.eu'
        );
      });
    });

    describe('error', () => {
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

      describe('when response status is 401', () => {
        describe('and the user has a refresh token', () => {
          const ctx = mockContext({
            $auth: {
              getRefreshToken: () => 'token'
            }
          });

          it('attempts to refresh the access token', async() => {
            await keycloakPlugin(ctx).error(mockError());

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
              await keycloakPlugin(ctx).error(mockError());

              expect(ctx.$auth.setToken.calledWith('strategy', 'new')).toBe(true);
              expect(ctx.$auth.strategy['_setToken'].calledWith('new')).toBe(true);
            });

            it('retries the original request', async() => {
              await keycloakPlugin(ctx).error(mockError());

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
              await keycloakPlugin(ctx).error(mockError());

              expect(ctx.$auth.logout.called).toBe(true);
            });

            it('retries the original request without authorization', async() => {
              await keycloakPlugin(ctx).error(mockError());

              expect(ctx.$axios.request.calledWith({ headers: {} })).toBe(true);
            });
          });

          describe('when it could not refresh the access token', () => {
            it('redirects to the login URL', async() => {
              await keycloakPlugin(ctx).error(mockError());

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
            await keycloakPlugin(ctx).error(mockError());

            expect(ctx.redirect.calledWith('http://example.org/login', { redirect: ctx.route.path })).toBe(true);
          });
        });
      });

      describe('when response status is not 401', () => {
        it('rejects it', async() => {
          const response = keycloakPlugin({}).error(mockError(500));
          await expect(response).rejects.toEqual(mockError(500));
        });
      });
    });
  });
});
