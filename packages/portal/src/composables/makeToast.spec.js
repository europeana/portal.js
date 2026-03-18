import sinon from 'sinon';
import useMakeToast from '@/composables/makeToast.js';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const component = {
  template: '<span />',
  setup() {
    const { makeToast } = useMakeToast();
    return { makeToast };
  }
};

const factory = () => {
  const wrapper = shallowMount(component, {
    localVue: createLocalVue()
  });
  wrapper.vm.$root.$bvToast = {
    toast: sinon.spy()
  };
  return wrapper;
};

describe('useMakeToast', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('makeToast', () => {
    it('calls $root.$bvToast.toast', () => {
      const wrapper = factory();

      wrapper.vm.makeToast('buttery');

      expect(wrapper.vm.$root.$bvToast.toast.calledWith(
        'buttery',
        {
          autoHideDelay: 5000,
          isStatus: true,
          noCloseButton: true,
          solid: true,
          toastClass: 'brand-toast',
          toaster: 'b-toaster-bottom-left'
        }
      )).toBe(true);
    });
  });
});
