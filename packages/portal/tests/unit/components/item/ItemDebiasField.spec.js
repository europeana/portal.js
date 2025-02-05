import { createLocalVue, shallowMount } from '@vue/test-utils';

import ItemDebiasField from '@/components/item/ItemDebiasField.vue';

const localVue = createLocalVue();

const factory = ({ propsData } = {}) => shallowMount(ItemDebiasField, {
  localVue,
  propsData,
  provide: {
    deBias: {
      definitions: {
        offense: 'May cause offense'
      },
      terms: {
        dcTitle: { exact: 'offense' }
      }
    }
  },
  stubs: {
    TextQuoteSelector: {
      template: `
        <span>
          <slot index="0" name="other" text="Field with something that may cause ">
            Field with something that may cause
          </slot>
          <slot index="1" text="offense">offense</slot>
          <slot index="2" name="other" text=" in it">
             in it
          </slot>
        </span>
      `
    }
  }
});

describe('@/components/item/ItemDebiasField', () => {
  it('displays de-biased terms in the text for a field', () => {
    const propsData = { name: 'dc:title', text: 'Field with something that may cause offense in it' };
    const wrapper = factory({ propsData });

    const itemDebiasTermStub = wrapper.find('itemdebiasterm-stub');

    expect(itemDebiasTermStub.attributes('term')).toBe('offense');
    expect(itemDebiasTermStub.attributes('definition')).toBe('May cause offense');
  });

  it('handles camelCased field names', () => {
    const propsData = { name: 'dcTitle', text: 'Field with something that may cause offense in it' };
    const wrapper = factory({ propsData });

    const itemDebiasTermStub = wrapper.find('itemdebiasterm-stub');

    expect(itemDebiasTermStub.attributes('term')).toBe('offense');
    expect(itemDebiasTermStub.attributes('definition')).toBe('May cause offense');
  });
});
