import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import page from '@/pages/account/logout';

const factory = () => shallowMountNuxt(page, {
  mocks: {
    $auth: {
      logout: sinon.spy(),
      $storage: {
        getUniversal: sinon.stub().withArgs('redirect').returns('/about-us'),
        setUniversal: sinon.spy()
      }
    },
    $i18n: { locale: 'eu' },
    $router: {
      push: sinon.stub()
    }
  }
});

describe('pages/account/logout.vue', () => {
  afterEach(sinon.resetHistory);

  describe('beforeRouteEnter', () => {
    describe('previous page does not require auth', () => {
      const from = { name: 'item___eu', fullPath: '/eu/item/123/def' };

      it('stores the previous page full path for auth redirection', () => {
        const wrapper = factory();

        const next = sinon.stub().yields(wrapper.vm);
        wrapper.vm.beforeRouteEnter(null, from, next);

        expect(next.called).toBe(true);
        expect(wrapper.vm.$auth.$storage.setUniversal.calledWith('redirect', from.fullPath)).toBe(true);
      });
    });

    describe('previous page requires auth', () => {
      const from = { name: 'account___eu', fullPath: '/eu/account' };

      it('stores the homepage path for auth redirection', () => {
        const wrapper = factory();

        const next = sinon.stub().yields(wrapper.vm);
        wrapper.vm.beforeRouteEnter(null, from, next);

        expect(next.called).toBe(true);
        expect(wrapper.vm.$auth.$storage.setUniversal.calledWith('redirect', '/eu')).toBe(true);
      });
    });
  });

  describe('mounted', () => {
    it('redirects to the previous page', () => {
      const wrapper = factory();

      expect(wrapper.vm.$router.push.calledWith('/about-us')).toBe(true);
    });
  });
});
