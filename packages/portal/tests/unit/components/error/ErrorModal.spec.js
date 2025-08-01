import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ErrorModal from '@/components/error/ErrorModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMountNuxt(ErrorModal, {
  localVue,
  propsData,
  mocks: {
    $store: {
      state: {
        error: {
          error: null
        }
      }
    },
    $t: (key) => key
  }
});

describe('components/error/ErrorModal', () => {
  afterEach(sinon.resetHistory);

  describe('watch', () => {
    describe('error (from store)', () => {
      describe('when error is fetch error', () => {
        const error = { isFetchError: true, title: 'Set not found' };
        it('does not show modal', async() => {
          const wrapper = factory();
          sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.$store.state.error.error = error;
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$bvModal.show.calledWith('error-modal')).toBe(false);
        });
      });

      describe('when error does not have title', () => {
        const error = { isFetchError: false, message: 'Set not found' };
        it('does not show modal', async() => {
          const wrapper = factory();
          sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.$store.state.error.error = error;
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$bvModal.show.calledWith('error-modal')).toBe(false);
        });
      });

      describe('when error is not fetch error, and has title', () => {
        const error = { isFetchError: false, i18n: { title: 'Set not found' } };
        it('shows modal', async() => {
          const wrapper = factory();
          sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.$store.state.error.error = error;
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$bvModal.show.calledWith('error-modal')).toBe(true);
        });
      });
    });
  });
});
