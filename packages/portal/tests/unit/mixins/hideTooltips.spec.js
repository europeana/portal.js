import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import mixin from '@/mixins/hideTooltips';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

describe('mixins/hideTooltips', () => {
  describe('methods', () => {
    describe('hideTooltips', () => {
      it('hides all tooltips', () => {
        const wrapper = factory();
        const rootEmit = sinon.spy(wrapper.vm.$root, '$emit');

        wrapper.vm.hideTooltips();

        expect(rootEmit.calledWith('bv::hide::tooltip')).toBe(true);
      });
    });
  });
});
