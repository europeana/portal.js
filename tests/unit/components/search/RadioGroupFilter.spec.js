import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import RadioGroupFilter from '@/components/search/RadioGroupFilter.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(RadioGroupFilter, {
  localVue,
  stubs: ['b-row', 'b-col', 'b-form-group', 'b-form-radio-group', 'b-form-radio'],
  mocks: {
    $store: {
      dispatch: sinon.stub()
    },
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => true
  },
  propsData
});

describe('components/search/RadioGroupFilter', () => {
  it('emits `change` event with facet name and new value when user changes selection', async() => {
    const wrapper = factory({
      facetName: 'api',
      options: ['fulltext', 'metadata'],
      selected: 'fulltext'
    });
    const metadataRadio = wrapper.find('[data-qa="radio group"]');

    await wrapper.setData({
      selectedOption: 'metadata'
    });
    await metadataRadio.vm.$emit('change');
    await wrapper.vm.$nextTick();

    wrapper.emitted()['change'].should.eql([['api', 'metadata']]);
  });
});
