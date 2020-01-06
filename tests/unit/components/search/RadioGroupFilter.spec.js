import { createLocalVue, mount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import RadioGroupFilter from '../../../../components/search/RadioGroupFilter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(RadioGroupFilter, {
  localVue,
  mocks: {
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
    const metadataRadio = wrapper.find('input[value="metadata"]');

    await metadataRadio.trigger('click');

    wrapper.emitted()['change'].should.eql([['api', 'metadata']]);
  });
});
