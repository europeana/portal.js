import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdown from '../../../../components/search/MoreFacetsDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MoreFacetsDropdown, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/MoreFacetsDropdown', () => {
  it('displays the correct number of selected options', () => {
    const wrapper = factory();

    wrapper.setData({
      selected: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.selectedAmount.should.eql(3);
  });
});
