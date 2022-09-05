import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/stringify';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = () => shallowMount(component, {
  localVue
});

describe('mixins/vue/facets', () => {
  describe('stringify()', () => {
    describe('when field is not a literal', () => {
      it('returns a literal value', () => {
        const wrapper = factory();

        expect(wrapper.vm.stringify({ values: ['provider'] })).toBe('provider');
      });
    });
    describe('when field is a literal', () => {
      it('returns the value', () => {
        const wrapper = factory();

        expect(wrapper.vm.stringify('provider')).toBe('provider');
      });
    });
  });
});
