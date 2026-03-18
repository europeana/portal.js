import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import useHideTooltips from '@/composables/hideTooltips.js';

const component = {
  template: '<div/>',
  setup() {
    const { hideTooltips } = useHideTooltips();
    return { hideTooltips };
  }
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

describe('composables/hideTooltips', () => {
  describe('hideTooltips', () => {
    it('hides all tooltips', () => {
      const wrapper = factory();
      const rootEmit = sinon.spy(wrapper.vm.$root, '$emit');

      wrapper.vm.hideTooltips();

      expect(rootEmit.calledWith('bv::hide::tooltip')).toBe(true);
    });
  });
});
