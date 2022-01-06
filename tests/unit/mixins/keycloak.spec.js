import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import mixin from '@/mixins/keycloak';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = (mocks = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks
});

describe('mixins/keycloak', () => {
  describe('computed', () => {
    describe('keycloakLoginRedirect', () => {
      it('favours redirect from route query', () => {
        const mocks = {
          $route: {
            fullPath: '/de/login',
            query: {
              redirect: '/de/about'
            }
          }
        };
        const wrapper = factory(mocks);

        expect(wrapper.vm.keycloakLoginRedirect).toBe(mocks.$route.query.redirect);
      });

      it('otherwise uses full path from route', () => {
        const mocks = {
          $route: {
            fullPath: '/de/collections'
          }
        };
        const wrapper = factory(mocks);

        expect(wrapper.vm.keycloakLoginRedirect).toBe(mocks.$route.fullPath);
      });
    });

    describe('keycloakAccountUrl', () => {
      it('includes referrer and referrer_uri', () => {
        const mocks = {
          $auth: { strategy: { options: {
            origin: 'https://auth.example.org', realm: 'europeana', 'client_id': 'portal.js'
          } } },
          $config: { app: { baseUrl: 'https://www.example.eu' } }
        };
        const wrapper = factory(mocks);

        const keycloakAccountUrl = wrapper.vm.keycloakAccountUrl;

        expect(keycloakAccountUrl).toBe(
          'https://auth.example.org/auth/realms/europeana/account?referrer=portal.js&referrer_uri=https%3A%2F%2Fwww.example.eu'
        );
      });
    });
  });

  describe('methods', () => {
    describe('keycloakLogin', () => {
      const mocks = {
        $auth: {
          loginWith: sinon.spy(),
          $storage: {
            setUniversal: sinon.spy()
          }
        },
        $i18n: {
          locale: 'de'
        }
      };
      const loginRedirect = '/de';

      const wrapper = factory(mocks);
      sinon.stub(wrapper.vm, 'keycloakLoginRedirect').get(() => loginRedirect);

      it('sets universal auth storage for redirect', () => {
        wrapper.vm.keycloakLogin();

        expect(mocks.$auth.$storage.setUniversal.calledWith('redirect', loginRedirect)).toBe(true);
      });

      it('sets universal auth storage for logging in flag', () => {
        wrapper.vm.keycloakLogin();

        expect(mocks.$auth.$storage.setUniversal.calledWith('portalLoggingIn', true)).toBe(true);
      });

      it('calls auth login with keycloak scheme and ui_locales param', () => {
        wrapper.vm.keycloakLogin();

        expect(mocks.$auth.loginWith.calledWith('keycloak', { params: { 'ui_locales': mocks.$i18n.locale } })).toBe(true);
      });
    });
  });

  // it('stores the previous page full path for auth redirection', () => {
  //   const authStorageSetUniversal = sinon.spy();
  //   const wrapper = shallowMountNuxt(page, {
  //     mocks: {
  //       $auth: {
  //         loginWith: sinon.spy(),
  //         $storage: {
  //           setUniversal: authStorageSetUniversal
  //         }
  //       },
  //       $i18n: {
  //         locale: 'en'
  //       }
  //     }
  //   });
  //
  //   const from = { fullPath: '/eu/item/123/def' };
  //   const next = sinon.stub().yields(wrapper.vm);
  //   page.beforeRouteEnter.call(wrapper.vm, null, from, next);
  //
  //   expect(next).have.been.called;
  //   expect(authStorageSetUniversal).have.been.calledWith('redirect', from.fullPath);
  // });
});
