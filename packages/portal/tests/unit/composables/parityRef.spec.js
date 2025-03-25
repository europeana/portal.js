import { ref } from 'vue';
import { createLocalVue, mount } from '@vue/test-utils';

import useRefParity from '@/composables/refParity.js';

const consumerComponent = {
  template: `
    <span class="target" :class="\`target-\${parity}\`" ref="target" />
  `,
  setup() {
    const target = ref(null);
    const { parity } = useRefParity('target', target);
    return { parity, target };
  }
};

const parentComponent = {
  template: `
    <div>
      <consumerComponent id="target1" />
      <consumerComponent id="target2" />
      <consumerComponent id="target3" />
    </div>
  `,
  components: {
    consumerComponent
  }
};

const factory = () => mount(parentComponent, {
  attachTo: document.body,
  localVue: createLocalVue()
});

describe('mixins/parity', () => {
  describe('methods', () => {
    describe('markParity', () => {
      it('adds parity classes to indicate odd/even', async() => {
        const wrapper = factory();

        await new Promise(process.nextTick);

        expect(wrapper.find('#target1').classes().includes('target-odd')).toBe(true);
        expect(wrapper.find('#target2').classes().includes('target-even')).toBe(true);
        expect(wrapper.find('#target3').classes().includes('target-odd')).toBe(true);
      });
    });
  });
});
