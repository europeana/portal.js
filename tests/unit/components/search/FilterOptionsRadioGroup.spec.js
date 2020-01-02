import { createLocalVue, mount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import FilterOptionsRadioGroup from '../../../../components/search/FilterOptionsRadioGroup.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(FilterOptionsRadioGroup, {
  localVue,
  mocks: {
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => true
  },
  propsData
});

describe('components/search/FilterOptionsRadioGroup', () => {
  it('emits `change` event with new value when user changes selection', async() => {
    const wrapper = factory({
      facetName: 'api',
      options: ['fulltext', 'metadata'],
      selected: 'fulltext'
    });
    const metadataRadio = wrapper.find('input[value="metadata"]');

    metadataRadio.trigger('click');

    localVue.nextTick(() => {
      wrapper.emitted()['change'].should.eql([['metadata']]);
    });
  });
});
