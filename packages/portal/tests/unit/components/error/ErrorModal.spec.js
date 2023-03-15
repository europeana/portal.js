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
    $t: (key) => key
  }
});

describe('components/error/ErrorModal', () => {
  describe('mounted', () => {
    it('adds an event listener to the root Vue', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm.$root, '$on');

      wrapper.vm.fetch();

      expect(wrapper.vm.$root.$on.calledWith('show-error-modal', sinon.match.func)).toBe(true);
    });
  });
});
