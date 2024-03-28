import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/truncate';

const component = {
  template: `
    <div></div>
  `,
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

describe('mixins/truncate', () => {
  describe('methods', () => {
    describe('truncate', () => {
      it('returns null if text is falsy', () => {
        const wrapper = factory();
        const text = undefined;

        const truncated = wrapper.vm.truncate(text);

        expect(truncated).toBeNull();
      });

      it('returns full text if not too long', () => {
        const wrapper = factory();
        const text = 'short';

        const truncated = wrapper.vm.truncate(text);

        expect(truncated).toBe('short');
      });

      it('truncates text if needed, and adds ellipsis', () => {
        const wrapper = factory();
        const text = 'short';

        const truncated = wrapper.vm.truncate(text, 3);

        expect(truncated).toBe('sho…');
      });
    });
  });
});
