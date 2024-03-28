import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/parity';

const component = {
  template: `
    <div>
      <span id="target1" class="target" :class="parityClasses" ref="target1" />
      <span id="target2" class="target" :class="parityClasses" ref="target2" />
      <span id="target3" class="target" :class="parityClasses" ref="target3" />
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
      it('adds parity classes to indicate odd/even', async() => {
        const wrapper = factory();

        wrapper.vm.markParity('target', 'target1');
        wrapper.vm.markParity('target', 'target2');
        wrapper.vm.markParity('target', 'target3');
        await new Promise(process.nextTick);

        expect(wrapper.find('#target1').classes().includes('target-odd')).toBe(true);
        expect(wrapper.find('#target2').classes().includes('target-even')).toBe(true);
        expect(wrapper.find('#target3').classes().includes('target-odd')).toBe(true);
      });
    });
  });
});
