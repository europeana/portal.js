import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/parity';

const component = {
  template: `
    <div>
      <span id="target1" class="target" />
      <span id="target2" class="target" />
      <span id="target3" class="target" />
    </div>
  `,
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  attachTo: document.body,
  localVue: createLocalVue()
});

describe('mixins/parity', () => {
  describe('methods', () => {
    describe('markParity', () => {
      it('adds data-parity attributes to indicate odd/even', () => {
        const wrapper = factory();

        wrapper.vm.markParity('target');

        expect(wrapper.find('#target1').attributes('data-parity')).toBe('odd');
        expect(wrapper.find('#target2').attributes('data-parity')).toBe('even');
        expect(wrapper.find('#target3').attributes('data-parity')).toBe('odd');
      });
    });
  });
});
