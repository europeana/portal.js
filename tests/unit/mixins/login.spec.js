import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import mixin from '../../../src/mixins/login';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = (mocks = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks
});

describe('mixins/login', () => {
  describe('computed', () => {
    describe('loginRedirect', () => {
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

        wrapper.vm.loginRedirect.should.eq(mocks.$route.query.redirect);
      });

      it('otherwise uses full path from route', () => {
        const mocks = {
          $route: {
            fullPath: '/de/collections'
          }
        };
        const wrapper = factory(mocks);

        wrapper.vm.loginRedirect.should.eq(mocks.$route.fullPath);
      });
    });
  });

  describe('methods', () => {
    describe('login', () => {
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
      sinon.stub(wrapper.vm, 'loginRedirect').get(() => loginRedirect);

      it('sets universal auth storage for redirect', () => {
        wrapper.vm.login();

        mocks.$auth.$storage.setUniversal.should.have.been.calledWith('redirect', loginRedirect);
      });

      it('sets universal auth storage for logging in flag', () => {
        wrapper.vm.login();

        mocks.$auth.$storage.setUniversal.should.have.been.calledWith('portalLoggingIn', true);
      });

      it('calls auth login with keycloak scheme and ui_locales param', () => {
        wrapper.vm.login();

        mocks.$auth.loginWith.should.have.been.calledWith('keycloak', { params: { 'ui_locales': mocks.$i18n.locale } });
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
  //   next.should.have.been.called;
  //   authStorageSetUniversal.should.have.been.calledWith('redirect', from.fullPath);
  // });
});
