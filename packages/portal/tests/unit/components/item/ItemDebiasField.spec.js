import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemDebiasField from '@/components/item/ItemDebiasField.vue';
import * as deBiasComposable from  '@/composables/deBias.js';

const localVue = createLocalVue();

const factory = ({ propsData } = {}) => shallowMount(ItemDebiasField, {
  localVue,
  propsData,
  stubs: ['ItemDebiasTerm']
});

describe('@/components/item/ItemDebiasField', () => {
  beforeAll(() => {
    sinon.stub(deBiasComposable, 'default').returns({
      definitionOfTerm: sinon.stub().withArgs('offense').returns('May cause offense'),
      termsToHighlight: sinon.stub().withArgs('dc:title').returns([{ exact: { '@language': 'en', '@value': 'offense' } }])
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

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
