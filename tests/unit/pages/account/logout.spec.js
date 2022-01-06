import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import page from '@/pages/account/logout';

describe('pages/account/logout.vue', () => {
  describe('beforeRouteEnter', () => {
    const authStorageSetUniversal = sinon.spy();
    const factory = () => shallowMountNuxt(page, {
      mocks: {
        $auth: {
          loginWith: sinon.spy(),
          logout: sinon.spy(),
          $storage: {
            getUniversal: sinon.spy(),
            setUniversal: authStorageSetUniversal
          },
          strategies: {
            keycloak: {
              options: {
                'end_session_endpoint': 'https://auth.example.org/logout'
              }
            }
          }
        },
        $i18n: { locale: 'eu' },
        $goto: sinon.spy()
      }
    });

    describe('previous page does not require auth', () => {
      const from = { name: 'item___eu', fullPath: '/eu/item/123/def' };

      it('stores the previous page full path for auth redirection', () => {
        const wrapper = factory();

        const next = sinon.stub().yields(wrapper.vm);
        page.beforeRouteEnter.call(wrapper.vm, null, from, next);

        expect(next.called).toBe(true);
        expect(authStorageSetUniversal.calledWith('redirect', from.fullPath)).toBe(true);
      });
    });

    describe('previous page requires auth', () => {
      const from = { name: 'account___eu', fullPath: '/eu/account' };

      it('stores the homepage path for auth redirection', () => {
        const wrapper = factory();

        const next = sinon.stub().yields(wrapper.vm);
        page.beforeRouteEnter.call(wrapper.vm, null, from, next);

        expect(next.called).toBe(true);
        expect(authStorageSetUniversal.calledWith('redirect', '/eu')).toBe(true);
      });
    });
  });

  describe('mounted', () => {
    it('redirects to the keycloak end session endpoint', () => {
      const wrapper = shallowMountNuxt(page, {
        mocks: {
          $auth: {
            loginWith: sinon.spy(),
            logout: sinon.spy(),
            $storage: {
              getUniversal: sinon.stub().withArgs('redirect').returns('/about-us'),
              setUniversal: sinon.spy()
            },
            strategies: {
              keycloak: {
                options: {
                  'end_session_endpoint': 'https://auth.example.org/logout'
                }
              }
            }
          },
          $goto: sinon.spy(),
          $i18n: {
            locale: 'en'
          }
        }
      });

      expect(wrapper.vm.$goto.calledWith('https://auth.example.org/logout?redirect_uri=http%3A%2F%2Flocalhost%2Fabout-us')).toBe(true);
    });
  });
});
