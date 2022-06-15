import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/debug/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $goto: sinon.spy(),
    $pageHeadTitle: key => key,
    $store: {
      getters: {
        'debug/settings': {
          enabled: false
        }
      },
      commit: sinon.spy()
    },
    $t: key => key
  }
});

describe('pages/debug/index', () => {
  describe('beforeRouteEnter', () => {
    it('stores from route as redirect', () => {
      const wrapper = factory();
      const from = { path: '/search' };
      const next = sinon.stub().yields(wrapper.vm);

      wrapper.vm.beforeRouteEnter(null, from, next);

      expect(next.called).toBe(true);
      expect(wrapper.vm.redirect).toEqual(from);
    });
  });

  describe('methods', () => {
    describe('submitForm', () => {
      const settings = { enabled: true, apiKey: 'SECRET' };

      it('commits settings to the store', () => {
        const wrapper = factory({ data: { settings } });

        wrapper.vm.submitForm();

        expect(wrapper.vm.$store.commit.calledWith('debug/updateSettings', settings)).toBe(true);
      });

      describe('when a redirect route is stored', () => {
        it('goes to the redirect route', () => {
          const redirect = { path: '/search' };
          const wrapper = factory({ data: { redirect, settings } });

          wrapper.vm.submitForm();

          expect(wrapper.vm.$goto.calledWith(redirect)).toBe(true);
        });
      });

      describe('when a redirect route is not stored', () => {
        it('goes to the root URL path', () => {
          const wrapper = factory({ data: { settings } });

          wrapper.vm.submitForm();

          expect(wrapper.vm.$goto.calledWith('/')).toBe(true);
        });
      });
    });
  });
});
